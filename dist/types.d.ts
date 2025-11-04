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
export declare enum RCEIntent {
    ServerInfo = "ServerInfo",
    PlayerList = "PlayerList",
    Frequencies = "Frequencies",
    Gibs = "Gibs",
    Kits = "Kits",
    CustomZones = "CustomZones",
    Teams = "Teams"
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
    intents: RCEIntent[];
    intentTimers?: {
        [key in RCEIntent]?: number;
    };
}
interface IServerIntervals {
    serverInfoInterval?: NodeJS.Timeout;
    playerListInterval?: NodeJS.Timeout;
    frequenciesInterval?: NodeJS.Timeout;
    gibsInterval?: NodeJS.Timeout;
    kitsInterval?: NodeJS.Timeout;
    customZonesInterval?: NodeJS.Timeout;
    teamsInterval?: NodeJS.Timeout;
}
export interface IServer {
    identifier: string;
    socket: WebSocket;
    socketManager?: SocketManager;
    flags: string[];
    intervals: IServerIntervals;
    state: any[];
    players?: IPlayer[];
    frequencies?: number[];
    teams?: ITeam[];
    kits?: IServerKit[];
    info?: IRustServerInformation;
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
    player: IPlayer;
    oldName: string;
    newName: string;
}
export interface IQuickChatEventPayload extends EventPayload {
    type: QuickChatChannel;
    player: IPlayer;
    message: QuickChat;
}
export interface IPlayerSuicideEventPayload extends EventPayload {
    player: IPlayer;
}
export interface IPlayerRespawnedEventPayload extends EventPayload {
    player: IPlayer;
    platform: GamePlatform;
}
export interface ICustomZoneCreatedEventPayload extends EventPayload {
    zone: string;
}
export interface ICustomZoneRemovedEventPayload extends EventPayload {
    zone: string;
}
export interface IPlayerRoleAddEventPayload extends EventPayload {
    admin?: IPlayer;
    player: IPlayer;
    role: string;
}
export interface IPlayerRoleRemoveEventPayload extends EventPayload {
    admin?: IPlayer;
    player: IPlayer;
    role: string;
}
export interface IPlayerBannedEventPayload extends EventPayload {
    admin?: IPlayer;
    player: IPlayer;
}
export interface IPlayerUnbannedEventPayload extends EventPayload {
    admin?: IPlayer;
    player: IPlayer;
}
export interface IIitemSpawnEventPayload extends EventPayload {
    player: IPlayer;
    item: string;
    quantity: number;
}
export interface INoteEditEventPayload extends EventPayload {
    player: IPlayer;
    oldContent: string;
    newContent: string;
}
export interface ITeamCreatedEventPayload extends EventPayload {
    team: ITeam;
}
export interface ITeamJoinEventPayload extends EventPayload {
    team: ITeam;
    player: IPlayer;
}
export interface ITeamLeaveEventPayload extends EventPayload {
    team: ITeam;
    player: IPlayer;
}
export interface ITeamInviteEventPayload extends EventPayload {
    team: ITeam;
    player: IPlayer;
}
export interface ITeamInviteCancelEventPayload extends EventPayload {
    team: ITeam;
    player: IPlayer;
}
export interface ITeamPromotedEventPayload extends EventPayload {
    team: ITeam;
    oldOwner: IPlayer;
    newOwner: IPlayer;
}
export interface IKitSpawnEventPayload extends EventPayload {
    player: IPlayer;
    admin?: IPlayer;
    kit: string;
}
export interface IPlayerJoinedEventPayload extends EventPayload {
    player: IPlayer;
}
export interface IPlayerLeftEventPayload extends EventPayload {
    player: IPlayer;
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
    players: IPlayer[];
    joined: IPlayer[];
    left: IPlayer[];
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
    player?: IPlayer;
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
export interface IPlayer {
    ign: string;
    ping: number;
    timeConnected: number;
    health: number;
    team?: ITeam | null;
    platform?: GamePlatform;
    role?: GameRole;
    state: any[];
    isOnline: boolean;
    lastSeen?: Date;
}
export interface ITeam {
    id: number;
    leader: IPlayer;
    members: IPlayer[];
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
export declare enum GameRole {
    None = "None",
    VIP = "VIP",
    Moderator = "Moderator",
    Admin = "Admin",
    Owner = "Owner"
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
interface IServerKitItem {
    shortName: string;
    quantity: number;
    condition: number;
    container: "Main" | "Belt" | "Wear";
}
export interface IServerKit {
    name: string;
    items: IServerKitItem[];
}
interface IServerZoneConfig {
    position: [number, number, number];
    size: number;
    type: "Sphere" | "Box";
    playerDamage: boolean;
    npcDamage: boolean;
    radiationDamage: number;
    playerBuildingDamage: boolean;
    allowBuilding: boolean;
    showArea: boolean;
    color: [number, number, number];
    showChatMessage: boolean;
    enterMessage: string;
    leaveMessage: string;
}
export interface IServerZone {
    name: string;
    enabled: boolean;
    config: IServerZoneConfig;
}
export {};
