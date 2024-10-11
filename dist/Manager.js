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
    logger;
    events = new RCEEventManager();
    servers;
    constructor() { }
    /**
     *
     * @param auth {AuthOptions} - The authentication options for the GPortal API
     * @returns {Promise<void>}
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
     */
    destroy() {
        this._socket.close();
        this.servers.removeAll();
        this._auth.destroy();
        CommandHandler_1.default.destroy();
        this.logger.info("RCE.JS - Closed Gracefully");
    }
}
exports.default = RCEManager;
//# sourceMappingURL=Manager.js.map