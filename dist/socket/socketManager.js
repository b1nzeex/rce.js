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
    _reconnectionTimer = null;
    _isDestroyed = false;
    _hasEverConnected = false;
    constructor(manager) {
        this._manager = manager;
    }
    connect(opts) {
        return new Promise((resolve) => {
            if (this._isDestroyed)
                return resolve(false);
            let settled = false;
            const settle = (value) => {
                if (settled)
                    return;
                settled = true;
                resolve(value);
            };
            const { rcon } = opts;
            const { host, port, password } = rcon;
            if (this._reconnectionTimer) {
                clearTimeout(this._reconnectionTimer);
                this._reconnectionTimer = null;
            }
            const url = `ws://${host}:${port}/${password}`;
            this._socket = new ws_1.WebSocket(url);
            // ✅ unified error handler
            this._socket.on("error", (error) => {
                const isConnectionRefused = error.code === "ECONNREFUSED" || error.code === "ENOTFOUND";
                this._manager.emit(types_1.RCEEvent.Error, {
                    error: `WebSocket error for server "${opts.identifier}": ${error.message}`,
                    server: this._manager.getServer(opts.identifier) || undefined,
                });
                // stop reconnection if first connection is refused
                if (isConnectionRefused && this.connectionAttempts === 0) {
                    this._manager.logger.warn(`[${opts.identifier}] Connection refused — stopping reconnection attempts.`);
                    this._isDestroyed = true;
                }
                settle(false);
            });
            const handleSuccess = () => {
                this.connectionAttempts = 0;
                this._hasEverConnected = true;
                const server = this._manager.getServer(opts.identifier);
                if (server) {
                    server.socket = this._socket;
                    if (!server.flags.includes("READY"))
                        server.flags.push("READY");
                    this._manager.updateServer(server);
                }
                const s = this._manager.getServer(opts.identifier);
                if (!s) {
                    this._manager.logger.warn(`[${opts.identifier}] No server found during Ready emit.`);
                    settle(false);
                    return;
                }
                this._manager.emit(types_1.RCEEvent.Ready, { server: s });
                this._manager.logger.debug(`[${opts.identifier}] WebSocket connection established.`);
                settle(true);
            };
            this._socket.once("open", handleSuccess);
            this._socket.on("close", (code, reason) => {
                this._manager.logger.debug(`[${opts.identifier}] WebSocket closed: ${code} - ${reason}`);
                if (this._socket) {
                    if (this._socket.readyState === ws_1.WebSocket.OPEN ||
                        this._socket.readyState === ws_1.WebSocket.CLOSING) {
                        this._socket.terminate();
                    }
                    setTimeout(() => {
                        if (this._socket) {
                            this._socket.removeAllListeners();
                            this._socket = null;
                        }
                    }, 25);
                }
                const server = this._manager.getServer(opts.identifier);
                if (server) {
                    server.flags = server.flags.filter((flag) => flag !== "READY");
                    this._manager.updateServer(server);
                }
                // ✅ only reconnect if we’ve previously connected
                if (code !== 1000 && !this._isDestroyed && this._hasEverConnected) {
                    this.attemptReconnection(opts);
                }
            });
            this._socket.on("message", (data) => {
                try {
                    const parsed = JSON.parse(data.toString());
                    if (!parsed.Message)
                        return;
                    const uniqueId = parsed.Identifier;
                    const message = parsed.Message.replace(/\u0000/g, "").trim();
                    const server = this._manager.getServer(opts.identifier);
                    this._manager.logger.debug(`[${opts.identifier}] Received message: ${JSON.stringify(message)}`);
                    // resolve any pending command
                    if (uniqueId > 0) {
                        const cmd = commandManager_1.default.get(opts.identifier, Number(uniqueId));
                        if (cmd) {
                            if (cmd.timeout)
                                clearTimeout(cmd.timeout);
                            cmd.resolve(message);
                        }
                    }
                    if (!server) {
                        this._manager.logger.warn(`[${opts.identifier}] Received message for unknown server.`);
                        return;
                    }
                    responseHandler_1.default.handle(this._manager, server, message);
                }
                catch (err) {
                    this._manager.logger.error(`[${opts.identifier}] Failed to parse WebSocket message: ${err.message}`);
                }
            });
        });
    }
    attemptReconnection(opts) {
        if (this._isDestroyed)
            return;
        const { reconnection } = opts;
        const isReconnectionEnabled = reconnection?.enabled !== false;
        const maxAttempts = reconnection?.maxAttempts ?? -1;
        const interval = Math.min((reconnection?.interval ?? 5000) * Math.pow(2, this.connectionAttempts), 60_000);
        if (!isReconnectionEnabled) {
            this._manager.logger.warn(`[${opts.identifier}] Reconnection is disabled.`);
            return;
        }
        if (maxAttempts !== -1 && this.connectionAttempts >= maxAttempts) {
            this._manager.emit(types_1.RCEEvent.Error, {
                error: `WebSocket connection failed for server "${opts.identifier}" after ${maxAttempts} attempts.`,
                server: this._manager.getServer(opts.identifier) || undefined,
            });
            return;
        }
        this.connectionAttempts++;
        this._manager.logger.warn(`[${opts.identifier}] Attempting to reconnect WebSocket... (Attempt ${this.connectionAttempts}${maxAttempts !== -1 ? `/${maxAttempts}` : ""})`);
        this._reconnectionTimer = setTimeout(() => {
            if (!this._isDestroyed)
                this.connect(opts);
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