import { IServerOptions } from "../types";
import { WebSocket } from "ws";
import type RCEManager from "../manager";
export default class SocketManager {
    private _manager;
    private _socket;
    private connectionAttempts;
    constructor(manager: RCEManager, options: IServerOptions);
    connect(opts: IServerOptions): void;
    getSocket(): WebSocket | null;
}
