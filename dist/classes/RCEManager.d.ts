import { AuthOptions, RustServer, ServerOptions } from "../types";
import { RCEEvents } from "../types";
export default class RCEManager extends RCEEvents {
    private logger;
    private email;
    private password;
    private auth?;
    private servers;
    private socket?;
    private requests;
    private queue;
    constructor(auth: AuthOptions);
    init(timeout?: number): Promise<void>;
    private authenticate;
    private refreshToken;
    private connectWebsocket;
    private authenticateWebsocket;
    private handleWebsocketMessage;
    private resolveServerId;
    sendCommand(identifier: string, command: string): Promise<boolean>;
    addServer(opts: ServerOptions): Promise<void>;
    removeServer(identifier: string): void;
    getServer(identifier: string): RustServer;
    private processQueue;
}
