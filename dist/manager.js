"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const socketManager_1 = __importDefault(require("./socket/socketManager"));
const events_1 = require("events");
const commandManager_1 = __importDefault(require("./commands/commandManager"));
const logger_1 = __importDefault(require("./logger"));
const teamInfo_1 = require("./data/teamInfo");
class RCEManager extends events_1.EventEmitter {
    servers = new Map();
    logger;
    /**
     *
     * @param opts Options for the RCEManager instance.
     * @param opts.logLevel The log level for the logger. Default is LogLevel.Info
     * Creates an instance of RCEManager.
     */
    constructor(opts) {
        super();
        this.logger =
            opts.logger?.instance ||
                new logger_1.default(opts.logger?.level, opts.logger?.file);
        this.on(types_1.RCEEvent.Error, (payload) => {
            if (payload.server) {
                this.logger.error(`[${payload.server.identifier}] ${payload.error}`);
            }
            else {
                this.logger.error(payload.error);
            }
        });
        this.on(types_1.RCEEvent.Ready, (payload) => {
            this.updatePlayers(payload.server.identifier);
            this.updateBroadcasters(payload.server.identifier);
            this.fetchGibs(payload.server.identifier);
            // Fetch team information on ready
            this.fetchTeamInfo(payload.server.identifier).catch((error) => {
                this.logger.debug(`[${payload.server.identifier}] Failed to fetch team info: ${error.message}`);
            });
            this.logger.info(`[${payload.server.identifier}] Server Successfully Added!`);
        });
    }
    /**
     *
     * @param options Options for the server to be added.
     * @param options.identifier Unique identifier for the server.
     * @param options.state Any additional information for the server.
     * @param options.rcon RCON connection options for the server.
     * @param options.rcon.port RCON port for the server.
     * @param options.rcon.password RCON password for the server.
     * @param options.rcon.host RCON host for the server.
     * Creates a new server instance and adds it to the manager.
     * @returns void
     */
    addServer(options) {
        this.logger.debug(`[${options.identifier}] Attempting To Add Server...`);
        if (this.servers.has(options.identifier)) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${options.identifier}" Already Exists!`,
            });
            return;
        }
        const socketManager = new socketManager_1.default(this, options);
        const socket = socketManager.getSocket();
        const server = {
            identifier: options.identifier,
            socket,
            socketManager,
            flags: [],
            intervals: {
                playerRefreshing: setInterval(() => {
                    this.updatePlayers(options.identifier);
                }, 60_000),
                frequencyRefreshing: setInterval(() => {
                    this.updateBroadcasters(options.identifier);
                }, 60_000),
                gibRefreshing: setInterval(() => {
                    this.fetchGibs(options.identifier);
                }, 60_000),
            },
            state: options.state || [],
            players: [],
            frequencies: [],
            teams: [],
        };
        this.servers.set(options.identifier, server);
    }
    /**
     *
     * @param server The server object to update.
     * @param server.identifier Unique identifier for the server.
     * @returns void
     * Updates an existing server instance in the manager.
     */
    updateServer(server) {
        if (!this.servers.has(server.identifier)) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${server.identifier}" Does Not Exist!`,
            });
            return;
        }
        this.servers.set(server.identifier, server);
    }
    /**
     *
     * @param identifier Unique identifier for the server to be removed.
     * Removes a server instance from the manager.
     * @returns void
     */
    removeServer(identifier) {
        if (!this.servers.has(identifier)) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Does Not Exist!`,
            });
            return;
        }
        const server = this.servers.get(identifier);
        if (server) {
            // Properly destroy the SocketManager to stop reconnection attempts
            if (server.socketManager) {
                server.socketManager.destroy();
            }
            if (server.socket) {
                server.socket.close();
            }
            Object.values(server.intervals).forEach(clearInterval);
        }
        this.servers.delete(identifier);
        this.logger.info(`[${identifier}] Server Successfully Removed!`);
    }
    /**
     *
     * @param identifier Unique identifier for the server to be fetched.
     * Retrieves a server instance by its identifier.
     * @returns IServer | null
     */
    getServer(identifier) {
        return this.servers.get(identifier) || null;
    }
    /**
     *
     * @param identifier Unique identifier for the server to fetch information from.
     * Fetches server information using the RCON command "serverinfo".
     * @returns IRustServerInformation | string | undefined
     */
    async fetchInfo(identifier) {
        const server = this.getServer(identifier);
        if (!server) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Does Not Exist!`,
            });
            return;
        }
        const info = await this.sendCommand(identifier, "serverinfo");
        if (!info) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Failed To Fetch Server Information For "${identifier}"!`,
            });
            return;
        }
        let cleanOutput = info.replace(/\\n/g, "").trim();
        try {
            const json = JSON.parse(cleanOutput);
            return json;
        }
        catch (error) {
            return info;
        }
    }
    /**
     *
     * @param identifier Unique identifier for the server to send the command to.
     * @param command The command to be sent to the server.
     * Sends a command to the server using the RCON connection.
     * @returns Promise<string | undefined>
     */
    async sendCommand(identifier, command) {
        const server = this.getServer(identifier);
        if (!server?.socket) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Does Not Exist Or Is Not Connected!`,
            });
            return;
        }
        if (!server.flags.includes("READY"))
            return undefined;
        if (server.socket.readyState === server.socket.OPEN) {
            const rand = Math.floor(Math.random() * 999999999);
            return new Promise(async (resolve, reject) => {
                commandManager_1.default.add({
                    identifier,
                    command,
                    uniqueId: rand,
                    resolve,
                    reject,
                });
                server.socket.send(JSON.stringify({
                    message: command,
                    identifier: rand,
                }));
                this.logger.debug(`[${identifier}] Sending Command: ${command} (ID: ${rand})`);
                const cmd = commandManager_1.default.get(identifier, rand);
                if (cmd) {
                    cmd.timeout = setTimeout(() => {
                        commandManager_1.default.remove(cmd);
                        resolve(undefined);
                    }, 3_000);
                }
            });
        }
        else {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Is Not Connected!`,
            });
            return;
        }
    }
    /**
     * Destroys the RCEManager instance, cleaning up all resources.
     * Closes all server sockets, clears intervals, and removes all listeners.
     */
    destroy() {
        this.servers.forEach((server) => {
            // Properly destroy the SocketManager to stop reconnection attempts
            if (server.socketManager) {
                server.socketManager.destroy();
            }
            if (server.socket) {
                server.socket.close();
            }
            Object.values(server.intervals).forEach(clearInterval);
        });
        this.servers.clear();
        this.removeAllListeners();
        this.logger.info("RCEManager Successfully Destroyed!");
    }
    /*
      Event Handling
    */
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    off(event, listener) {
        return super.off(event, listener);
    }
    /*
      Scheduled Tasks
    */
    async updateBroadcasters(identifier) {
        const server = this.getServer(identifier);
        if (!server) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Does Not Exist!`,
            });
            return;
        }
        const broadcasters = await this.sendCommand(identifier, "rf.listboardcaster");
        if (broadcasters) {
            const broadcasts = [];
            const regex = /\[(\d+) MHz\] Position: \(([\d.-]+), ([\d.-]+), ([\d.-]+)\), Range: (\d+)/g;
            let match;
            while ((match = regex.exec(broadcasters)) !== null) {
                const frequency = parseInt(match[1], 10);
                const coordinates = [
                    parseFloat(match[2]),
                    parseFloat(match[3]),
                    parseFloat(match[4]),
                ];
                const range = parseInt(match[5], 10);
                broadcasts.push({ frequency, coordinates, range });
            }
            server.frequencies.forEach((freq) => {
                if (!broadcasts.find((b) => parseInt(b.frequency) === freq)) {
                    this.emit(types_1.RCEEvent.FrequencyLost, {
                        server,
                        frequency: freq,
                    });
                    server.frequencies = server.frequencies.filter((f) => f !== freq);
                }
            });
            broadcasts.forEach((broadcast) => {
                if (server.frequencies.includes(broadcast.frequency))
                    return;
                server.frequencies.push(broadcast.frequency);
                if (broadcast.frequency === 4765) {
                    this.emit(types_1.RCEEvent.EventStart, {
                        server,
                        event: "Small Oil Rig",
                        special: false,
                    });
                }
                else if (broadcast.frequency === 4768) {
                    this.emit(types_1.RCEEvent.EventStart, {
                        server,
                        event: "Oil Rig",
                        special: false,
                    });
                }
                this.emit(types_1.RCEEvent.FrequencyGained, {
                    server,
                    frequency: broadcast.frequency,
                    coordinates: broadcast.coordinates,
                    range: broadcast.range,
                });
            });
            this.updateServer(server);
        }
    }
    async fetchGibs(identifier) {
        const server = this.getServer(identifier);
        if (!server) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Does Not Exist!`,
            });
            return;
        }
        const bradley = await this.sendCommand(identifier, "find_entity servergibs_bradley");
        const helicopter = await this.sendCommand(identifier, "find_entity servergibs_patrolhelicopter");
        if (!bradley || !helicopter) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Failed To Fetch Gibs For Server "${identifier}"`,
            });
            return;
        }
        if (bradley.includes("servergibs_bradley") &&
            !server.flags.includes("BRADLEY")) {
            server.flags.push("BRADLEY");
            setTimeout(() => {
                const s = this.getServer(identifier);
                if (s) {
                    s.flags = s.flags.filter((f) => f !== "BRADLEY");
                    this.updateServer(s);
                }
            }, 60_000 * 10);
            this.emit(types_1.RCEEvent.EventStart, {
                server,
                event: "Bradley APC Debris",
                special: false,
            });
        }
        if (helicopter.includes("servergibs_patrolhelicopter") &&
            !server.flags.includes("HELICOPTER")) {
            server.flags.push("HELICOPTER");
            setTimeout(() => {
                const s = this.getServer(identifier);
                if (s) {
                    s.flags = s.flags.filter((f) => f !== "HELICOPTER");
                    this.updateServer(s);
                }
            }, 60_000 * 10);
            this.emit(types_1.RCEEvent.EventStart, {
                server,
                event: "Patrol Helicopter Debris",
                special: false,
            });
        }
        this.updateServer(server);
    }
    /**
     * Creates a placeholder player or returns existing one, optionally updating player data
     * @param identifier Server identifier
     * @param playerName Player's IGN
     * @param playerData Optional data to set on the player
     * @returns Player object (existing or newly created placeholder)
     */
    getOrCreatePlayer(identifier, playerName, playerData) {
        const server = this.getServer(identifier);
        if (!server) {
            throw new Error(`Server with identifier "${identifier}" not found`);
        }
        let player = server.players.find((p) => p.ign === playerName);
        let isNewPlayer = false;
        if (!player) {
            // Create placeholder player
            player = {
                ign: playerName,
                ping: 0,
                timeConnected: 0,
                health: 0,
                team: null,
                platform: undefined,
            };
            server.players.push(player);
            isNewPlayer = true;
        }
        // Apply any provided data
        if (playerData) {
            Object.assign(player, playerData);
        }
        // Update server if we created a new player or modified existing data
        if (isNewPlayer || playerData) {
            this.updateServer(server);
        }
        return player;
    }
    /**
     * Fetches team information and updates team references for all players
     * @param identifier Server identifier
     */
    async fetchTeamInfo(identifier) {
        const server = this.getServer(identifier);
        if (!server)
            return;
        const rawTeamInfo = await this.sendCommand(identifier, "relationshipmanager.teaminfoall");
        if (!rawTeamInfo)
            return;
        // Clear existing team references
        server.players.forEach((player) => {
            player.team = null;
        });
        const { teams } = (0, teamInfo_1.parseTeamInfo)(rawTeamInfo, server.players);
        // Update teams list
        server.teams = teams;
        this.updateServer(server);
    }
    /**
     * Gets all teams on the server
     * @param identifier Server identifier
     * @returns Array of teams with their leaders and members
     */
    getTeams(identifier) {
        const server = this.getServer(identifier);
        return server ? server.teams : [];
    }
    /**
     * Gets a specific team by ID
     * @param identifier Server identifier
     * @param teamId Team ID to find
     * @returns Team object or undefined if not found
     */
    getTeam(identifier, teamId) {
        const server = this.getServer(identifier);
        return server ? server.teams.find((team) => team.id === teamId) : undefined;
    }
    /**
     * Gets the team that a specific player belongs to
     * @param identifier Server identifier
     * @param playerName Player's IGN
     * @returns Team object or undefined if player is not in a team
     */
    getPlayerTeam(identifier, playerName) {
        const server = this.getServer(identifier);
        if (!server)
            return undefined;
        const player = server.players.find((p) => p.ign === playerName);
        return player?.team || undefined;
    }
    async updatePlayers(identifier) {
        const server = this.getServer(identifier);
        if (!server) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server With Identifier "${identifier}" Does Not Exist!`,
            });
            return;
        }
        const rawPlayerList = await this.sendCommand(identifier, "playerlist");
        if (rawPlayerList) {
            const parsedPlayers = JSON.parse(rawPlayerList);
            // Update existing players with new data, preserve team and platform references
            const existingPlayers = server.players;
            const existingPlayerNames = new Set(existingPlayers.map((p) => p.ign));
            const newPlayerNames = new Set(parsedPlayers.map((p) => p.DisplayName));
            const joined = [];
            const left = existingPlayers.filter((player) => !newPlayerNames.has(player.ign));
            // Update existing players and identify new ones
            parsedPlayers.forEach((playerData) => {
                const playerName = playerData.DisplayName;
                const existingPlayer = existingPlayers.find((p) => p.ign === playerName);
                if (existingPlayer) {
                    // Update existing player data but preserve team and platform references
                    existingPlayer.ping = playerData.Ping;
                    existingPlayer.timeConnected = playerData.ConnectedSeconds;
                    existingPlayer.health = Math.round(playerData.Health);
                    // team and platform are preserved from existing player
                }
                else {
                    // Create new player with default values
                    const newPlayer = {
                        ign: playerName,
                        ping: playerData.Ping,
                        timeConnected: playerData.ConnectedSeconds,
                        health: Math.round(playerData.Health),
                        team: null, // Will be set by team events or connection
                        platform: undefined, // Will be set from respawn events
                    };
                    joined.push(newPlayer);
                    existingPlayers.push(newPlayer);
                }
            });
            // Remove players that are no longer connected
            left.forEach((player) => {
                const index = existingPlayers.indexOf(player);
                if (index > -1) {
                    existingPlayers.splice(index, 1);
                }
            });
            // Emit events for joined players
            joined.forEach((player) => {
                this.emit(types_1.RCEEvent.PlayerJoined, {
                    server,
                    player,
                });
            });
            // Emit events for left players
            left.forEach((player) => {
                this.emit(types_1.RCEEvent.PlayerLeft, {
                    server,
                    player,
                });
            });
            this.updateServer(server);
            this.emit(types_1.RCEEvent.PlayerListUpdated, {
                server,
                players: existingPlayers,
                joined,
                left,
            });
        }
    }
}
exports.default = RCEManager;
//# sourceMappingURL=manager.js.map