import { type IServerOptions, type IServer, type IEvent, type IRustServerInformation, type IOptions } from "./types";
import { EventEmitter } from "events";
import Logger from "./logger";
export default class RCEManager extends EventEmitter {
    private servers;
    logger: Logger;
    /**
     *
     * @param opts Options for the RCEManager instance.
     * @param opts.logLevel The log level for the logger. Default is LogLevel.Info
     * Creates an instance of RCEManager.
     */
    constructor(opts?: IOptions);
    /**
     *
     * @param options Options for the server to be added.
     * @param options.identifier Unique identifier for the server.
     * @param options.state Any additional information for the server.
     * @param options.rcon RCON connection options for the server.
     * @param options.rcon.port RCON port for the server.
     * @param options.rcon.password RCON password for the server.
     * @param options.rcon.host RCON host for the server.
     * Creates a new server instance and adds it to the manager.
     * @returns void
     */
    addServer(options: IServerOptions): void;
    /**
     *
     * @param server The server object to update.
     * @param server.identifier Unique identifier for the server.
     * @returns void
     * Updates an existing server instance in the manager.
     */
    updateServer(server: IServer): void;
    /**
     *
     * @param identifier Unique identifier for the server to be removed.
     * Removes a server instance from the manager.
     * @returns void
     */
    removeServer(identifier: string): void;
    /**
     *
     * @param identifier Unique identifier for the server to be fetched.
     * Retrieves a server instance by its identifier.
     * @returns IServer | null
     */
    getServer(identifier: string): IServer | null;
    /**
     *
     * @param identifier Unique identifier for the server to fetch information from.
     * Fetches server information using the RCON command "serverinfo".
     * @returns IRustServerInformation | string | undefined
     */
    fetchInfo(identifier: string): Promise<string | IRustServerInformation>;
    /**
     *
     * @param identifier Unique identifier for the server to send the command to.
     * @param command The command to be sent to the server.
     * Sends a command to the server using the RCON connection.
     * @returns Promise<string | undefined>
     */
    sendCommand(identifier: string, command: string): Promise<string | undefined>;
    /**
     * Destroys the RCEManager instance, cleaning up all resources.
     * Closes all server sockets, clears intervals, and removes all listeners.
     */
    destroy(): void;
    emit<K extends keyof IEvent>(event: K, ...args: IEvent[K] extends undefined ? [] : [IEvent[K]]): boolean;
    on<K extends keyof IEvent>(event: K, listener: (payload: IEvent[K]) => void): this;
    once<K extends keyof IEvent>(event: K, listener: (payload: IEvent[K]) => void): this;
    off<K extends keyof IEvent>(event: K, listener: (payload: IEvent[K]) => void): this;
    private updateBroadcasters;
    private fetchGibs;
    private updatePlayers;
}
