import type { WebSocket } from "ws";
import { type PlayerKillType } from "./data/playerKill";
import { QuickChat } from "./data/quickChat";
export interface IOptions {
    logLevel?: LogLevel;
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
}
interface IServerIntervals {
    playerRefreshing: NodeJS.Timeout;
    frequencyRefreshing: NodeJS.Timeout;
    gibRefreshing: NodeJS.Timeout;
}
export interface IServer {
    identifier: string;
    socket: WebSocket;
    flags: string[];
    intervals: IServerIntervals;
    state: any[];
    connectedPlayers: string[];
    frequencies: number[];
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
    ign: string;
    oldName: string;
    newName: string;
}
export interface IQuickChatEventPayload extends EventPayload {
    type: "team" | "server" | "local";
    ign: string;
    message: QuickChat;
}
export interface IPlayerSuicideEventPayload extends EventPayload {
    ign: string;
}
export interface IPlayerRespawnedEventPayload extends EventPayload {
    ign: string;
    platform: "PS" | "XBL";
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
export interface IIitemSpawnEventPayload extends EventPayload {
    ign: string;
    item: string;
    quantity: number;
}
export interface INoteEditEventPayload extends EventPayload {
    ign: string;
    oldContent: string;
    newContent: string;
}
export interface ITeamCreatedEventPayload extends EventPayload {
    id: number;
    owner: string;
}
export interface ITeamJoinEventPayload extends EventPayload {
    id: number;
    owner: string;
    ign: string;
}
export interface ITeamLeaveEventPayload extends EventPayload {
    id: number;
    owner: string;
    ign: string;
}
export interface ITeamInviteEventPayload extends EventPayload {
    id: number;
    owner: string;
    ign: string;
}
export interface ITeamInviteCancelEventPayload extends EventPayload {
    id: number;
    owner: string;
    ign: string;
}
export interface ITeamPromotedEventPayload extends EventPayload {
    id: number;
    oldOwner: string;
    newOwner: string;
}
export interface IKitSpawnEventPayload extends EventPayload {
    ign: string;
    admin?: string;
    kit: string;
}
export interface IPlayerJoinedEventPayload extends EventPayload {
    ign: string;
}
export interface IPlayerLeftEventPayload extends EventPayload {
    ign: string;
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
    players: string[];
    joined: string[];
    left: string[];
}
export interface IFrequencyGainedEventPayload extends EventPayload {
    frequency: number;
    coordinates: number[];
    range: number;
}
export interface IFrequencyLostEventPayload extends EventPayload {
    frequency: number;
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
    Error = "error"
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
    [RCEEvent.Error]: IErrorEventPayload;
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
