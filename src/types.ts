import { RCEEvent, QuickChat } from "./constants";
import { EventEmitter } from "events";

export interface AuthOptions {
  servers: ServerOptions[];
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

export interface RCEEventTypes {
  [RCEEvent.MESSAGE]: { server: RustServer; message: string };
  [RCEEvent.PLAYERLIST_UPDATE]: { server: RustServer; players: string[] };
  [RCEEvent.QUICK_CHAT]: {
    server: RustServer;
    type: "local" | "server";
    ign: string;
    message: QuickChat;
  };
  [RCEEvent.PLAYER_JOINED]: {
    server: RustServer;
    ign: string;
    platform: "XBL" | "PS";
  };
  [RCEEvent.PLAYER_SUICIDE]: { server: RustServer; ign: string };
  [RCEEvent.PLAYER_RESPAWNED]: {
    server: RustServer;
    ign: string;
    platform: "XBL" | "PS";
  };
  [RCEEvent.PLAYER_ROLE_ADD]: { server: RustServer; ign: string; role: string };
  [RCEEvent.NOTE_EDIT]: {
    server: RustServer;
    ign: string;
    oldContent: string;
    newContent: string;
  };
  [RCEEvent.EVENT_START]: { server: RustServer; event: string };
  [RCEEvent.PLAYER_KILL]: {
    server: RustServer;
    victim: KillPlayer;
    killer: KillPlayer;
  };
  [RCEEvent.ITEM_SPAWN]: {
    server: RustServer;
    ign: string;
    item: string;
    quantity: number;
  };
  [RCEEvent.VENDING_MACHINE_NAME]: {
    server: RustServer;
    ign: string;
    oldName: string;
    newName: string;
  };
}

export class RCEEvents extends EventEmitter {
  emit<K extends keyof RCEEventTypes>(
    event: K,
    ...args: RCEEventTypes[K] extends undefined ? [] : [RCEEventTypes[K]]
  ): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof RCEEventTypes>(
    event: K,
    listener: (arg: RCEEventTypes[K]) => void
  ): this {
    return super.on(event, listener);
  }

  once<K extends keyof RCEEventTypes>(
    event: K,
    listener: (arg: RCEEventTypes[K]) => void
  ): this {
    return super.once(event, listener);
  }

  off<K extends keyof RCEEventTypes>(
    event: K,
    listener: (arg: RCEEventTypes[K]) => void
  ): this {
    return super.off(event, listener);
  }
}
