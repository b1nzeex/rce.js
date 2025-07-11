import type { IKillPlayer } from "../types";
export declare enum PlayerKillType {
    Natural = "Natural",
    Entity = "Entity",
    Player = "Player",
    Npc = "Npc"
}
export declare const playerKillData: {
    id: string;
    name: string;
    type: PlayerKillType;
}[];
export declare function getKill(ign: string): IKillPlayer;
