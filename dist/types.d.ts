import type { WebSocket } from "ws";
import { type PlayerKillType } from "./data/playerKill";
import { QuickChat, QuickChatChannel } from "./data/quickChat";
import SocketManager from "./socket/socketManager";
export interface IOptions {
    logger: {
        level?: LogLevel;
        instance?: ILogger;
        file?: string;
    };
}
interface IServerRCON {
    host: string;
    port: number;
    password: string;
}
export interface IServerOptions {
    identifier: string;
    rcon: IServerRCON;
    state: any[];
    reconnection?: {
        enabled?: boolean;
        interval?: number;
        maxAttempts?: number;
    };
}
interface IServerIntervals {
    playerRefreshing: NodeJS.Timeout;
    frequencyRefreshing: NodeJS.Timeout;
    gibRefreshing: NodeJS.Timeout;
}
export interface IServer {
    identifier: string;
    socket: WebSocket;
    socketManager?: SocketManager;
    flags: string[];
    intervals: IServerIntervals;
    state: any[];
    players: Player[];
    frequencies: number[];
    teams: Team[];
}
export interface IRustServerInformation {
    Hostname: string;
    MaxPlayers: number;
    Players: number;
    Queued: number;
    Joining: number;
    EntityCount: number;
    GameTime: string;
    Uptime: number;
    Map: "Procedural Map";
    Framerate: number;
    Memory: number;
    Collections: number;
    NetworkIn: number;
    NetworkOut: number;
    Restarting: boolean;
    SaveCreatedTime: string;
}
interface EventPayload {
    server: IServer;
}
export interface IReadyEventPayload extends EventPayload {
}
export interface IMessageEventPayload extends EventPayload {
    message: string;
}
export interface IExecutingCommandEventPayload extends EventPayload {
    command: string;
}
export interface IVendingMachineNameEventPayload extends EventPayload {
    player: Player;
    oldName: string;
    newName: string;
}
export interface IQuickChatEventPayload extends EventPayload {
    type: QuickChatChannel;
    player: Player;
    message: QuickChat;
}
export interface IPlayerSuicideEventPayload extends EventPayload {
    player: Player;
}
export interface IPlayerRespawnedEventPayload extends EventPayload {
    player: Player;
    platform: GamePlatform;
}
export interface ICustomZoneCreatedEventPayload extends EventPayload {
    zone: string;
}
export interface ICustomZoneRemovedEventPayload extends EventPayload {
    zone: string;
}
export interface IPlayerRoleAddEventPayload extends EventPayload {
    admin?: string;
    ign: string;
    role: string;
}
export interface IPlayerRoleRemoveEventPayload extends EventPayload {
    admin?: string;
    ign: string;
    role: string;
}
export interface IPlayerBannedEventPayload extends EventPayload {
    admin?: string;
    ign: string;
}
export interface IPlayerUnbannedEventPayload extends EventPayload {
    admin?: string;
    ign: string;
}
export interface IIitemSpawnEventPayload extends EventPayload {
    player: Player;
    item: string;
    quantity: number;
}
export interface INoteEditEventPayload extends EventPayload {
    player: Player;
    oldContent: string;
    newContent: string;
}
export interface ITeamCreatedEventPayload extends EventPayload {
    team: Team;
}
export interface ITeamJoinEventPayload extends EventPayload {
    team: Team;
    player: Player;
}
export interface ITeamLeaveEventPayload extends EventPayload {
    team: Team;
    player: Player;
}
export interface ITeamInviteEventPayload extends EventPayload {
    team: Team;
    player: Player;
}
export interface ITeamInviteCancelEventPayload extends EventPayload {
    id: number;
    owner: Player;
    ign: string;
}
export interface ITeamPromotedEventPayload extends EventPayload {
    team: Team;
    oldOwner: Player;
    newOwner: Player;
}
export interface IKitSpawnEventPayload extends EventPayload {
    ign: string;
    admin?: string;
    kit: string;
}
export interface IPlayerJoinedEventPayload extends EventPayload {
    player: Player;
}
export interface IPlayerLeftEventPayload extends EventPayload {
    player: Player;
}
export interface IEventStartEventPayload extends EventPayload {
    event: "Airdrop" | "Cargo Ship" | "Chinook" | "Patrol Helicopter" | "Halloween" | "Christmas" | "Small Oil Rig" | "Oil Rig" | "Bradley APC Debris" | "Patrol Helicopter Debris";
    special: boolean;
}
export interface IPlayerKillEVentPayload extends EventPayload {
    victim: IKillPlayer;
    killer: IKillPlayer;
}
export interface IPlayerListUpdatedEventPayload extends EventPayload {
    players: Player[];
    joined: Player[];
    left: Player[];
}
export interface IFrequencyGainedEventPayload extends EventPayload {
    frequency: number;
    coordinates: number[];
    range: number;
}
export interface IFrequencyLostEventPayload extends EventPayload {
    frequency: number;
}
export interface IServerSavingEventPayload extends EventPayload {
    entities: number;
}
export interface IErrorEventPayload {
    server?: IServer;
    error: string;
}
export interface IKillPlayer {
    id: string;
    name: string;
    type: PlayerKillType;
}
export declare enum RCEEvent {
    Ready = "ready",
    Message = "message",
    ExecutingCommand = "executingCommand",
    VendingMachineName = "vendingMachineName",
    QuickChat = "quickChat",
    PlayerSuicide = "playerSuicide",
    PlayerRespawned = "playerRespawned",
    CustomZoneCreated = "customZoneCreated",
    CustomZoneRemoved = "customZoneRemoved",
    PlayerRoleAdd = "playerRoleAdd",
    PlayerRoleRemove = "playerRoleRemove",
    PlayerBanned = "playerBanned",
    PlayerUnbanned = "playerUnbanned",
    ItemSpawn = "itemSpawn",
    NoteEdit = "noteEdit",
    TeamCreated = "teamCreated",
    TeamJoin = "teamJoin",
    TeamLeave = "teamLeave",
    TeamInvite = "teamInvite",
    TeamInviteCancel = "teamInviteCancel",
    TeamPromoted = "teamPromoted",
    KitSpawn = "kitSpawn",
    PlayerJoined = "playerJoined",
    PlayerLeft = "playerLeft",
    EventStart = "eventStart",
    PlayerKill = "playerKill",
    PlayerListUpdated = "playerListUpdated",
    FrequencyGained = "frequencyGained",
    FrequencyLost = "frequencyLost",
    ServerSaving = "serverSaving",
    Error = "error"
}
export interface Player {
    ign: string;
    ping: number;
    timeConnected: number;
    health: number;
    team?: Team | null;
    platform?: GamePlatform;
}
export interface Team {
    id: number;
    leader: Player;
    members: Player[];
}
export interface IEvent {
    [RCEEvent.Ready]: IReadyEventPayload;
    [RCEEvent.Message]: IMessageEventPayload;
    [RCEEvent.ExecutingCommand]: IExecutingCommandEventPayload;
    [RCEEvent.VendingMachineName]: IVendingMachineNameEventPayload;
    [RCEEvent.QuickChat]: IQuickChatEventPayload;
    [RCEEvent.PlayerSuicide]: IPlayerSuicideEventPayload;
    [RCEEvent.PlayerRespawned]: IPlayerRespawnedEventPayload;
    [RCEEvent.CustomZoneCreated]: ICustomZoneCreatedEventPayload;
    [RCEEvent.CustomZoneRemoved]: ICustomZoneRemovedEventPayload;
    [RCEEvent.PlayerRoleAdd]: IPlayerRoleAddEventPayload;
    [RCEEvent.PlayerRoleRemove]: IPlayerRoleRemoveEventPayload;
    [RCEEvent.PlayerBanned]: IPlayerBannedEventPayload;
    [RCEEvent.PlayerUnbanned]: IPlayerUnbannedEventPayload;
    [RCEEvent.ItemSpawn]: IIitemSpawnEventPayload;
    [RCEEvent.NoteEdit]: INoteEditEventPayload;
    [RCEEvent.TeamCreated]: ITeamCreatedEventPayload;
    [RCEEvent.TeamJoin]: ITeamJoinEventPayload;
    [RCEEvent.TeamLeave]: ITeamLeaveEventPayload;
    [RCEEvent.TeamInvite]: ITeamInviteEventPayload;
    [RCEEvent.TeamInviteCancel]: ITeamInviteCancelEventPayload;
    [RCEEvent.TeamPromoted]: ITeamPromotedEventPayload;
    [RCEEvent.KitSpawn]: IKitSpawnEventPayload;
    [RCEEvent.PlayerJoined]: IPlayerJoinedEventPayload;
    [RCEEvent.PlayerLeft]: IPlayerLeftEventPayload;
    [RCEEvent.EventStart]: IEventStartEventPayload;
    [RCEEvent.PlayerKill]: IPlayerKillEVentPayload;
    [RCEEvent.PlayerListUpdated]: IPlayerListUpdatedEventPayload;
    [RCEEvent.FrequencyGained]: IFrequencyGainedEventPayload;
    [RCEEvent.FrequencyLost]: IFrequencyLostEventPayload;
    [RCEEvent.ServerSaving]: IServerSavingEventPayload;
    [RCEEvent.Error]: IErrorEventPayload;
}
export declare enum GamePlatform {
    Playstation = "PS",
    XBOX = "XBL"
}
export interface ICommandRequest {
    identifier: string;
    command: string;
    uniqueId?: number;
    resolve: (value: string) => void;
    reject: (reason?: any) => void;
    timeout?: ReturnType<typeof setTimeout>;
}
export interface ILogger {
    error: (message: string) => void;
    warn: (message: string) => void;
    info: (message: string) => void;
    debug: (message: string) => void;
}
export interface ILogType {
    prefix: string;
    emoji: string;
    color: string;
}
export declare enum LogLevel {
    None = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4
}
export {};
