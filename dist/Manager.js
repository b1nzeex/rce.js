"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = __importDefault(require("./auth/Auth"));
const Socket_1 = __importDefault(require("./socket/Socket"));
const Servers_1 = __importDefault(require("./servers/Servers"));
const Logger_1 = __importDefault(require("./logger/Logger"));
const events_1 = require("events");
const CommandHandler_1 = __importDefault(require("./servers/CommandHandler"));
const constants_1 = require("./constants");
class RCEEventManager extends events_1.EventEmitter {
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
}
class RCEManager {
    _auth;
    _socket;
    _plugins = new Map();
    logger;
    events = new RCEEventManager();
    servers;
    constructor() {
        this.events.on(constants_1.RCEEvent.Error, (payload) => {
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
     * @param auth {AuthOptions} - The authentication options for the GPortal API
     * @returns {Promise<void>}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * await rce.init({
     *  username: "username",
     *  password: "password"
     * });
     * ```
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * await rce.init({
     *  username: "username",
     *  password: "password"
     * }, {
     *  level: LogLevel.Info,
     *  file: "rce.log"
     * });
     */
    async init(auth, logger) {
        this.logger =
            logger?.instance || new Logger_1.default(logger?.level, logger?.file);
        this._auth = new Auth_1.default(this);
        await this._auth.login(auth.username, auth.password);
        this._socket = new Socket_1.default(this, this._auth);
        this._socket.connect();
        this.servers = new Servers_1.default(this, this._auth, this._socket);
    }
    /**
     * Gracefully close the RCE Manager
     * @returns {void}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * rce.destroy();
     * ```
     */
    destroy() {
        this._socket.close();
        this.servers.removeAll();
        this._auth.destroy();
        CommandHandler_1.default.destroy();
        this.logger.info("RCE.JS - Closed Gracefully");
    }
    /**
     * Register a plugin with the RCE Manager
     * @param name {string} - The name of the plugin
     * @param instance {any} - The instance of the plugin
     * @returns {void}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * rce.registerPlugin("myPlugin", new MyPlugin());
     * ```
     */
    registerPlugin(name, instance) {
        if (this._plugins.has(name)) {
            return this.logger.warn(`Plugin Is Already Registered: ${name}`);
        }
        this._plugins.set(name, instance);
        if (typeof instance.init === "function") {
            instance.init(this);
        }
        this.logger.info(`Plugin Registered: ${name}`);
    }
    /**
     * Get a registered plugin
     * @param name {string} - The name of the plugin
     * @returns {any}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * const myPlugin = rce.getPlugin("myPlugin");
     * ```
     */
    getPlugin(name) {
        return this._plugins.get(name);
    }
}
exports.default = RCEManager;
//# sourceMappingURL=Manager.js.map