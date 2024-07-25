import { AuthOptions, RustServer, ServerOptions } from "../types";
import { RCEEvents } from "../types";
export default class RCEManager extends RCEEvents {
    private logger;
    private auth?;
    private servers;
    private socket?;
    private requests;
    private queue;
    private authMethod;
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
    getServer(identifier: string): RustServer;
    removeServer(identifier: string): void;
    getServers(): Map<string, RustServer>;
    private processQueue;
}
