import type GPortalAuth from "../auth/Auth";
import type GPortalSocket from "../socket/Socket";
import type RCEManager from "../Manager";
import type { ServerOptions, RustServer, CommandResponse, RustServerInformation, FetchedServer } from "./interfaces";
export default class ServerManager {
    private _manager;
    private _auth;
    private _socket;
    private _servers;
    constructor(manager: RCEManager, auth: GPortalAuth, socket: GPortalSocket);
    /**
     *
     * @param opts {ServerOptions[]} - The server options
     * @returns {Promise<void>} - Resolves once all servers have been added
     * @description Adds multiple servers to the manager
     *
     * @example
     * ```js
     * await manager.servers.addMany([
     *  {
     *    identifier: "my-server-id",
     *    serverId: 1234567,
     *    region: "EU",
     *    playerRefreshing: true,
     *    radioRefreshing: true,
     *    extendedEventRefreshing: true,
     *    intents: [RCEIntent.All]
     *  },
     *  {
     *    identifier: "my-server-id-2",
     *    serverId: 7654321,
     *    region: "US",
     *    playerRefreshing: true,
     *    radioRefreshing: true,
     *    extendedEventRefreshing: true,
     *    intents: [RCEIntent.All]
     *  }
     * ]);
     * ```
     */
    addMany(opts: ServerOptions[]): Promise<void>;
    /**
     *
     * @param opts {ServerOptions} - The server options
     * @returns {Promise<boolean>} - Whether the server was added successfully
     * @description Adds a server to the manager
     *
     * @example
     * ```js
     * const server = await manager.servers.add({
     *  identifier: "my-server-id",
     *  serverId: 1234567,
     *  region: "EU",
     *  playerRefreshing: true,
     *  radioRefreshing: true,
     *  extendedEventRefreshing: true,
     *  intents: [RCEIntent.All]
     * });
     * ```
     */
    add(opts: ServerOptions): Promise<boolean>;
    /**
     *
     * @param server {RustServer} - The server to update
     * @returns {void}
     * @description Updates a server
     *
     * @example
     * ```js
     * manager.servers.update(server);
     * ```
     */
    update(server: RustServer): void;
    /**
     * @returns {void}
     * @description Removes all servers from the manager
     *
     * @example
     * ```js
     * manager.servers.removeAll();
     * ```
     */
    removeAll(): void;
    /**
     *
     * @param identifiers {string[]} - The server identifiers to remove
     * @returns {void}
     * @description Removes multiple servers from the manager
     *
     * @example
     * ```js
     * manager.servers.removeMany(["my-server-id", "my-server-id-2"]);
     * ```
     */
    removeMany(identifiers: string[]): void;
    /**
     *
     * @param server {RustServer} - The server to remove
     * @returns {void}
     * @description Removes a server from the manager
     *
     * @example
     * ```js
     * manager.servers.remove(server);
     * ```
     */
    remove(server: RustServer): void;
    /**
     *
     * @param identifier {string} - The server identifier
     * @returns {RustServer | undefined} - The server
     * @description Gets a server by its identifier
     *
     * @example
     * ```js
     * const server = manager.servers.get("my-server-id");
     * ```
     */
    get(identifier: string): RustServer;
    /**
     *
     * @returns {RustServer[]} - All servers
     * @description Gets all servers
     *
     * @example
     * ```js
     * const servers = manager.servers.getAll();
     * ```
     */
    getAll(): Map<string, RustServer>;
    /**
     *
     * @param identifier - The server identifier
     * @param rawHostname - Whether to return the raw hostname
     * @returns {Promise<RustServerInformation | null>} - The server information
     *
     * @example
     * ```js
     * const info = await manager.servers.info("my-server-id");
     * ```
     *
     * @example
     * ```js
     * const info = await manager.servers.info("my-server-id", true);
     * ```
     */
    info(identifier: string, rawHostname?: boolean): Promise<RustServerInformation>;
    /**
     *
     * @param identifier - The server identifier
     * @param command - The command to send
     * @param response - Whether to wait for a response
     * @returns {Promise<CommandResponse>} - The command response
     *
     * @example
     * ```js
     * await manager.servers.command("my-server-id", "say Hello World!");
     * ```
     *
     * @example
     * ```js
     * const response = await manager.servers.command("my-server-id", "getauthlevels", true);
     * ```
     */
    command(identifier: string, command: string, response?: boolean): Promise<CommandResponse>;
    private updateBroadcasters;
    private fetchGibs;
    private updatePlayers;
    /**
     *
     * @param region - The region to fetch servers from
     * @returns {Promise<FetchedServer[]>} - The fetched servers
     * @description Fetches servers from the authorized GPortal account
     *
     * @example
     * ```js
     * const servers = await manager.servers.fetchServers("EU");
     * ```
     *
     * @example
     * ```js
     * const servers = await manager.servers.fetchServers("US");
     * ```
     *
     * @example
     * ```js
     * const servers = await manager.servers.fetchServers();
     * ```
     */
    fetchServers(region?: "US" | "EU"): Promise<FetchedServer[]>;
    private fetchStatus;
    private fetchId;
}
