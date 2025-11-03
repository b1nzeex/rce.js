import { IServerOptions } from "../types";
import { WebSocket } from "ws";
import type RCEManager from "../manager";
export default class SocketManager {
    private _manager;
    private _socket;
    private connectionAttempts;
    private _reconnectionTimer;
    private _isDestroyed;
    private _hasEverConnected;
    constructor(manager: RCEManager);
    connect(opts: IServerOptions): Promise<boolean>;
    private attemptReconnection;
    destroy(): void;
    getSocket(): WebSocket | null;
}
