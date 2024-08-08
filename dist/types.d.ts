import { RCEEvent, QuickChat } from "./constants";
import { EventEmitter } from "events";
export interface AuthOptions {
    servers?: ServerOptions[];
    logLevel?: number;
    refreshToken?: string;
    file?: string;
    authMethod?: "file" | "manual";
}
export interface Auth {
    access_token: string;
    refresh_token: string;
    token_type: "Bearer";
    expires_in: number;
}
export interface RustServer {
    identifier: string;
    serverId: number;
    region: "US" | "EU";
    refreshPlayers?: number;
    players: string[];
    added: boolean;
}
export interface ServerOptions {
    identifier: string;
    serverId: number;
    region: "US" | "EU";
    refreshPlayers?: number;
}
export interface WebsocketRequest {
    identifier: string;
    region: "US" | "EU";
    sid: number;
}
export interface WebsocketMessage {
    type: "connection_ack" | "data" | "error" | "ka";
    payload: any;
    id: string;
}
export interface KillPlayer {
    id: string;
    type: "player" | "npc" | "entity" | "natural";
    name: string;
}
export interface EventPayload {
    server: RustServer;
}
export interface MessageEventPayload extends EventPayload {
    message: string;
}
export interface PlayerListUpdateEventPayload extends EventPayload {
    players: string[];
}
export interface QuickChatEventPayload extends EventPayload {
    type: "local" | "server";
    ign: string;
    message: QuickChat;
}
export interface PlayerJoinedEventPayload extends EventPayload {
    ign: string;
    platform: "XBL" | "PS";
}
export interface PlayerSuicideEventPayload extends EventPayload {
    ign: string;
}
export interface PlayerRespawnedEventPayload extends EventPayload {
    ign: string;
    platform: "XBL" | "PS";
}
export interface PlayerRoleAddEventPayload extends EventPayload {
    ign: string;
    role: string;
}
export interface NoteEditEventPayload extends EventPayload {
    ign: string;
    oldContent: string;
    newContent: string;
}
export interface EventStartEventPayload extends EventPayload {
    event: string;
    special: boolean;
}
export interface PlayerKillEventPayload extends EventPayload {
    victim: KillPlayer;
    killer: KillPlayer;
}
export interface ItemSpawnEventPayload extends EventPayload {
    ign: string;
    item: string;
    quantity: number;
}
export interface VendingMachineNameEventPayload extends EventPayload {
    ign: string;
    oldName: string;
    newName: string;
}
export interface TeamCreateEventPayload extends EventPayload {
    owner: string;
    id: number;
}
export interface TeamJoinEventPayload extends EventPayload {
    ign: string;
    owner: string;
    id: number;
}
export interface TeamLeaveEventPayload extends EventPayload {
    ign: string;
    owner: string;
    id: number;
}
export interface KitSpawnEventPayload extends EventPayload {
    ign: string;
    kit: string;
}
export interface KitGiveEventPayload extends EventPayload {
    admin: string;
    ign: string;
    kit: string;
}
export interface SpecialEventStartEventPayload extends EventPayload {
    event: "Easter" | "Halloween" | "Xmas" | "HalloweenPortal" | "XmasPortal";
}
export interface SpecialEventEndEventPayload extends EventPayload {
}
export interface RCEEventTypes {
    [RCEEvent.MESSAGE]: MessageEventPayload;
    [RCEEvent.PLAYERLIST_UPDATE]: PlayerListUpdateEventPayload;
    [RCEEvent.QUICK_CHAT]: QuickChatEventPayload;
    [RCEEvent.PLAYER_JOINED]: PlayerJoinedEventPayload;
    [RCEEvent.PLAYER_SUICIDE]: PlayerSuicideEventPayload;
    [RCEEvent.PLAYER_RESPAWNED]: PlayerRespawnedEventPayload;
    [RCEEvent.PLAYER_ROLE_ADD]: PlayerRoleAddEventPayload;
    [RCEEvent.NOTE_EDIT]: NoteEditEventPayload;
    [RCEEvent.EVENT_START]: EventStartEventPayload;
    [RCEEvent.PLAYER_KILL]: PlayerKillEventPayload;
    [RCEEvent.ITEM_SPAWN]: ItemSpawnEventPayload;
    [RCEEvent.VENDING_MACHINE_NAME]: VendingMachineNameEventPayload;
    [RCEEvent.KIT_SPAWN]: KitSpawnEventPayload;
    [RCEEvent.KIT_GIVE]: KitGiveEventPayload;
    [RCEEvent.TEAM_CREATE]: TeamCreateEventPayload;
    [RCEEvent.TEAM_JOIN]: TeamJoinEventPayload;
    [RCEEvent.TEAM_LEAVE]: TeamLeaveEventPayload;
    [RCEEvent.SPECIAL_EVENT_START]: SpecialEventStartEventPayload;
    [RCEEvent.SPECIAL_EVENT_END]: SpecialEventEndEventPayload;
}
export declare class RCEEvents extends EventEmitter {
    emit<K extends keyof RCEEventTypes>(event: K, ...args: RCEEventTypes[K] extends undefined ? [] : [RCEEventTypes[K]]): boolean;
    on<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
    once<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
    off<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
}
