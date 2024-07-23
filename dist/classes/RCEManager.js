"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ws_1 = require("ws");
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const Logger_1 = __importDefault(require("./Logger"));
const types_1 = require("../types");
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
class RCEManager extends types_1.RCEEvents {
    logger;
    email;
    password;
    auth;
    servers = new Map();
    socket;
    requests = new Map();
    queue = [];
    constructor(auth) {
        super();
        this.logger = new Logger_1.default(auth.logLevel);
        this.email = auth.email;
        this.password = auth.password;
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
        await this.authenticate(timeout);
    }
    async authenticate(timeout) {
        this.logger.debug("Attempting to authenticate");
        const browser = await puppeteer_extra_1.default.launch({
            defaultViewport: null,
        });
        const page = (await browser.pages())[0];
        await page.goto(constants_1.GPORTALRoutes.HOME);
        await page
            .locator("#navigation__sidebar-wrapper > div.sidebar__quickmenu.row.g-0.mx-0.py-4 > div:nth-child(1) > button")
            .click();
        await page.locator("#kc-login").waitHandle();
        await page.locator("#username").fill(this.email);
        await page.locator("#password").fill(this.password);
        await page.locator("#kc-login").click();
        const selector = await page
            .locator("#navigation__sidebar-wrapper > div.row.g-0.sidebar__quickmenu.mx-0.py-4 > div.quickmenu__profile.col.col-3.text-center > p")
            .waitHandle()
            .catch((err) => err);
        if (!selector || selector instanceof Error) {
            this.logger.error("Failed to authenticate: Invalid credentials");
            return;
        }
        const session = await page.evaluate(() => localStorage.getItem("gp-session"));
        this.auth = JSON.parse(session);
        await browser.close();
        this.logger.info("Authenticated successfully");
        await this.refreshToken();
        await this.connectWebsocket(timeout);
    }
    async refreshToken() {
        this.logger.debug("Attempting to refresh token");
        if (!this.auth?.refresh_token) {
            return this.logger.error("Failed to refresh token: No refresh token");
        }
        try {
            const response = await fetch(constants_1.GPORTALRoutes.REFRESH, {
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
                throw new Error(`Failed to refresh token: ${response.statusText}`);
            }
            this.auth = await response.json();
            setTimeout(() => this.refreshToken(), this.auth.expires_in * 1000);
            this.logger.debug("Token refreshed successfully");
        }
        catch (err) {
            this.logger.error(`Failed to refresh token: ${err}`);
        }
    }
    async connectWebsocket(timeout) {
        this.logger.debug("Connecting to websocket");
        this.socket = new ws_1.WebSocket(constants_1.GPORTALRoutes.WEBSOCKET, ["graphql-ws"], {
            headers: {
                origin: constants_1.GPORTALRoutes.ORIGIN,
                host: "www.g-portal.com",
            },
            timeout,
        });
        this.socket.on("open", () => {
            this.logger.debug("Websocket connection established");
            this.authenticateWebsocket();
            this.processQueue();
        });
        this.socket.on("error", (err) => {
            this.logger.error(`Websocket error: ${err.message}`);
            this.socket?.close();
            this.socket = undefined;
            this.connectWebsocket(timeout);
        });
        this.socket.on("close", (code, reason) => {
            this.logger.error(`Websocket closed: ${code} ${reason}`);
            this.socket = undefined;
            this.connectWebsocket(timeout);
        });
        this.socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === "ka")
                    return;
                this.logger.debug(`Received message: ${JSON.stringify(message)}`);
                if (message.type === "error") {
                    return this.logger.error(`Websocket error: ${message?.payload?.message}`);
                }
                if (message.type === "connection_ack") {
                    return this.logger.debug("Websocket authenticated successfully");
                }
                if (message.type === "data") {
                    const request = this.requests.get(message.id);
                    if (!request) {
                        return this.logger.error(`Failed to handle message: No request found for ID ${message.id}`);
                    }
                    const server = this.servers.get(request.identifier);
                    if (!server) {
                        return this.logger.error(`Failed to handle message: No server found for ID ${request.identifier}`);
                    }
                    this.handleWebsocketMessage(message, server);
                }
            }
            catch (err) {
                this.logger.error(`Failed to handle message: ${err}`);
            }
        });
    }
    async authenticateWebsocket() {
        this.logger.debug("Attempting to authenticate websocket");
        if (!this.auth?.access_token) {
            return this.logger.error("Failed to authenticate websocket: No access token");
        }
        this.socket.send(JSON.stringify({
            type: constants_1.GPORTALWebsocketTypes.INIT,
            payload: {
                authorization: this.auth.access_token,
            },
        }));
        setInterval(() => {
            if (this.socket && this.socket.OPEN) {
                this.logger.debug("Sending keep-alive message");
                this.socket.send(JSON.stringify({ type: "ka" }));
            }
        }, 30_000);
    }
    handleWebsocketMessage(message, server) {
        const logMessages = message?.payload?.data?.consoleMessages?.message?.split(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}:LOG:DEFAULT: /gm);
        if (logMessages.length > 2)
            return;
        logMessages.forEach((logMessage) => {
            const log = logMessage.trim();
            if (!log || log.startsWith("Executing console system command")) {
                return;
            }
            // Population
            if (log.startsWith("<slot:")) {
                const players = log
                    .match(/"(.*?)"/g)
                    .map((ign) => ign.replace(/"/g, ""));
                players.shift();
                this.emit(constants_1.RCEEvent.PLAYERLIST_UPDATE, { server, players });
                return this.servers.set(server.identifier, {
                    ...server,
                    players,
                });
            }
            this.emit(constants_1.RCEEvent.MESSAGE, { server, message: log });
            this.logger.debug(`Received message: ${log} from ${server.identifier}`);
            // PLAYER_KILL event
            if (log.includes(" was killed by ")) {
                const [victim, killer] = log
                    .split(" was killed by ")
                    .map((str) => str.trim());
                this.emit(constants_1.RCEEvent.PLAYER_KILL, { server, victim, killer });
            }
            // QUICK_CHAT event
            if (log.includes("[CHAT LOCAL]") || log.includes("[CHAT SERVER]")) {
                const type = log.includes("[CHAT LOCAL]") ? "local" : "server";
                const msg = log.split(" : ")[1];
                const ign = log.includes("[CHAT LOCAL]")
                    ? log.split("[CHAT LOCAL]")[1].split(" : ")[0]
                    : log.split("[CHAT SERVER]")[1].split(" : ")[0];
                this.emit(constants_1.RCEEvent.QUICK_CHAT, { server, type, ign, message: msg });
            }
            // PLAYER_JOINED event
            if (log.includes("joined [xboxone]") || log.includes("joined [ps4]")) {
                const ign = log.split(" joined ")[0];
                const platform = log.includes("[xboxone]") ? "XBL" : "PS";
                this.emit(constants_1.RCEEvent.PLAYER_JOINED, { server, ign, platform });
            }
            // PLAYER_ROLE_ADD event
            const roleMatch = log.match(/\[(.*?)\]/g);
            if (roleMatch && log.includes("Added")) {
                const ign = roleMatch[1];
                const role = roleMatch[2];
                this.emit(constants_1.RCEEvent.PLAYER_ROLE_ADD, { server, ign, role });
            }
            // NOTE_EDIT event
            const noteMatch = log.match(/\[NOTE PANEL\] Player \[ ([^\]]+) \] changed name from \[\s*([\s\S]*?)\s*\] to \[\s*([\s\S]*?)\s*\]/);
            if (noteMatch) {
                const ign = noteMatch[1].trim();
                const oldContent = noteMatch[2].trim();
                const newContent = noteMatch[3].trim();
                this.emit(constants_1.RCEEvent.NOTE_EDIT, { server, ign, oldContent, newContent });
            }
            // EVENT_START event
            if (log.includes("[event]")) {
                let event;
                if (log.includes("event_airdrop")) {
                    event = "Airdrop";
                }
                if (log.includes("event_cargoship")) {
                    event = "Cargo Ship";
                }
                if (log.includes("event_cargoheli")) {
                    event = "Chinook";
                }
                if (log.includes("event_helicopter")) {
                    event = "Patrol Helicopter";
                }
                this.emit(constants_1.RCEEvent.EVENT_START, { server, event });
            }
        });
    }
    async resolveServerId(region, serverId) {
        if (!this.auth?.access_token) {
            this.logger.error("Failed to resolve server ID: No access token");
            return undefined;
        }
        try {
            const response = await fetch(constants_1.GPORTALRoutes.COMMAND, {
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
                throw new Error(`Failed to resolve server ID: ${response.statusText}`);
            }
            const data = await response.json();
            return data?.data?.sid;
        }
        catch (err) {
            this.logger.error(`Failed to resolve server ID: ${err}`);
            return undefined;
        }
    }
    /*
      * Send a command to a Rust server
  
      * @param {string} identifier - The server identifier
      * @param {string} command - The command to send
      * @returns {Promise<boolean>}
      * @memberof RCEManager
      * @example
      * await rce.sendCommand("server1", "RemoveOwner username");
      * @example
      * await rce.sendCommand("server1", "BanID username");
    */
    async sendCommand(identifier, command) {
        if (!this.auth?.access_token) {
            this.logger.error("Failed to send command: No access token");
            return false;
        }
        if (!this.socket || !this.socket.OPEN) {
            this.logger.error("Failed to send command: No websocket connection");
            return false;
        }
        const server = this.servers.get(identifier);
        if (!server) {
            this.logger.error(`Failed to send command: No server found for ID ${identifier}`);
            return false;
        }
        this.logger.debug(`Sending command "${command}" to ${server.identifier}`);
        const payload = {
            operationName: "sendConsoleMessage",
            variables: {
                sid: server.serverId,
                region: server.region,
                message: command,
            },
            query: "mutation sendConsoleMessage($sid: Int!, $region: REGION!, $message: String!) {\n  sendConsoleMessage(rsid: {id: $sid, region: $region}, message: $message) {\n    ok\n    __typename\n  }\n}",
        };
        try {
            const response = await fetch(constants_1.GPORTALRoutes.COMMAND, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Failed to send command: ${response.statusText}`);
            }
            this.logger.debug(`Command "${command}" sent successfully`);
            return true;
        }
        catch (err) {
            this.logger.error(`Failed to send command: ${err}`);
            return false;
        }
    }
    /*
      * Add a Rust server to the manager
  
      * @param {ServerOptions} opts - The server options
      * @returns {Promise<void>}
      * @memberof RCEManager
      * @example
      * await rce.addServer({ identifier: "server1", region: "US", serverId: 12345 });
      * @example
      * await rce.addServer({ identifier: "server2", region: "EU", serverId: 54321, refreshPlayers: 5 });
    */
    async addServer(opts) {
        if (!this.socket || !this.socket.OPEN) {
            this.queue.push(() => this.addServer(opts));
            return this.logger.warn("Failed to add server due to no websocket connection; added to queue");
        }
        this.logger.debug(`Adding server "${opts.identifier}"`);
        if (this.servers.has(opts.identifier)) {
            return this.logger.error(`Server "${opts.identifier}" already exists`);
        }
        const sid = await this.resolveServerId(opts.region, opts.serverId);
        this.servers.set(opts.identifier, {
            identifier: opts.identifier,
            serverId: sid,
            region: opts.region,
            refreshPlayers: opts.refreshPlayers || 0,
            players: [],
        });
        const payload = {
            type: constants_1.GPORTALWebsocketTypes.START,
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
        };
        this.requests.set(opts.identifier, {
            sid,
            region: opts.region,
            identifier: opts.identifier,
        });
        this.socket.send(JSON.stringify(payload));
        if (opts.refreshPlayers) {
            this.sendCommand(opts.identifier, "Users");
            setInterval(() => {
                if (this.servers.has(opts.identifier)) {
                    this.sendCommand(opts.identifier, "Users");
                }
            }, opts.refreshPlayers * 60_000);
        }
        this.logger.info(`Server "${opts.identifier}" added successfully`);
    }
    /*
      * Remove a Rust server from the manager
  
      * @param {string} identifier - The server identifier
      * @returns {void}
      * @memberof RCEManager
      * @example
      * rce.removeServer("server1");
      * @example
    */
    removeServer(identifier) {
        if (!this.socket) {
            return this.logger.error("Failed to remove server: No websocket connection");
        }
        this.logger.debug(`Removing server "${identifier}"`);
        if (!this.servers.has(identifier)) {
            return this.logger.error(`Server "${identifier}" does not exist`);
        }
        this.servers.delete(identifier);
        this.requests.delete(identifier);
        this.logger.info(`Server "${identifier}" removed successfully`);
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
    processQueue() {
        while (this.queue.length) {
            const callback = this.queue.shift();
            if (callback)
                callback();
        }
    }
}
exports.default = RCEManager;
//# sourceMappingURL=RCEManager.js.map