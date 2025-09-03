import { IServerOptions } from "../types";
import { WebSocket } from "ws";
import type RCEManager from "../manager";
export default class SocketManager {
    private _manager;
    private _socket;
    private connectionAttempts;
    private _options;
    private _reconnectionTimer;
    private _isDestroyed;
    constructor(manager: RCEManager, options: IServerOptions);
    connect(opts: IServerOptions): void;
    private attemptReconnection;
    destroy(): void;
    getSocket(): WebSocket | null;
}
