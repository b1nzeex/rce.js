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
