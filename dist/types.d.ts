import { RCEEvent } from "./constants";
import { EventEmitter } from "events";
export interface AuthOptions {
    email: string;
    password: string;
    logLevel?: number;
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
export interface RCEEventTypes {
    [RCEEvent.MESSAGE]: {
        server: RustServer;
        message: string;
    };
    [RCEEvent.PLAYERLIST_UPDATE]: {
        server: RustServer;
        players: string[];
    };
    [RCEEvent.QUICK_CHAT]: {
        server: RustServer;
        type: "local" | "server";
        ign: string;
        message: string;
    };
    [RCEEvent.PLAYER_JOINED]: {
        server: RustServer;
        ign: string;
        platform: "XBL" | "PS";
    };
    [RCEEvent.PLAYER_ROLE_ADD]: {
        server: RustServer;
        ign: string;
        role: string;
    };
    [RCEEvent.NOTE_EDIT]: {
        server: RustServer;
        ign: string;
        oldContent: string;
        newContent: string;
    };
    [RCEEvent.EVENT_START]: {
        server: RustServer;
        event: string;
    };
    [RCEEvent.PLAYER_KILL]: {
        server: RustServer;
        victim: string;
        killer: string;
    };
}
export declare class RCEEvents extends EventEmitter {
    emit<K extends keyof RCEEventTypes>(event: K, ...args: RCEEventTypes[K] extends undefined ? [] : [RCEEventTypes[K]]): boolean;
    on<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
    once<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
    off<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
}
