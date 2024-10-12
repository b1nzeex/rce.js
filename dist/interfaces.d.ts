import { LogLevel, QuickChat, RCEEvent } from "./constants";
import { ILogger } from "./logger/interfaces";
import type { RustServer } from "./servers/interfaces";
import { PlayerKillData } from "./socket/interfaces";
export interface AuthOptions {
    username: string;
    password: string;
}
export interface LoggerOptions {
    level?: LogLevel;
    file?: string;
    instance?: ILogger;
}
interface EventPayload {
    server: RustServer;
}
export interface MessageEventPayload extends EventPayload {
    message: string;
}
export interface ServerReadyEventPayload extends EventPayload {
    ready: boolean;
}
export interface ServiceStatusEventPayload extends EventPayload {
    status: RustServer["status"];
}
export interface ServiceSensorEventPayload extends EventPayload {
    cpuPercentage: number;
    memoryUsed: number;
}
export interface ExecutingCommandEventPayload extends EventPayload {
    command: string;
}
export interface VendingMachineNameEventPayload extends EventPayload {
    ign: string;
    oldName: string;
    newName: string;
}
export interface QuickChatEventPayload extends EventPayload {
    type: "team" | "server" | "local";
    ign: string;
    message: QuickChat;
}
export interface PlayerSuicideEventPayload extends EventPayload {
    ign: string;
}
export interface PlayerRespawnedEventPayload extends EventPayload {
    ign: string;
    platform: "XBL" | "PS";
}
export interface CustomZoneCreatedEventPayload extends EventPayload {
    zone: string;
}
export interface CustomZoneRemovedEventPayload extends EventPayload {
    zone: string;
}
export interface PlayerRoleAddEventPayload extends EventPayload {
    ign: string;
    role: string;
}
export interface ItemSpawnEventPayload extends EventPayload {
    ign: string;
    item: string;
    quantity: number;
}
export interface NoteEditEventPayload extends EventPayload {
    ign: string;
    oldContent: string;
    newContent: string;
}
export interface TeamCreateEventPayload extends EventPayload {
    id: number;
    owner: string;
}
export interface TeamJoinEventPayload extends EventPayload {
    id: number;
    owner: string;
    ign: string;
}
export interface TeamLeaveEventPayload extends EventPayload {
    id: number;
    owner: string;
    ign: string;
}
export interface KitSpawnEventPayload extends EventPayload {
    ign: string;
    kit: string;
}
export interface KitGiveEventPayload extends EventPayload {
    ign: string;
    admin: string;
    kit: string;
}
export interface PlayerJoinedEventPayload extends EventPayload {
    ign: string;
}
export interface PlayerLeftEventPayload extends EventPayload {
    ign: string;
}
export interface SpecialEventSetEventPayload extends EventPayload {
    event: "Easter" | "Halloween" | "Xmas" | "HalloweenPortal" | "XmasPortal";
}
export interface EventStartEventPayload extends EventPayload {
    event: "Airdrop" | "Cargo Ship" | "Chinook" | "Patrol Helicopter" | "Halloween" | "Christmas" | "Small Oil Rig" | "Oil Rig" | "Bradley APC Debris" | "Patrol Helicopter Debris";
    special: boolean;
}
export interface PlayerKillEventPayload extends EventPayload {
    victim: PlayerKillData;
    killer: PlayerKillData;
}
export interface PlayerListUpdatedEventPayload extends EventPayload {
    players: string[];
    joined: string[];
    left: string[];
}
export interface FrequencyGainedEventPayload extends EventPayload {
    frequency: number;
    coordinates: number[];
    range: number;
}
export interface FrequencyLostEventPayload extends EventPayload {
    frequency: number;
}
export interface ErrorEventPayload {
    error: string;
    server?: RustServer;
}
export interface RCEEventTypes {
    [RCEEvent.Message]: MessageEventPayload;
    [RCEEvent.ServerReady]: ServerReadyEventPayload;
    [RCEEvent.ServiceStatus]: ServiceStatusEventPayload;
    [RCEEvent.ServiceSensor]: ServiceSensorEventPayload;
    [RCEEvent.ExecutingCommand]: ExecutingCommandEventPayload;
    [RCEEvent.VendingMachineName]: VendingMachineNameEventPayload;
    [RCEEvent.QuickChat]: QuickChatEventPayload;
    [RCEEvent.PlayerSuicide]: PlayerSuicideEventPayload;
    [RCEEvent.PlayerRespawned]: PlayerRespawnedEventPayload;
    [RCEEvent.CustomZoneCreated]: CustomZoneCreatedEventPayload;
    [RCEEvent.CustomZoneRemoved]: CustomZoneRemovedEventPayload;
    [RCEEvent.PlayerRoleAdd]: PlayerRoleAddEventPayload;
    [RCEEvent.ItemSpawn]: ItemSpawnEventPayload;
    [RCEEvent.NoteEdit]: NoteEditEventPayload;
    [RCEEvent.TeamCreate]: TeamCreateEventPayload;
    [RCEEvent.TeamJoin]: TeamJoinEventPayload;
    [RCEEvent.TeamLeave]: TeamLeaveEventPayload;
    [RCEEvent.KitSpawn]: KitSpawnEventPayload;
    [RCEEvent.KitGive]: KitGiveEventPayload;
    [RCEEvent.SpecialEventSet]: SpecialEventSetEventPayload;
    [RCEEvent.EventStart]: EventStartEventPayload;
    [RCEEvent.PlayerKill]: PlayerKillEventPayload;
    [RCEEvent.PlayerJoined]: PlayerJoinedEventPayload;
    [RCEEvent.PlayerLeft]: PlayerLeftEventPayload;
    [RCEEvent.PlayerListUpdated]: PlayerListUpdatedEventPayload;
    [RCEEvent.FrequencyGained]: FrequencyGainedEventPayload;
    [RCEEvent.FrequencyLost]: FrequencyLostEventPayload;
    [RCEEvent.Error]: ErrorEventPayload;
}
export {};
