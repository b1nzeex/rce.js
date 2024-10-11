import type GPortalAuth from "../auth/Auth";
import type GPortalSocket from "../socket/Socket";
import type RCEManager from "../Manager";
import type { ServerOptions, RustServer, CommandResponse, RustServerInformation } from "./interfaces";
export default class ServerManager {
    private _manager;
    private _auth;
    private _socket;
    private _servers;
    constructor(manager: RCEManager, auth: GPortalAuth, socket: GPortalSocket);
    addMany(opts: ServerOptions[]): Promise<void>;
    add(opts: ServerOptions): Promise<void>;
    update(server: RustServer): void;
    removeAll(): void;
    remove(server: RustServer): void;
    get(identifier: string): RustServer;
    getAll(): Map<string, RustServer>;
    info(identifier: string): Promise<RustServerInformation>;
    command(identifier: string, command: string, response?: boolean): Promise<CommandResponse>;
    private updateBroadcasters;
    private fetchGibs;
    private updatePlayers;
    private fetchStatus;
    private fetchId;
}
