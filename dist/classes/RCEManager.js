"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ws_1 = require("ws");
const Logger_1 = __importDefault(require("./Logger"));
const types_1 = require("../types");
const Helper_1 = __importDefault(require("./Helper"));
const cheerio_1 = require("cheerio");
class RCEManager extends types_1.RCEEvents {
    email;
    password;
    logger;
    auth = {
        refresh_token: "",
        access_token: "",
        token_type: "Bearer",
        expires_in: 0,
    };
    tokenRefreshing = false;
    servers = new Map();
    socket;
    requests = new Map();
    commands = [];
    queue = [];
    kaInterval;
    connectionAttempt = 0;
    /*
      * Create a new RCEManager instance
  
      * @param {AuthOptions} auth - The authentication options
      * @memberof RCEManager
      * @example
      * const rce = new RCEManager({ email: "", password: "", servers: [{ identifier: "server1", region: "US", serverId: 12345 }] }, { logLevel: LogLevel.Info });
    */
    constructor(auth, logger = {}) {
        super();
        this.logger = new Logger_1.default(this, logger);
        this.email = auth.email;
        this.password = auth.password;
        const servers = auth.servers || [];
        servers.forEach((server) => {
            this.servers.set(server.identifier, {
                identifier: server.identifier,
                serverId: server.serverId,
                region: server.region,
                refreshPlayers: server.refreshPlayers || 0,
                rfBroadcasting: server.rfBroadcasting || 0,
                state: server.state || [],
                players: [],
                added: false,
                ready: false,
                serviceState: "UNKNOWN",
            });
        });
    }
    /*
      * Login to GPORTAL and establish a websocket connection
  
      * @param {number} [timeout=60_000] - The timeout for the websocket connection
      * @returns {Promise<void>}
      * @memberof RCEManager
      * @example
      * await rce.init();
      * @example
      * await rce.init(30_000);
    */
    async init(timeout = 60_000) {
        this.on(constants_1.RCEEvent.Error, (payload) => {
            this.logger.error(payload.error);
        });
        const login = await this.login();
        if (!login) {
            throw new Error("Failed To Login");
        }
        await this.authenticate(timeout);
    }
    /*
      * Close the RCEManager and clear all intervals
  
      * @returns {Promise<void>}
      * @memberof RCEManager
      * @example
      * await rce.close();
    */
    async close() {
        this.clean();
        this.logger.info("RCEManager Closed Successfully!");
    }
    async authenticate(timeout) {
        this.logger.debug("Attempting To Authenticate...");
        const s = await this.refreshToken();
        if (s) {
            this.logger.info("Successfully Authenticated!");
            await this.connectWebsocket(timeout);
        }
        else {
            this.logError("Failed to authenticate");
            setTimeout(() => this.authenticate(timeout), 60_000);
        }
    }
    async login() {
        const loginRes = await fetch(constants_1.GPORTALRoutes.Login);
        const loginRaw = await loginRes.text();
        const cookies = loginRes.headers.get("set-cookie");
        const $ = (0, cheerio_1.load)(loginRaw);
        const loginUrl = $("#kc-form-login").attr("action");
        if (!loginUrl) {
            this.logError("Failed To Login: No Login URL Found!");
            return false;
        }
        const postRes = await fetch(loginUrl, {
            method: "POST",
            headers: {
                Cookie: cookies,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: this.email,
                password: this.password,
                credentialId: "",
            }),
        });
        if (!postRes.ok) {
            this.logger.debug(`Failed To Login: ${postRes.status}`);
            this.logError(`Failed To Login: ${postRes.statusText}`);
            return false;
        }
        const code = new URLSearchParams(new URL(postRes.url).search).get("code");
        if (!code) {
            this.logError("Failed To Login: No Code Found!");
            return false;
        }
        const tokenRes = await fetch(constants_1.GPORTALRoutes.Token, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: "website",
                code,
                redirect_uri: "https://www.g-portal.com/en",
            }),
        });
        if (!tokenRes.ok) {
            this.logger.debug(`Failed To Login: ${tokenRes.status}`);
            this.logError(`Failed To Login: ${tokenRes.statusText}`);
            return false;
        }
        this.auth = await tokenRes.json();
        setTimeout(() => this.refreshToken(), this.auth.expires_in * 1000);
        return true;
    }
    async refreshToken() {
        this.tokenRefreshing = true;
        this.logger.debug("Attempting To Refresh Token...");
        if (!this.auth?.refresh_token) {
            this.logError("Failed To Refresh Token: No Refresh Token!");
            return false;
        }
        try {
            const response = await fetch(constants_1.GPORTALRoutes.Token, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    client_id: "website",
                    refresh_token: this.auth.refresh_token,
                }),
            });
            if (!response.ok) {
                this.logger.debug(this.auth);
                this.logger.debug(response.body);
                this.logError(`Failed To Refresh Token: ${response.statusText}`);
                return false;
            }
            this.auth = await response.json();
            setTimeout(() => this.refreshToken(), this.auth.expires_in * 1000);
            this.logger.debug("Token Successfully Refreshed!");
            this.tokenRefreshing = false;
            return true;
        }
        catch (err) {
            this.logError(`Failed To Refresh Token: ${err}`);
            return false;
        }
    }
    logError(message, server) {
        this.emit(constants_1.RCEEvent.Error, { server, error: message });
    }
    clean() {
        this.logger.debug("Cleaning Up All Data...");
        this.servers.forEach((server) => {
            clearInterval(server.refreshPlayersInterval);
            clearInterval(server.rfBroadcastingInterval);
            server.players = [];
            server.added = false;
            server.ready = false;
            server.trueServerId = undefined;
        });
        this.requests.clear();
        this.commands = [];
        this.queue = [];
        if (this.socket?.OPEN)
            this.socket.close(1000);
        this.socket = undefined;
        clearInterval(this.kaInterval);
        this.logger.debug("Cleaned Up All Data Successfully!");
    }
    async connectWebsocket(timeout) {
        this.logger.debug("Connecting To Websocket...");
        this.connectionAttempt++;
        this.socket = new ws_1.WebSocket(constants_1.GPORTALRoutes.WebSocket, ["graphql-ws"], {
            headers: {
                origin: constants_1.GPORTALRoutes.Origin,
                host: "www.g-portal.com",
            },
            timeout,
        });
        this.socket.on("open", async () => {
            this.logger.debug("Websocket Connection Established!");
            await this.authenticateWebsocket(timeout);
            this.servers.forEach(async (server) => {
                if (!server.added)
                    await this.addServer(server);
            });
        });
        this.socket.on("error", (err) => {
            this.logError(`Websocket Error: ${err.message}`);
            this.clean();
            if (this.connectionAttempt < 5) {
                this.logger.warn(`Websocket Error: Attempting To Reconnect In ${(this.connectionAttempt + 1) * 10} Second(s) (Attempt ${this.connectionAttempt + 1} Of 5)`);
                setTimeout(() => this.connectWebsocket(timeout), this.connectionAttempt * 10_000);
            }
            else {
                this.logError("Failed To Connect To Websocket: Too Many Attempts!");
            }
        });
        this.socket.on("close", (code, reason) => {
            this.clean();
            if (code !== 1000) {
                if (this.connectionAttempt < 5) {
                    this.logger.warn(`Websocket closed: Attempting To Reconnect In ${(this.connectionAttempt + 1) * 10} Second(s) (Attempt ${this.connectionAttempt + 1} Of 5)`);
                    setTimeout(() => this.connectWebsocket(timeout), this.connectionAttempt * 10_000);
                }
                else {
                    this.logError("Failed To Connect To Websocket: Too Many Attempts!");
                }
            }
            else {
                this.logError(`Websocket Closed: ${reason}`);
            }
        });
        this.socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === "ka")
                    return;
                this.logger.debug(`Received Message: ${JSON.stringify(message)}`);
                if (message.type === "error") {
                    return this.logError(`Websocket Error: ${message?.payload?.message}`);
                }
                if (message.type === "connection_ack") {
                    this.connectionAttempt = 0;
                    return this.logger.debug("Websocket Authenticated Successfully!");
                }
                if (message.type === "data") {
                    const request = this.requests.get(message.id);
                    if (!request) {
                        return this.logError(`Failed To Handle Message: No Request Found For ID ${message.id}!`);
                    }
                    const server = this.getServer(request.identifier);
                    if (!server) {
                        return this.logError(`Failed To Handle Message: No Server Found For ID ${request.identifier}!`);
                    }
                    if (message?.payload?.errors?.length) {
                        const error = message.payload.errors[0].message;
                        const aioRpcErrorMatch = error.match(/status\s*=\s*([^\n]+)\s+details\s*=\s*"([^"]+)"/);
                        if (aioRpcErrorMatch) {
                            const status = aioRpcErrorMatch[1].trim();
                            // const details = aioRpcErrorMatch[2].trim();
                            if (status === "StatusCode.UNAVAILABLE") {
                                this.logError("AioRpcError: Server Is UUnavailable", server);
                                this.clean();
                                this.logger.warn("AioRpcError: Will Attempt To Reconnect In 10 Seconds!");
                                setTimeout(() => {
                                    this.connectWebsocket(timeout);
                                }, 10_000);
                            }
                        }
                        return this.logError(message.payload.errors[0].message, server);
                    }
                    if (message?.payload?.data?.consoleMessages) {
                        this.handleWebsocketMessage(message, server);
                    }
                    else if (message?.payload?.data?.serviceState) {
                        this.handleServiceState(message, server);
                    }
                }
            }
            catch (err) {
                this.logError(`Failed To Handle Message: ${err}`);
            }
        });
    }
    async authenticateWebsocket(timeout) {
        this.logger.debug("Attempting To Authenticate Websocket");
        if (!this.auth?.access_token) {
            return this.logError("Failed To Authenticate Websocket: No Access Token!");
        }
        if (this.socket?.OPEN) {
            this.socket.send(JSON.stringify({
                type: constants_1.GPORTALWebsocketTypes.Init,
                payload: {
                    authorization: this.auth.access_token,
                },
            }));
            this.kaInterval = setInterval(() => {
                if (this.socket && this.socket.OPEN) {
                    this.logger.debug("Sending keep-alive Message");
                    this.socket.send(JSON.stringify({ type: "ka" }));
                }
            }, 30_000);
        }
        else {
            this.logError("Failed To Authenticate Websocket: No Websocket Connection!");
            this.clean();
            this.connectWebsocket(timeout);
        }
    }
    async fetchServiceState(sid, region) {
        if (!this.auth?.access_token) {
            this.logError("Failed To Fetch Service State: No Access Token!");
            return null;
        }
        if (this.tokenRefreshing) {
            this.logger.warn("Token Is Refreshing, Retrying In A Few Seconds!");
            await this.sleep(3_000);
            return this.fetchServiceState(sid, region);
        }
        try {
            const response = await fetch(constants_1.GPORTALRoutes.Command, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
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
                this.logError(`Failed To Fetch Service State: ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            return data.data.cfgContext.ns.service.currentState.state;
        }
        catch (err) {
            this.logError(`Failed To Fetch Service State: ${err}`);
        }
    }
    handleServiceState(message, server) {
        // Possible states: "STOPPING", "MAINTENANCE", "UPDATING", "STOPPED", "STARTING", "RUNNING", "SUSPENDED"
        const serviceState = message?.payload?.data?.serviceState?.state;
        if (server.serviceState === serviceState)
            return;
        this.servers.set(server.identifier, {
            ...server,
            serviceState,
        });
        if (serviceState === "RUNNING" && !server.ready) {
            this.markServerAsReady(server);
        }
        if (serviceState === "STOPPED" && server.ready) {
            this.markServerAsUnready(server);
        }
        this.emit(constants_1.RCEEvent.ServiceState, { server, state: serviceState });
        if (serviceState === "SUSPENDED") {
            this.logger.warn(`Server ${server.identifier} Is Suspended! Removing...`);
            this.removeServer(server.identifier);
        }
    }
    handleWebsocketMessage(message, server) {
        const logMessages = message?.payload?.data?.consoleMessages?.message
            ?.split("\n")
            .filter((e) => e !== "") || [];
        if (logMessages?.length > 3)
            return;
        logMessages?.forEach((logMessage) => {
            const logMatch = logMessage.match(/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}):LOG:[^:]+: (.+)$/);
            if (!logMatch)
                return;
            const logMessageDate = logMatch[1];
            const logMessageContent = logMatch[2];
            const log = logMessageContent.trim();
            if (!log)
                return;
            // Check for a command being executed
            const executingMatch = log.match(/Executing console system command '([^']+)'/);
            if (executingMatch) {
                this.logger.debug(`Executing Message Found For: ${executingMatch[1]}`);
                const command = executingMatch[1];
                this.emit(constants_1.RCEEvent.ExecutingCommand, {
                    server,
                    command,
                });
                // Handle command responses (if using sendCommand function)
                const commandRequest = this.commands.find((req) => req.command === command &&
                    req.identifier === server.identifier &&
                    !req.timestamp);
                if (commandRequest) {
                    this.logger.debug(`Command "${command}" Found In The Queue!`);
                    commandRequest.timestamp = logMessageDate;
                    this.commands = this.commands.map((req) => req.command === command ? commandRequest : req);
                    this.logger.debug(`Command "${command}" Updated With Timestamp!`);
                    return;
                }
            }
            // Check for a command response
            const commandRequest = this.commands.find((req) => req.identifier === server.identifier &&
                req.timestamp === logMessageDate);
            if (commandRequest && !log.startsWith("[ SAVE ]")) {
                this.logger.debug(`Command Response Found For: ${commandRequest.command}`);
                commandRequest.resolve(log);
                clearTimeout(commandRequest.timeout);
                this.commands = this.commands.filter((req) => req.command !== commandRequest.command &&
                    req.identifier !== commandRequest.identifier &&
                    req.timestamp !== commandRequest.timestamp);
            }
            this.emit(constants_1.RCEEvent.Message, { server, message: log });
            this.logger.debug(`Received Message: ${log} From ${server.identifier}`);
            // PLAYER_KILL event
            if (log.includes(" was killed by ")) {
                const [victim, killer] = log
                    .split(" was killed by ")
                    .map((str) => str.trim());
                const victimData = Helper_1.default.getKillInformation(victim);
                const killerData = Helper_1.default.getKillInformation(killer);
                this.emit(constants_1.RCEEvent.PlayerKill, {
                    server,
                    victim: victimData,
                    killer: killerData,
                });
            }
            // VENDING_MACHINE_NAME event
            const vendingMachineMatch = log.match(/\[VENDING MACHINE\] Player \[ ([^\]]+) \] changed name from \[ ([^\]]+) \] to \[ ([^\]]+) \]/);
            if (vendingMachineMatch) {
                const ign = vendingMachineMatch[1];
                const oldName = vendingMachineMatch[2];
                const newName = vendingMachineMatch[3];
                this.emit(constants_1.RCEEvent.VendingMachineName, {
                    server,
                    ign,
                    oldName,
                    newName,
                });
            }
            // QUICK_CHAT event
            const quickChatMatch = log.match(/(\[CHAT (TEAM|SERVER|LOCAL)\]) ([\w\s\-_]+) : (.+)/);
            if (quickChatMatch) {
                const quickChatTypes = {
                    "[CHAT TEAM]": "team",
                    "[CHAT SERVER]": "server",
                    "[CHAT LOCAL]": "local",
                };
                const type = quickChatTypes[quickChatMatch[1]];
                const ign = quickChatMatch[3];
                let msg = quickChatMatch[4];
                this.emit(constants_1.RCEEvent.QuickChat, {
                    server,
                    type,
                    ign,
                    message: msg,
                });
            }
            if (log.includes("was suicide by Suicide")) {
                const ign = log.split(" was suicide by Suicide")[0];
                this.emit(constants_1.RCEEvent.PlayerSuicide, { server, ign });
            }
            // PLAYER_SUICIDE event
            if (log.includes("was suicide by Suicide")) {
                const ign = log.split(" was suicide by Suicide")[0];
                this.emit(constants_1.RCEEvent.PlayerSuicide, { server, ign });
            }
            // PLAYER_RESPAWNED event
            if (log.includes("has entered the game")) {
                const ign = log.split(" [")[0];
                const platform = log.includes("[xboxone]") ? "XBL" : "PS";
                this.emit(constants_1.RCEEvent.PlayerRespawned, { server, ign, platform });
            }
            // CUSTOM_ZONE_ADDED event
            const customZoneAddedMatch = log.match(/Successfully created zone \[([\w\d\s_-]+)\]/);
            if (customZoneAddedMatch && customZoneAddedMatch[1]) {
                const name = customZoneAddedMatch[1];
                this.emit(constants_1.RCEEvent.CustomZoneAdded, { server, name });
            }
            // CUSTOM_ZONE_REMOVED event
            const customZoneRemovedMatch = log.match(/Successfully removed zone \[([\w\d\s_-]+)\]/);
            if (customZoneRemovedMatch && customZoneRemovedMatch[1]) {
                const name = customZoneRemovedMatch[1];
                this.emit(constants_1.RCEEvent.CustomZoneAdded, { server, name });
            }
            // PLAYER_ROLE_ADD event
            const roleMatch = log.match(/\[?SERVER\]?\s*Added\s*\[([^\]]+)\](?::\[([^\]]+)\])?\s*(?:to\s*(?:Group\s*)?)?\[(\w+)\]/i);
            if (roleMatch && log.includes("Added")) {
                const ign = roleMatch[1];
                const role = roleMatch[3];
                this.emit(constants_1.RCEEvent.PlayerRoleAdd, { server, ign, role });
            }
            // ITEM_SPAWN event
            const itemSpawnMatch = log.match(/\bgiving ([\w\s_-]+) ([\d.]+) x ([\w\s-]+(?: [\w\s-]+)*)\b/);
            if (itemSpawnMatch) {
                const ign = itemSpawnMatch[1];
                const quantity = Number(itemSpawnMatch[2]);
                const item = itemSpawnMatch[3];
                this.emit(constants_1.RCEEvent.ItemSpawn, { server, ign, item, quantity });
            }
            // NOTE_EDIT event
            const noteMatch = log.match(/\[NOTE PANEL\] Player \[ ([^\]]+) \] changed name from \[\s*([\s\S]*?)\s*\] to \[\s*([\s\S]*?)\s*\]/);
            if (noteMatch) {
                const ign = noteMatch[1].trim();
                const oldContent = noteMatch[2].trim().split("\\n")[0];
                const newContent = noteMatch[3].trim().split("\\n")[0];
                if (newContent.length > 0 && oldContent !== newContent) {
                    this.emit(constants_1.RCEEvent.NoteEdit, {
                        server,
                        ign,
                        oldContent,
                        newContent,
                    });
                }
            }
            // TEAM_CREATE event
            const teamCreateMatch = log.match(/\[([^\]]+)\] created a new team, ID: (\d+)/);
            if (teamCreateMatch) {
                const owner = teamCreateMatch[1];
                const id = Number(teamCreateMatch[2]);
                this.emit(constants_1.RCEEvent.TeamCreate, { server, owner, id });
            }
            // TEAM_JOIN event
            const teamJoinMatch = log.match(/\[([^\]]+)\] has joined \[([^\]]+)]s team, ID: \[(\d+)\]/);
            if (teamJoinMatch) {
                const ign = teamJoinMatch[1];
                const owner = teamJoinMatch[2];
                const id = Number(teamJoinMatch[3]);
                this.emit(constants_1.RCEEvent.TeamJoin, { server, ign, owner, id });
            }
            // TEAM_LEAVE event
            const teamLeaveMatch = log.match(/\[([^\]]+)\] has left \[([^\]]+)]s team, ID: \[(\d+)\]/);
            if (teamLeaveMatch) {
                const ign = teamLeaveMatch[1];
                const owner = teamLeaveMatch[2];
                const id = Number(teamLeaveMatch[3]);
                this.emit(constants_1.RCEEvent.TeamLeave, { server, ign, owner, id });
            }
            // KIT_SPAWN event
            const kitSpawnMatch = log.match(/SERVER giving (.+?) kit (\w+)/);
            if (kitSpawnMatch) {
                const ign = kitSpawnMatch[1];
                const kit = kitSpawnMatch[2];
                this.emit(constants_1.RCEEvent.KitSpawn, { server, ign, kit });
            }
            // KIT_GIVE event
            const kitGiveMatch = log.match(/\[ServerVar\] ([\w\s_-]+) giving ([\w\s_-]+) kit ([\w\s_-]+)/);
            if (kitGiveMatch) {
                const admin = kitGiveMatch[1];
                const ign = kitGiveMatch[2];
                const kit = kitGiveMatch[3];
                this.emit(constants_1.RCEEvent.KitGive, { server, admin, ign, kit });
            }
            // SPECIAL_EVENT_START event
            const specialEventStartMatch = log.match(/Setting event as :(\w+)/);
            if (specialEventStartMatch) {
                const event = specialEventStartMatch[1];
                this.emit(constants_1.RCEEvent.SpecialEventStart, { server, event });
            }
            // SPECIAL_EVENT_END event
            if (log.startsWith("Event set as: none")) {
                this.emit(constants_1.RCEEvent.SpecialEventEnd, { server });
            }
            // EVENT_START event
            if (log.startsWith("[event]")) {
                for (const [key, options] of Object.entries(constants_1.EVENTS)) {
                    if (log.includes(key)) {
                        this.emit(constants_1.RCEEvent.EventStart, {
                            server,
                            event: options.name,
                            special: options.special,
                        });
                    }
                }
            }
        });
    }
    async resolveServerId(region, serverId, identifier) {
        if (!this.auth?.access_token) {
            this.logError("Failed To Resolve Server ID: No Access Token!");
            return undefined;
        }
        if (this.tokenRefreshing) {
            this.logger.warn("Token Is Refreshing, Retrying In A Few Seconds!");
            await this.sleep(3_000);
            return this.resolveServerId(region, serverId, identifier);
        }
        try {
            const response = await fetch(constants_1.GPORTALRoutes.Command, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
                },
                body: JSON.stringify({
                    operationName: "sid",
                    variables: {
                        gameserverId: serverId,
                        region,
                    },
                    query: "query sid($gameserverId: Int!, $region: REGION!) {\n  sid(gameserverId: $gameserverId, region: $region)\n}",
                }),
            });
            if (!response.ok) {
                this.logger.debug(`Resolve Server ID Status: ${response.status}`);
                this.logger.debug(response.body);
                this.logError(`[${identifier}] Failed To Resolve Server ID: ${response.statusText}`);
                return undefined;
            }
            const data = await response.json();
            if (data?.errors?.length) {
                this.logger.warn(`[${identifier}] Resolve Server ID Error: ${data.errors[0].message}`);
                return undefined;
            }
            const sid = data?.data?.sid;
            if (!sid) {
                this.logger.warn(`[${identifier}] Invalid Server ID!`);
                return undefined;
            }
            return sid;
        }
        catch (err) {
            this.logError(`[${identifier}] Failed To Resolve Server ID: ${err}`);
            return undefined;
        }
    }
    markServerAsUnready(server) {
        this.servers.set(server.identifier, {
            ...server,
            ready: false,
        });
        this.logger.info(`Server "${server.identifier}" Is Not Ready!`);
    }
    markServerAsReady(server) {
        this.servers.set(server.identifier, {
            ...server,
            ready: true,
        });
        this.logger.info(`[${server.identifier}] Server Is Ready!`);
        this.processQueue();
    }
    async processQueue() {
        this.servers.forEach((server) => {
            if (server.ready) {
                const queuedCommands = this.queue.filter((cmd) => cmd.identifier === server.identifier);
                this.queue = this.queue.filter((cmd) => cmd.identifier !== server.identifier);
                queuedCommands.forEach(({ identifier, command, response, resolve, reject }) => {
                    const s = this.getServer(identifier);
                    this.sendCommandInternal(s, command, response)
                        .then(resolve)
                        .catch(reject);
                });
            }
        });
    }
    async sendCommandInternal(server, command, response) {
        if (!this.auth?.access_token) {
            this.logError("Failed To Send Command: No Access Token!");
            return null;
        }
        if (!this.socket || !this.socket.OPEN) {
            this.logError("Failed To Send Command: No Websocket Connection!");
            return null;
        }
        if (this.tokenRefreshing) {
            this.logger.warn("Token Is Refreshing, Retrying In A Few Seconds!");
            await this.sleep(3_000);
            return this.sendCommandInternal(server, command, response);
        }
        this.logger.debug(`Sending command "${command}" to ${server.identifier}`);
        const payload = {
            operationName: "sendConsoleMessage",
            variables: {
                sid: server.trueServerId,
                region: server.region,
                message: command,
            },
            query: "mutation sendConsoleMessage($sid: Int!, $region: REGION!, $message: String!) {\n  sendConsoleMessage(rsid: {id: $sid, region: $region}, message: $message) {\n    ok\n    __typename\n  }\n}",
        };
        if (response) {
            return new Promise((resolve, reject) => {
                this.commands.push({
                    identifier: server.identifier,
                    command,
                    resolve,
                    reject,
                    timeout: undefined,
                });
                this.logger.debug(`Command "${command}" Added To Queue!`);
                try {
                    fetch(constants_1.GPORTALRoutes.Command, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
                        },
                        body: JSON.stringify(payload),
                    })
                        .then((res) => {
                        if (!res.ok) {
                            this.logger.debug(`Send Command Status: ${res.status}`);
                            this.logError(`Failed To Send Command: ${res.statusText}`, server);
                            return null;
                        }
                        this.logger.debug(`Command "${command}" Sent Successfully!`);
                        this.logger.debug(`Starting Timeout For Command "${command}"`);
                        const cmd = this.commands.find((req) => req.command === command &&
                            req.identifier === server.identifier);
                        if (cmd) {
                            cmd.timeout = setTimeout(() => {
                                this.commands = this.commands.filter((req) => req.command !== command &&
                                    req.identifier !== server.identifier);
                                resolve(undefined);
                            }, 3_000);
                        }
                    })
                        .catch((err) => {
                        this.commands = this.commands.filter((req) => req.command !== command &&
                            req.identifier !== server.identifier);
                        reject(err);
                    });
                }
                catch (err) {
                    this.commands = this.commands.filter((req) => req.command !== command && req.identifier !== server.identifier);
                    reject(err);
                }
            });
        }
        else {
            try {
                const response = await fetch(constants_1.GPORTALRoutes.Command, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    this.logger.debug(`Send Command Status: ${response.status}`);
                    this.logError(`Failed To Send Command: ${response.statusText}`, server);
                    return null;
                }
                this.logger.debug(`Command "${command}" Sent Successfully!`);
                return undefined;
            }
            catch (err) {
                this.logError(`Failed To Send Command: ${err}`, server);
                return null;
            }
        }
    }
    /*
      * Send a command to a Rust server
  
      * @param {string} identifier - The server identifier
      * @param {string} command - The command to send
      * @param {boolean} [response=false] - Whether to wait for a response
      * @returns {Promise<string | undefined | null>}
      * @memberof RCEManager
      * @example
      * await rce.sendCommand("server1", "RemoveOwner username");
      * @example
      * await rce.sendCommand("server1", "BanID username", true);
    */
    async sendCommand(identifier, command, response = false) {
        return new Promise((resolve, reject) => {
            const server = this.getServer(identifier);
            if (!server) {
                this.logError(`[${identifier}] Failed To Send Command: No Server Found For ID ${identifier}`);
                return null;
            }
            if (server.ready) {
                this.logger.debug(`[${identifier}] The Server Is Ready, Sending Command Immediately`);
                this.sendCommandInternal(server, command, response)
                    .then(resolve)
                    .catch(reject);
            }
            else {
                this.logger.debug(`[${identifier}] The Server Is Not Ready, Adding Command To Queue`);
                this.queue.push({ identifier, command, response, resolve, reject });
            }
        });
    }
    /*
      * Add a Rust server to the manager
  
      * @param {ServerOptions} opts - The server options
      * @returns {Promise<boolean>}
      * @memberof RCEManager
      * @example
      * await rce.addServer({ identifier: "server1", region: "US", serverId: 12345 });
      * @example
      * await rce.addServer({ identifier: "server2", region: "EU", serverId: 54321, refreshPlayers: 5 });
    */
    async addServer(opts) {
        this.logger.debug(`[${opts.identifier}] Adding Server!`);
        const sid = await this.resolveServerId(opts.region, opts.serverId, opts.identifier);
        if (!sid) {
            this.logError(`[${opts.identifier}] Failed To Add Server: No Server ID Found!`);
            return false;
        }
        const currentState = await this.fetchServiceState(sid, opts.region);
        this.logger.debug(`Current state for ${opts.identifier}: ${currentState}`);
        if (!currentState) {
            this.logError(`[${opts.identifier}] Failed To Add Server: No Current State Found!`);
            return false;
        }
        if (currentState === "SUSPENDED") {
            this.logger.warn(`[${opts.identifier}] Server Is Suspended! Skipping!`);
            return false;
        }
        if (this.socket?.OPEN) {
            this.servers.set(opts.identifier, {
                identifier: opts.identifier,
                serverId: opts.serverId,
                trueServerId: sid,
                region: opts.region,
                refreshPlayers: opts.refreshPlayers || 0,
                state: opts.state || [],
                refreshPlayersInterval: opts.refreshPlayers
                    ? setInterval(() => {
                        this.refreshPlayers(opts.identifier);
                    }, opts.refreshPlayers * 60_000)
                    : undefined,
                rfBroadcasting: opts.rfBroadcasting || 0,
                rfBroadcastingInterval: opts.rfBroadcasting
                    ? setInterval(() => {
                        this.refreshBroadcasters(opts.identifier);
                    }, opts.rfBroadcasting * 30_000)
                    : undefined,
                players: [],
                added: true,
                ready: false,
                serviceState: currentState,
            });
            this.requests.set(opts.identifier, {
                sid,
                region: opts.region,
                identifier: opts.identifier,
            });
            this.socket.send(JSON.stringify({
                type: constants_1.GPORTALWebsocketTypes.Start,
                payload: {
                    variables: { sid, region: opts.region },
                    extensions: {},
                    operationName: "consoleMessages",
                    query: `subscription consoleMessages($sid: Int!, $region: REGION!) {
            consoleMessages(rsid: {id: $sid, region: $region}) {
              stream
              message
              __typename
            }
          }`,
                },
                id: opts.identifier,
            }), (err) => {
                if (err) {
                    this.logError(`[${opts.identifier}] Failed To Add Server: ${err}`);
                    return false;
                }
                this.socket.send(JSON.stringify({
                    type: constants_1.GPORTALWebsocketTypes.Start,
                    payload: {
                        variables: { sid, region: opts.region },
                        extensions: {},
                        operationName: "serviceState",
                        query: "subscription serviceState($sid: Int!, $region: REGION!) {\n  serviceState(rsid: {id: $sid, region: $region}) {\n    ...ServiceStateFields\n    __typename\n  }\n}\n\nfragment ServiceStateFields on ServiceState {\n  state\n  fsmState\n  fsmIsTransitioning\n  fsmIsExclusiveLocked\n  fsmFileAccess\n  fsmLastStateChange\n  fsmStateLiveProgress {\n    ... on InstallProgress {\n      action\n      percentage\n      __typename\n    }\n    ... on BroadcastProgress {\n      nextMessageAt\n      stateExitAt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
                    },
                    id: opts.identifier,
                }), (err) => {
                    if (err) {
                        this.logError(`[${opts.identifier}] Failed To Add Server: ${err}`);
                        return false;
                    }
                });
                if (opts.refreshPlayers) {
                    this.refreshPlayers(opts.identifier);
                }
                if (opts.rfBroadcasting) {
                    this.refreshBroadcasters(opts.identifier);
                }
                if (currentState === "RUNNING") {
                    this.markServerAsReady(this.getServer(opts.identifier));
                }
            });
        }
        else {
            this.logger.warn(`[${opts.identifier}] Failed To Add Server: No Websocket Connection, Retrying In 5 Seconds!`);
            setTimeout(() => this.addServer(opts), 5_000);
        }
    }
    comparePopulation(oldList, newList) {
        const joined = newList.filter((ign) => !oldList.includes(ign));
        const left = oldList.filter((ign) => !newList.includes(ign));
        return { joined, left };
    }
    async refreshPlayers(identifier) {
        this.logger.debug(`Refreshing Players For ${identifier}`);
        const server = this.getServer(identifier);
        if (!server) {
            this.logError(`[${identifier}] Failed To Refresh Players: No Server Found For ID ${identifier}`);
            return;
        }
        const users = await this.sendCommand(identifier, "Users", true);
        if (!users) {
            this.logger.warn(`[${identifier}] Failed To Refresh Players!`);
            return;
        }
        const players = users.match(/"(.*?)"/g).map((ign) => ign.replace(/"/g, ""));
        players.shift();
        const s = this.getServer(identifier);
        const { joined, left } = this.comparePopulation(s.players, players);
        joined.forEach((ign) => {
            this.emit(constants_1.RCEEvent.PlayerJoined, { server, ign });
        });
        left.forEach((ign) => {
            this.emit(constants_1.RCEEvent.PlayerLeft, { server, ign });
        });
        this.servers.set(identifier, {
            ...s,
            players,
        });
        this.emit(constants_1.RCEEvent.PlayerListUpdate, { server, players, joined, left });
        this.logger.debug(`Players Refreshed For ${identifier}`);
    }
    async refreshBroadcasters(identifier) {
        this.logger.debug(`Refreshing Broadcasters For ${identifier}`);
        const server = this.getServer(identifier);
        if (!server) {
            this.logError(`[${identifier}] Failed To Refresh Broadcasters: No Server Found For ID ${identifier}`);
            return;
        }
        const broadcasters = await this.sendCommand(identifier, "rf.listboardcaster", true);
        if (!broadcasters) {
            this.logger.warn(`[${identifier}] Failed To Refresh Broadcasters!`);
            return;
        }
        const regex = /\[(\d+) MHz\] Position: \(([\d.-]+), ([\d.-]+), ([\d.-]+)\), Range: (\d+)/g;
        // Create a Map to store frequency data
        const frequencyMap = new Map();
        if (typeof broadcasters === "string") {
            const matches = [...broadcasters.matchAll(regex)];
            matches.forEach((match) => {
                const frequency = match[1];
                const coords = [
                    parseFloat(match[2]),
                    parseFloat(match[3]),
                    parseFloat(match[4]),
                ];
                const range = parseInt(match[5], 10);
                // Store the frequency details in the Map
                frequencyMap.set(frequency, { coords, range });
            });
            // Emit events for each frequency from the Map
            frequencyMap.forEach(({ coords, range }, frequency) => {
                this.emit(constants_1.RCEEvent.FrequencyReceived, { server, frequency, coords, range });
            });
        }
        this.logger.debug(`Broadcasters Refreshed For ${identifier}`);
    }
    /*
      * Get a Rust server from the manager
  
      * @param {string}
      * @returns {RustServer}
      * @memberof RCEManager
      * @example
      * const server = rce.getServer("server1");
    */
    getServer(identifier) {
        return this.servers.get(identifier);
    }
    /*
      * Remove a Rust server from the manager
  
      * @param {string}
      * @memberof RCEManager
      * @example
      * rce.removeServer("server1");
      * @example
      * rce.removeServer("my-solo-duo-trio-3x");
    */
    removeServer(identifier) {
        clearInterval(this.getServer(identifier)?.refreshPlayersInterval);
        clearInterval(this.getServer(identifier)?.rfBroadcastingInterval);
        this.servers.delete(identifier);
        const request = this.requests.get(identifier);
        if (request)
            this.requests.delete(request.identifier);
        this.logger.info(`Server "${identifier}" Was Successfully Removed!`);
    }
    /*
      * Get all Rust servers from the manager
  
      * @returns {Map<string, RustServer>}
      * @memberof RCEManager
      * @example
      * const servers = rce.getServers();
      * for (const [identifier, server] of servers) {
      *  console.log(identifier, server);
      * }
    */
    getServers() {
        return this.servers;
    }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.default = RCEManager;
//# sourceMappingURL=RCEManager.js.map