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
        this.logger.debug(`[${options.identifier}] Attempting to add server...`);
        if (this.servers.has(options.identifier)) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server with identifier "${options.identifier}" already exists.`,
            });
            return;
        }
        const socket = new socketManager_1.default(this, options).getSocket();
        const server = {
            identifier: options.identifier,
            socket,
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
            connectedPlayers: [],
            frequencies: [],
        };
        this.servers.set(options.identifier, server);
        this.on(types_1.RCEEvent.Ready, (_payload) => {
            this.updatePlayers(options.identifier);
            this.updateBroadcasters(options.identifier);
            this.fetchGibs(options.identifier);
            this.logger.info(`[${options.identifier}] Server added successfully.`);
        });
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
                error: `Server with identifier "${server.identifier}" does not exist.`,
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
                error: `Server with identifier "${identifier}" does not exist.`,
            });
            return;
        }
        const server = this.servers.get(identifier);
        if (server && server.socket) {
            server.socket.close();
            Object.values(server.intervals).forEach(clearInterval);
        }
        this.servers.delete(identifier);
        this.logger.info(`[${identifier}] Server removed successfully.`);
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
                error: `Server with identifier "${identifier}" does not exist.`,
            });
            return;
        }
        const info = await this.sendCommand(identifier, "serverinfo");
        if (!info) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Failed to fetch server info for "${identifier}".`,
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
                error: `Server with identifier "${identifier}" does not exist or is not connected.`,
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
                this.logger.debug(`[${identifier}] Sending command: ${command} (ID: ${rand})`);
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
                error: `Server with identifier "${identifier}" is not connected.`,
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
            if (server.socket) {
                server.socket.close();
            }
            Object.values(server.intervals).forEach(clearInterval);
        });
        this.servers.clear();
        this.removeAllListeners();
        this.logger.info("RCEManager destroyed successfully.");
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
                error: `Server with identifier "${identifier}" does not exist.`,
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
                error: `Server with identifier "${identifier}" does not exist.`,
            });
            return;
        }
        const bradley = await this.sendCommand(identifier, "find_entity servergibs_bradley");
        const helicopter = await this.sendCommand(identifier, "find_entity servergibs_patrolhelicopter");
        if (!bradley || !helicopter) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Failed to fetch gibs for server "${identifier}".`,
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
    async updatePlayers(identifier) {
        const server = this.getServer(identifier);
        if (!server) {
            this.emit(types_1.RCEEvent.Error, {
                error: `Server with identifier "${identifier}" does not exist.`,
            });
            return;
        }
        const players = await this.sendCommand(identifier, "Users");
        if (players) {
            const playerlist = players
                .match(/"(.*?)"/g)
                .map((ign) => ign.replace(/"/g, ""));
            playerlist.shift();
            const comparePopulation = (oldList, newList) => {
                const joined = newList.filter((ign) => !oldList.includes(ign));
                const left = oldList.filter((ign) => !newList.includes(ign));
                return { joined, left };
            };
            const { joined, left } = comparePopulation(server.connectedPlayers, playerlist);
            joined.forEach((player) => {
                this.emit(types_1.RCEEvent.PlayerJoined, {
                    server,
                    ign: player,
                });
            });
            left.forEach((player) => {
                this.emit(types_1.RCEEvent.PlayerLeft, {
                    server,
                    ign: player,
                });
            });
            server.connectedPlayers = playerlist;
            this.updateServer(server);
            this.emit(types_1.RCEEvent.PlayerListUpdated, {
                server,
                players: playerlist,
                joined,
                left,
            });
        }
    }
}
exports.default = RCEManager;
//# sourceMappingURL=manager.js.map