"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const types_1 = require("../types");
const commandManager_1 = __importDefault(require("../commands/commandManager"));
const responseHandler_1 = __importDefault(require("../commands/responseHandler"));
class SocketManager {
    _manager;
    _socket = null;
    connectionAttempts = 0;
    constructor(manager, options) {
        this._manager = manager;
        this.connect(options);
    }
    connect(opts) {
        const { rcon } = opts;
        const { host, port, password } = rcon;
        const url = `ws://${host}:${port}/${password}`;
        this._socket = new ws_1.WebSocket(url);
        this._socket.on("open", () => {
            const server = this._manager.getServer(opts.identifier);
            if (server) {
                server.socket = this._socket;
                server.flags.push("READY");
                this._manager.updateServer(server);
            }
            this._manager.emit(types_1.RCEEvent.Ready, {
                server: this._manager.getServer(opts.identifier),
            });
            this._manager.logger.debug(`[${opts.identifier}] WebSocket connection established.`);
        });
        this._socket.on("close", (code, reason) => {
            this._manager.logger.debug(`[${opts.identifier}] WebSocket closed: ${code} - ${reason}`);
            this._socket.removeAllListeners();
            this._socket.terminate();
            const server = this._manager.getServer(opts.identifier);
            if (server) {
                server.flags = server.flags.filter((flag) => flag !== "READY");
                this._manager.updateServer(server);
            }
            if (code !== 1000) {
                if (this.connectionAttempts < 5) {
                    this._manager.logger.warn(`[${opts.identifier}] Reconnecting WebSocket...`);
                    setTimeout(() => {
                        this.connectionAttempts++;
                        this.connect(opts);
                    }, (this.connectionAttempts + 1) * 10_000);
                }
                else {
                    this._manager.emit(types_1.RCEEvent.Error, {
                        error: `WebSocket connection failed for server "${opts.identifier}" after multiple attempts.`,
                        server: this._manager.getServer(opts.identifier) || undefined,
                    });
                    this._manager.removeServer(opts.identifier);
                }
            }
        });
        this._socket.on("error", (error) => {
            this._manager.emit(types_1.RCEEvent.Error, {
                error: `WebSocket error for server "${opts.identifier}": ${error.message}`,
                server: this._manager.getServer(opts.identifier) || undefined,
            });
        });
        this._socket.on("message", (data) => {
            const parsed = JSON.parse(data.toString());
            if (parsed.Message) {
                const uniqueId = parsed.Identifier;
                const server = this._manager.getServer(opts.identifier);
                this._manager.logger.debug(`[${opts.identifier}] Received message: ${JSON.stringify(parsed.Message)}`);
                // Resolve the command if it exists
                if (uniqueId > 0) {
                    const cmd = commandManager_1.default.get(opts.identifier, Number(uniqueId));
                    if (cmd) {
                        if (cmd.timeout) {
                            clearTimeout(cmd.timeout);
                        }
                        cmd.resolve(parsed.Message);
                    }
                }
                // Send the command to regular expression handler
                responseHandler_1.default.handle(this._manager, server, parsed.Message);
            }
        });
    }
    getSocket() {
        return this._socket;
    }
}
exports.default = SocketManager;
//# sourceMappingURL=socketManager.js.map