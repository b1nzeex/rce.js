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
    _options;
    _reconnectionTimer = null;
    _isDestroyed = false;
    constructor(manager, options) {
        this._manager = manager;
        this._options = options;
        this.connect(options);
    }
    connect(opts) {
        if (this._isDestroyed) {
            return;
        }
        const { rcon, reconnection } = opts;
        const { host, port, password } = rcon;
        // Clear any existing reconnection timer
        if (this._reconnectionTimer) {
            clearTimeout(this._reconnectionTimer);
            this._reconnectionTimer = null;
        }
        const url = `ws://${host}:${port}/${password}`;
        this._socket = new ws_1.WebSocket(url);
        this._socket.on("open", () => {
            this.connectionAttempts = 0; // Reset connection attempts on successful connection
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
            if (this._socket) {
                this._socket.removeAllListeners();
                this._socket.terminate();
                this._socket = null;
            }
            const server = this._manager.getServer(opts.identifier);
            if (server) {
                server.flags = server.flags.filter((flag) => flag !== "READY");
                this._manager.updateServer(server);
            }
            // Only attempt reconnection if not a normal closure and reconnection is enabled
            if (code !== 1000 && !this._isDestroyed) {
                this.attemptReconnection(opts);
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
                const message = parsed.Message.replace(/\u0000/g, "").trim();
                this._manager.logger.debug(`[${opts.identifier}] Received message: ${JSON.stringify(message)}`);
                // Resolve the command if it exists
                if (uniqueId > 0) {
                    const cmd = commandManager_1.default.get(opts.identifier, Number(uniqueId));
                    if (cmd) {
                        if (cmd.timeout) {
                            clearTimeout(cmd.timeout);
                        }
                        cmd.resolve(message);
                    }
                }
                // Send the command to regular expression handler
                responseHandler_1.default.handle(this._manager, server, message);
            }
        });
    }
    attemptReconnection(opts) {
        if (this._isDestroyed) {
            return;
        }
        const { reconnection } = opts;
        const isReconnectionEnabled = reconnection?.enabled !== false; // Default to true
        const maxAttempts = reconnection?.maxAttempts ?? -1; // Default to infinite (-1)
        const interval = reconnection?.interval ?? 5000; // Default to 5 seconds
        // Check if reconnection is disabled
        if (!isReconnectionEnabled) {
            this._manager.logger.warn(`[${opts.identifier}] Reconnection is disabled. Not attempting to reconnect.`);
            return;
        }
        // Check if we've exceeded max attempts (if maxAttempts is not -1)
        if (maxAttempts !== -1 && this.connectionAttempts >= maxAttempts) {
            this._manager.emit(types_1.RCEEvent.Error, {
                error: `WebSocket connection failed for server "${opts.identifier}" after ${maxAttempts} attempts.`,
                server: this._manager.getServer(opts.identifier) || undefined,
            });
            return;
        }
        this.connectionAttempts++;
        this._manager.logger.warn(`[${opts.identifier}] Attempting to reconnect WebSocket... (Attempt ${this.connectionAttempts}${maxAttempts !== -1 ? `/${maxAttempts}` : ''})`);
        this._reconnectionTimer = setTimeout(() => {
            if (!this._isDestroyed) {
                this.connect(opts);
            }
        }, interval);
    }
    destroy() {
        this._isDestroyed = true;
        if (this._reconnectionTimer) {
            clearTimeout(this._reconnectionTimer);
            this._reconnectionTimer = null;
        }
        if (this._socket) {
            this._socket.removeAllListeners();
            this._socket.terminate();
            this._socket = null;
        }
    }
    getSocket() {
        return this._socket;
    }
}
exports.default = SocketManager;
//# sourceMappingURL=socketManager.js.map