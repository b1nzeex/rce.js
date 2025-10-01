import { IPlayer } from "../types";
/**
 * Parses the role info response and sets each player's `role`.
 * Players not in any role fall back to `null`.
 * @param roleInfoResponse The raw response string
 * @param players List of currently connected players
 * @returns Object containing updated player list
 */
export declare function parseRoleInfo(roleInfoResponse: string, players?: IPlayer[]): {
    players: IPlayer[];
};
