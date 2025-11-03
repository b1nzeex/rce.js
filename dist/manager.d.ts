import { type IServerOptions, type IServer, type IEvent, type IRustServerInformation, type IOptions, type ILogger, type IPlayer, type ITeam } from "./types";
import { EventEmitter } from "events";
export default class RCEManager extends EventEmitter {
    private servers;
    logger: ILogger;
    /**
     *
     * @param opts Options for the RCEManager instance.
     * @param opts.logLevel The log level for the logger. Default is LogLevel.Info
     * Creates an instance of RCEManager.
     */
    constructor(opts: IOptions);
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
     * @returns Promise<boolean> Whether the server was added successfully.
     */
    addServer(options: IServerOptions): Promise<boolean>;
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
     * Retrieves all server instances managed by the RCEManager.
     * @returns IServer[]
     */
    getServers(): IServer[];
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
    private fetchCustomZones;
    private fetchKits;
    private updateBroadcasters;
    private fetchGibs;
    /**
     * Creates a placeholder player or returns existing one, optionally updating player data
     * @param identifier Server identifier
     * @param playerName Player's IGN
     * @param playerData Optional data to set on the player
     * @returns Player object (existing or newly created placeholder)
     */
    getOrCreatePlayer(identifier: string, playerName: string, playerData?: Partial<IPlayer>, markAsOnline?: boolean): IPlayer;
    fetchRoleInfo(identifier: string): Promise<void>;
    /**
     * Fetches team information and updates team references for all players
     * @param identifier Server identifier
     */
    fetchTeamInfo(identifier: string): Promise<void>;
    /**
     * Gets all teams on the server
     * @param identifier Server identifier
     * @returns Array of teams with their leaders and members
     */
    getTeams(identifier: string): ITeam[];
    /**
     * Gets a specific team by ID
     * @param identifier Server identifier
     * @param teamId Team ID to find
     * @returns Team object or undefined if not found
     */
    getTeam(identifier: string, teamId: number): ITeam | undefined;
    /**
     * Gets the team that a specific player belongs to
     * @param identifier Server identifier
     * @param playerName Player's IGN
     * @returns Team object or undefined if player is not in a team
     */
    getPlayerTeam(identifier: string, playerName: string): ITeam | undefined;
    private updatePlayers;
}
