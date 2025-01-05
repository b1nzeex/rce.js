"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ServerUtils_1 = __importDefault(require("../util/ServerUtils"));
const CommandHandler_1 = __importDefault(require("./CommandHandler"));
const helper_1 = __importDefault(require("../helper"));
class ServerManager {
    _manager;
    _auth;
    _socket;
    _servers = new Map();
    constructor(manager, auth, socket) {
        this._manager = manager;
        this._auth = auth;
        this._socket = socket;
    }
    /**
     *
     * @param opts {ServerOptions[]} - The server options
     * @returns {Promise<void>} - Resolves once all servers have been added
     * @description Adds multiple servers to the manager
     *
     * @example
     * ```js
     * await manager.servers.addMany([
     *  {
     *    identifier: "my-server-id",
     *    serverId: 1234567,
     *    region: "EU",
     *    playerRefreshing: true,
     *    radioRefreshing: true,
     *    extendedEventRefreshing: true,
     *    intents: [RCEIntent.All]
     *  },
     *  {
     *    identifier: "my-server-id-2",
     *    serverId: 7654321,
     *    region: "US",
     *    playerRefreshing: true,
     *    radioRefreshing: true,
     *    extendedEventRefreshing: true,
     *    intents: [RCEIntent.All]
     *  }
     * ]);
     * ```
     */
    async addMany(opts) {
        await Promise.all(opts.map((opt) => this.add(opt)));
    }
    /**
     *
     * @param opts {ServerOptions} - The server options
     * @returns {Promise<boolean>} - Whether the server was added successfully
     * @description Adds a server to the manager
     *
     * @example
     * ```js
     * const server = await manager.servers.add({
     *  identifier: "my-server-id",
     *  serverId: 1234567,
     *  region: "EU",
     *  playerRefreshing: true,
     *  radioRefreshing: true,
     *  extendedEventRefreshing: true,
     *  intents: [RCEIntent.All]
     * });
     * ```
     */
    async add(opts) {
        this._manager.logger.debug(`Adding Server: ${opts.identifier}`);
        if (!Array.isArray(opts.serverId) || !opts.serverId[1]) {
            opts.serverId = [
                Array.isArray(opts.serverId) ? opts.serverId[0] : opts.serverId,
            ];
            if (!Number(opts.serverId[0]) ||
                opts.serverId[0].toString().length !== 7) {
                ServerUtils_1.default.error(this._manager, `[${opts.identifier}] Failed To Add Server: Invalid SID (Incorrect Length)`);
                return false;
            }
            const sid = await this.fetchId(opts.identifier, opts.serverId[0], opts.region);
            if (sid) {
                opts.serverId.push(sid);
            }
        }
        if (!opts.serverId[1]) {
            ServerUtils_1.default.error(this._manager, `[${opts.identifier}] Failed To Add Server: Invalid SID`);
            return false;
        }
        const status = await this.fetchStatus(opts.identifier, opts.serverId[1], opts.region);
        if (!status) {
            ServerUtils_1.default.error(this._manager, `[${opts.identifier}] Failed To Add Server: No Status Information`);
            return false;
        }
        if (status === "SUSPENDED") {
            ServerUtils_1.default.error(this._manager, `[${opts.identifier}] Failed To Add Server: Suspended`);
            return false;
        }
        this._servers.set(opts.identifier, {
            identifier: opts.identifier,
            serverId: opts.serverId,
            region: opts.region,
            intervals: {
                playerRefreshing: {
                    enabled: opts.playerRefreshing ?? false,
                    interval: opts.playerRefreshing
                        ? setInterval(() => {
                            const s = this.get(opts.identifier);
                            if (s?.status === "RUNNING") {
                                this.updatePlayers(opts.identifier);
                            }
                        }, 60_000)
                        : undefined,
                },
                radioRefreshing: {
                    enabled: opts.radioRefreshing ?? false,
                    interval: opts.radioRefreshing
                        ? setInterval(() => {
                            const s = this.get(opts.identifier);
                            if (s?.status === "RUNNING") {
                                this.updateBroadcasters(opts.identifier);
                            }
                        }, 30_000)
                        : undefined,
                },
                extendedEventRefreshing: {
                    enabled: opts.extendedEventRefreshing ?? false,
                    interval: opts.extendedEventRefreshing
                        ? setInterval(() => {
                            const s = this.get(opts.identifier);
                            if (s?.status === "RUNNING") {
                                this.fetchGibs(opts.identifier);
                            }
                        }, 60_000)
                        : undefined,
                },
            },
            flags: [],
            state: opts.state ?? [],
            status: status,
            players: [],
            frequencies: [],
            intents: opts.intents,
        });
        const server = this._servers.get(opts.identifier);
        this._socket.addServer(server);
        this._manager.logger.debug(`[${server.identifier}] Server Status: ${status}`);
        if (status === "RUNNING") {
            await ServerUtils_1.default.setReady(this._manager, server, true);
            if (opts.playerRefreshing) {
                await this.updatePlayers(opts.identifier);
            }
            if (opts.radioRefreshing) {
                await this.updateBroadcasters(opts.identifier);
            }
            if (opts.extendedEventRefreshing) {
                await this.fetchGibs(opts.identifier);
            }
        }
        return true;
    }
    /**
     *
     * @param server {RustServer} - The server to update
     * @returns {void}
     * @description Updates a server
     *
     * @example
     * ```js
     * manager.servers.update(server);
     * ```
     */
    update(server) {
        this._manager.logger.debug(`[${server.identifier}] Updating Server`);
        this._servers.set(server.identifier, server);
    }
    /**
     * @returns {void}
     * @description Removes all servers from the manager
     *
     * @example
     * ```js
     * manager.servers.removeAll();
     * ```
     */
    removeAll() {
        this._servers.forEach((server) => this.remove(server));
    }
    /**
     *
     * @param identifiers {string[]} - The server identifiers to remove
     * @returns {void}
     * @description Removes multiple servers from the manager
     *
     * @example
     * ```js
     * manager.servers.removeMany(["my-server-id", "my-server-id-2"]);
     * ```
     */
    removeMany(identifiers) {
        identifiers.forEach((identifier) => {
            const server = this.get(identifier);
            if (server) {
                this.remove(server);
            }
        });
    }
    /**
     *
     * @param server {RustServer} - The server to remove
     * @returns {void}
     * @description Removes a server from the manager
     *
     * @example
     * ```js
     * manager.servers.remove(server);
     * ```
     */
    remove(server) {
        this._manager.logger.debug(`[${server.identifier}] Removing Server`);
        clearInterval(server.intervals.playerRefreshing.interval);
        clearInterval(server.intervals.radioRefreshing.interval);
        clearInterval(server.intervals.extendedEventRefreshing.interval);
        this._socket.removeServer(server);
        this._servers.delete(server.identifier);
        this._manager.logger.info(`[${server.identifier}] Server Removed`);
    }
    /**
     *
     * @param identifier {string} - The server identifier
     * @returns {RustServer | undefined} - The server
     * @description Gets a server by its identifier
     *
     * @example
     * ```js
     * const server = manager.servers.get("my-server-id");
     * ```
     */
    get(identifier) {
        return this._servers.get(identifier);
    }
    /**
     *
     * @returns {RustServer[]} - All servers
     * @description Gets all servers
     *
     * @example
     * ```js
     * const servers = manager.servers.getAll();
     * ```
     */
    getAll() {
        return this._servers;
    }
    /**
     *
     * @param identifier - The server identifier
     * @param rawHostname - Whether to return the raw hostname
     * @returns {Promise<RustServerInformation | null>} - The server information
     *
     * @example
     * ```js
     * const info = await manager.servers.info("my-server-id");
     * ```
     *
     * @example
     * ```js
     * const info = await manager.servers.info("my-server-id", true);
     * ```
     */
    async info(identifier, rawHostname = false) {
        const server = this.get(identifier);
        if (!server) {
            ServerUtils_1.default.error(this._manager, `[${identifier}] Invalid Server`);
            return null;
        }
        const info = await this.command(server.identifier, "serverinfo", true);
        if (!info?.response) {
            ServerUtils_1.default.error(this._manager, "Failed To Fetch Server Info", server);
            return null;
        }
        const data = helper_1.default.cleanOutput(info.response, true, rawHostname);
        return data;
    }
    /**
     *
     * @param identifier - The server identifier
     * @param command - The command to send
     * @param response - Whether to wait for a response
     * @returns {Promise<CommandResponse>} - The command response
     *
     * @example
     * ```js
     * await manager.servers.command("my-server-id", "say Hello World!");
     * ```
     *
     * @example
     * ```js
     * const response = await manager.servers.command("my-server-id", "getauthlevels", true);
     * ```
     */
    async command(identifier, command, response = false) {
        const token = this._auth?.accessToken;
        if (!token) {
            ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Send Command: No Access Token`);
            return { ok: false, error: "No Access Token" };
        }
        const server = this._servers.get(identifier);
        if (!server) {
            ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Send Command: Invalid Server`);
            return { ok: false, error: "Invalid Server" };
        }
        if (server.status !== "RUNNING") {
            this._manager.logger.warn(`[${identifier}] Failed To Send Command: Server Not Running`);
            return { ok: false, error: "Server Not Running" };
        }
        this._manager.logger.debug(`[${identifier}] Sending Command: ${command}`);
        const payload = {
            operationName: "sendConsoleMessage",
            variables: {
                sid: server.serverId[1],
                region: server.region,
                message: command,
            },
            query: "mutation sendConsoleMessage($sid: Int!, $region: REGION!, $message: String!) {\n  sendConsoleMessage(rsid: {id: $sid, region: $region}, message: $message) {\n    ok\n    __typename\n  }\n}",
        };
        if (response) {
            return new Promise(async (resolve, reject) => {
                CommandHandler_1.default.add({
                    identifier,
                    command,
                    resolve,
                    reject,
                });
                try {
                    const response = await fetch(constants_1.GPortalRoutes.Api, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    });
                    if (!response.ok) {
                        ServerUtils_1.default.error(this._manager, `Failed To Send Command: HTTP ${response.status} ${response.statusText}`, server);
                        CommandHandler_1.default.remove(CommandHandler_1.default.get(identifier, command));
                        resolve({
                            ok: false,
                            error: `HTTP ${response.status} ${response.statusText}`,
                        });
                    }
                    const data = await response.json();
                    if (!data?.data?.sendConsoleMessage?.ok) {
                        ServerUtils_1.default.error(this._manager, "Failed To Send Command: AioRpcError", server);
                        CommandHandler_1.default.remove(CommandHandler_1.default.get(identifier, command));
                        resolve({
                            ok: false,
                            error: "AioRpcError",
                        });
                    }
                    const cmd = CommandHandler_1.default.get(identifier, command);
                    if (cmd) {
                        cmd.timeout = setTimeout(() => {
                            CommandHandler_1.default.remove(CommandHandler_1.default.get(identifier, command));
                            resolve({
                                ok: true,
                                response: undefined,
                            });
                        }, 3_000);
                    }
                }
                catch (error) {
                    CommandHandler_1.default.remove(CommandHandler_1.default.get(identifier, command));
                    resolve({
                        ok: false,
                        error: error.message,
                    });
                }
            });
        }
        else {
            try {
                const response = await fetch(constants_1.GPortalRoutes.Api, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    ServerUtils_1.default.error(this._manager, `Failed To Send Command: HTTP ${response.status} ${response.statusText}`, server);
                    return {
                        ok: false,
                        error: `HTTP ${response.status} ${response.statusText}`,
                    };
                }
                return {
                    ok: true,
                    response: undefined,
                };
            }
            catch (error) {
                ServerUtils_1.default.error(this._manager, `Failed To Send Command: ${error}`, server);
                return {
                    ok: false,
                    error: error.message,
                };
            }
        }
    }
    async updateBroadcasters(identifier) {
        const server = this.get(identifier);
        if (!server) {
            return this._manager.logger.warn(`[${identifier}] Failed To Update Broadcasters: Invalid Server`);
        }
        this._manager.logger.debug(`[${server.identifier}] Updating Broadcasters`);
        const broadcasters = await this.command(server.identifier, "rf.listboardcaster", true);
        if (!broadcasters?.response) {
            return this._manager.logger.warn(`[${server.identifier}] Failed To Update Broadcasters`);
        }
        const broadcasts = [];
        const regex = /\[(\d+) MHz\] Position: \(([\d.-]+), ([\d.-]+), ([\d.-]+)\), Range: (\d+)/g;
        let match;
        while ((match = regex.exec(broadcasters.response)) !== null) {
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
                this._manager.events.emit(constants_1.RCEEvent.FrequencyLost, {
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
                this._manager.events.emit(constants_1.RCEEvent.EventStart, {
                    server,
                    event: "Small Oil Rig",
                    special: false,
                });
            }
            else if (broadcast.frequency === 4768) {
                this._manager.events.emit(constants_1.RCEEvent.EventStart, {
                    server,
                    event: "Oil Rig",
                    special: false,
                });
            }
            this._manager.events.emit(constants_1.RCEEvent.FrequencyGained, {
                server,
                frequency: broadcast.frequency,
                coordinates: broadcast.coordinates,
                range: broadcast.range,
            });
        });
        this.update(server);
        this._manager.logger.debug(`[${server.identifier}] Broadcasters Updated`);
    }
    async fetchGibs(identifier) {
        const server = this.get(identifier);
        if (!server) {
            return this._manager.logger.warn(`[${identifier}] Failed To Fetch Gibs: Invalid Server`);
        }
        this._manager.logger.debug(`[${server.identifier}] Fetching Gibs`);
        const bradley = await this.command(server.identifier, "find_entity servergibs_bradley", true);
        const heli = await this.command(server.identifier, "find_entity servergibs_patrolhelicopter", true);
        if (!bradley?.response || !heli?.response) {
            return this._manager.logger.warn(`[${server.identifier}] Failed To Fetch Gibs`);
        }
        if (bradley.response.includes("servergibs_bradley") &&
            !server.flags.includes("BRADLEY")) {
            server.flags.push("BRADLEY");
            setTimeout(() => {
                const s = this.get(server.identifier);
                if (s) {
                    s.flags = s.flags.filter((f) => f !== "BRADLEY");
                    this.update(s);
                }
            }, 60_000 * 10);
            this._manager.events.emit(constants_1.RCEEvent.EventStart, {
                server,
                event: "Bradley APC Debris",
                special: false,
            });
        }
        if (heli.response.includes("servergibs_patrolhelicopter") &&
            !server.flags.includes("HELICOPTER")) {
            server.flags.push("HELICOPTER");
            setTimeout(() => {
                const s = this.get(server.identifier);
                if (s) {
                    s.flags = s.flags.filter((f) => f !== "HELICOPTER");
                    this.update(s);
                }
            }, 60_000 * 10);
            this._manager.events.emit(constants_1.RCEEvent.EventStart, {
                server,
                event: "Patrol Helicopter Debris",
                special: false,
            });
        }
        this.update(server);
        this._manager.logger.debug(`[${server.identifier}] Gibs Fetched`);
    }
    async updatePlayers(identifier) {
        const server = this.get(identifier);
        if (!server) {
            return this._manager.logger.warn(`[${identifier}] Failed To Update Players: Invalid Server`);
        }
        this._manager.logger.debug(`[${server.identifier}] Updating Players`);
        const players = await this.command(server.identifier, "Users", true);
        if (!players?.response) {
            return this._manager.logger.warn(`[${server.identifier}] Failed To Update Players`);
        }
        const playerlist = players.response
            .match(/"(.*?)"/g)
            .map((ign) => ign.replace(/"/g, ""));
        playerlist.shift();
        const { joined, left } = helper_1.default.comparePopulation(server.players, playerlist);
        joined.forEach((player) => {
            this._manager.events.emit(constants_1.RCEEvent.PlayerJoined, {
                server,
                ign: player,
            });
        });
        left.forEach((player) => {
            this._manager.events.emit(constants_1.RCEEvent.PlayerLeft, {
                server,
                ign: player,
            });
        });
        server.players = playerlist;
        this.update(server);
        this._manager.events.emit(constants_1.RCEEvent.PlayerListUpdated, {
            server,
            players: playerlist,
            joined,
            left,
        });
        this._manager.logger.debug(`[${server.identifier}] Players Updated`);
    }
    /**
     *
     * @param region - The region to fetch servers from
     * @returns {Promise<FetchedServer[]>} - The fetched servers
     * @description Fetches servers from the authorized GPortal account
     *
     * @example
     * ```js
     * const servers = await manager.servers.fetchServers("EU");
     * ```
     *
     * @example
     * ```js
     * const servers = await manager.servers.fetchServers("US");
     * ```
     *
     * @example
     * ```js
     * const servers = await manager.servers.fetchServers();
     * ```
     */
    async fetchServers(region) {
        const token = this._auth?.accessToken;
        if (!token) {
            this._manager.logger.warn("Failed To Fetch Servers: No Access Token");
            return [];
        }
        this._manager.logger.debug("Fetching Servers");
        if (!region) {
            const eu = await this.fetchServers("EU");
            const us = await this.fetchServers("US");
            return [...eu, ...us];
        }
        try {
            const response = await fetch(`${constants_1.GPortalRoutes.Origin}/${region === "EU" ? "eur" : "int"}/menu/clouds`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                this._manager.logger.warn(`Failed To Fetch Servers: ${response.status} ${response.statusText}`);
                return [];
            }
            const data = await response.json();
            const fetchedServers = data?.items
                ?.filter((s) => s.label.includes("Rust"))
                .map((s) => {
                return {
                    rawName: s.items[0].label,
                    name: s.items[0].label.replace(/<color=[^>]+>|<\/color>/g, ""),
                    region,
                    sid: [Number(s.items[0].data.url.split("/")[4])],
                };
            });
            const resolveIdsRequest = await fetch(`${constants_1.GPortalRoutes.Origin}/${region === "EU" ? "eur" : "int"}/serviceIds`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!resolveIdsRequest.ok) {
                this._manager.logger.warn(`Failed To Fetch Servers: ${resolveIdsRequest.status} ${resolveIdsRequest.statusText}`);
                return fetchedServers ?? [];
            }
            const resolvedIds = await resolveIdsRequest.json();
            fetchedServers?.forEach((s) => {
                const resolvedId = resolvedIds.find((r) => r.serverId === s.sid[0]);
                if (resolvedId) {
                    s.sid.push(resolvedId.serviceId);
                }
            });
            return fetchedServers ?? [];
        }
        catch (error) {
            ServerUtils_1.default.error(this._manager, `Failed To Fetch Servers: ${error}`);
            return [];
        }
    }
    async fetchStatus(identifier, sid, region) {
        const token = this._auth?.accessToken;
        if (!token) {
            console.error(`[${identifier}] Failed To Fetch Server Status: No Access Token`);
            return null;
        }
        this._manager.logger.debug(`[${identifier}] Fetching Server Status`);
        try {
            const response = await fetch(constants_1.GPortalRoutes.Api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    operationName: "ctx",
                    variables: {
                        sid,
                        region,
                    },
                    query: "query ctx($sid: Int!, $region: REGION!) {\n  cfgContext(rsid: {id: $sid, region: $region}) {\n    ns {\n      ...CtxFields\n      __typename\n    }\n    errors {\n      mutator\n      affectedPaths\n      error {\n        class_\n        args\n        __typename\n      }\n      scope\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment GameServerFields on GameServer {\n  id\n  serverName\n  serverPort\n  serverIp\n  __typename\n}\n\nfragment PermissionFields on Permission {\n  userName\n  created\n  __typename\n}\n\nfragment MysqlDbFields on CustomerMysqlDb {\n  httpUrl\n  host\n  port\n  database\n  username\n  password\n  __typename\n}\n\nfragment ServiceStateFields on ServiceState {\n  state\n  fsmState\n  fsmIsTransitioning\n  fsmIsExclusiveLocked\n  fsmFileAccess\n  fsmLastStateChange\n  fsmStateLiveProgress {\n    ... on InstallProgress {\n      action\n      percentage\n      __typename\n    }\n    ... on BroadcastProgress {\n      nextMessageAt\n      stateExitAt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment RestartTaskFields on RestartTask {\n  id\n  runOnWeekday\n  runOnDayofmonth\n  runAtTimeofday\n  runInTimezone\n  schedule\n  data {\n    description\n    args\n    scheduleExtended\n    nextFireTime\n    __typename\n  }\n  __typename\n}\n\nfragment DisplayPortFields on DisplayPorts {\n  rconPort\n  queryPort\n  __typename\n}\n\nfragment SteamWorkshopItemFields on SteamWorkshopItem {\n  id\n  appId\n  itemType\n  name\n  links {\n    websiteUrl\n    __typename\n  }\n  summary\n  logo {\n    url\n    __typename\n  }\n  maps {\n    workshopId\n    mapName\n    __typename\n  }\n  dateCreated\n  dateModified\n  __typename\n}\n\nfragment SevenDaysModFields on SevenDaysMod {\n  id\n  name\n  repoKey\n  active\n  created\n  modified\n  __typename\n}\n\nfragment MapParams on FarmingSimulatorMapParamsObject {\n  serverIp\n  webServerPort\n  webStatsCode\n  token\n  __typename\n}\n\nfragment CtxFields on RootNamespace {\n  sys {\n    game {\n      name\n      key\n      platform\n      forumBoardId\n      supportedPlatforms\n      __typename\n    }\n    extraGameTranslationKeys\n    gameServer {\n      ...GameServerFields\n      __typename\n    }\n    permissionsOwner {\n      ...PermissionFields\n      __typename\n    }\n    permissions {\n      ...PermissionFields\n      __typename\n    }\n    mysqlDb {\n      ...MysqlDbFields\n      __typename\n    }\n    __typename\n  }\n  service {\n    config {\n      rsid {\n        id\n        region\n        __typename\n      }\n      type\n      hwId\n      state\n      ftpUser\n      ftpPort\n      ftpPassword\n      ftpReadOnly\n      ipAddress\n      rconPort\n      queryPort\n      autoBackup\n      dnsNames\n      currentVersion\n      targetVersion\n      __typename\n    }\n    latestRev {\n      id\n      created\n      __typename\n    }\n    maxSlots\n    files\n    memory {\n      base\n      effective\n      __typename\n    }\n    currentState {\n      ...ServiceStateFields\n      __typename\n    }\n    backups {\n      id\n      userSize\n      created\n      isAutoBackup\n      __typename\n    }\n    restartSchedule {\n      ...RestartTaskFields\n      __typename\n    }\n    dnsAvailableTlds\n    __typename\n  }\n  admin {\n    hardwareGuacamoleConnection {\n      url\n      __typename\n    }\n    __typename\n  }\n  profile {\n    __typename\n    ... on ProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        ...DisplayPortFields\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      __typename\n    }\n    ... on MinecraftProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        rconPort\n        queryPort\n        additionalPorts\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      worlds\n      addonRam\n      isRamServer\n      ramOrderCreationDate\n      ramStopTimeUtc\n      isConnectedToBungeecord\n      bungeecordServerUrl\n      executables {\n        id\n        name\n        key\n        default\n        __typename\n      }\n      mods {\n        id\n        repoKey\n        name\n        image\n        mindRam\n        projectUrl\n        revisions {\n          id\n          created\n          executableId\n          extraData\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on CsgoProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        rconPort\n        queryPort\n        gotvPort\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      selectedWorkshopItems {\n        ...SteamWorkshopItemFields\n        __typename\n      }\n      installedMaps {\n        name\n        displayName\n        workshopItem {\n          ...SteamWorkshopItemFields\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on ValheimProfileNamespace {\n      name\n      cfgFiles\n      clientLink\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        ...DisplayPortFields\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      __typename\n    }\n    ... on HellLetLooseProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        rconPort\n        queryPort\n        statsPort\n        beaconPort\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      __typename\n    }\n    ... on SevenDaysToDieProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        rconPort\n        queryPort\n        telnetPort\n        webDashboardPort\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      availableMods {\n        ...SevenDaysModFields\n        __typename\n      }\n      isModUpdateAvailable\n      __typename\n    }\n    ... on SoulmaskProfileNamespace {\n      name\n      cfgFiles\n      gameUid\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        ...DisplayPortFields\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      __typename\n    }\n    ... on VRisingProfileNamespace {\n      name\n      cfgFiles\n      isLaunchServer\n      isOfficialServer\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        ...DisplayPortFields\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      __typename\n    }\n    ... on RustConsoleProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        ...DisplayPortFields\n        __typename\n      }\n      enableCustomerDb\n      modifyActionHints\n      __typename\n    }\n    ... on FarmingSimulatorProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      wiLink\n      defaultModSpace\n      masterWiLink\n      displayPorts {\n        rconPort\n        queryPort\n        webPort\n        __typename\n      }\n      mapParams {\n        ...MapParams\n        __typename\n      }\n      __typename\n    }\n    ... on BungeecordProfileNamespace {\n      name\n      cfgFiles\n      logFiles\n      publicConfigs\n      configDefinition\n      displayPorts {\n        ...DisplayPortFields\n        __typename\n      }\n      enableCustomerDb\n      enableCustomHostnames\n      gpServers\n      accessibleMinecraftServers {\n        ...GameServerFields\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}",
                }),
            });
            if (!response.ok) {
                ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Fetch Server Status: ${response.status} ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            return data?.data?.cfgContext?.ns?.service?.currentState
                ?.state;
        }
        catch (error) {
            ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Fetch Server Status: ${error.message}`);
            return null;
        }
    }
    async fetchId(identifier, sid, region) {
        const token = this._auth?.accessToken;
        if (!token) {
            ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Fetch Server ID: No Access Token`);
            return null;
        }
        this._manager.logger.debug(`[${identifier}] Fetching Server ID`);
        try {
            const response = await fetch(constants_1.GPortalRoutes.Api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    operationName: "sid",
                    variables: {
                        gameserverId: Number(sid),
                        region,
                    },
                    query: "query sid($gameserverId: Int!, $region: REGION!) {\n  sid(gameserverId: $gameserverId, region: $region)\n}",
                }),
            });
            if (!response.ok) {
                ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Fetch Server ID: ${response.status} ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            if (data?.errors?.length) {
                this._manager.logger.warn(`[${identifier}] Failed To Fetch Server ID: ${data.errors[0].message}`);
                return null;
            }
            const serverId = data?.data?.sid;
            if (!serverId) {
                ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Fetch Server ID: Invalid SID`);
                return null;
            }
            return serverId;
        }
        catch (error) {
            ServerUtils_1.default.error(this._manager, `[${identifier}] Failed To Fetch Server ID: ${error.message}`);
            return null;
        }
    }
}
exports.default = ServerManager;
//# sourceMappingURL=Servers.js.map