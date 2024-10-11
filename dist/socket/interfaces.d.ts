import type { PlayerKillType } from "../constants";
export interface WSRequest {
    identifier: string;
    region: "US" | "EU";
    sid: number;
}
export interface WSMessage {
    type: "connection_ack" | "data" | "ka" | "error";
    payload: any;
    id: string;
}
export interface PlayerKillData {
    id: string;
    name: string;
    type: PlayerKillType;
}
