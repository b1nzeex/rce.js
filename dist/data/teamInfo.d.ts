import { ITeam, IPlayer } from "../types";
/**
 * Parses the team info response from relationshipmanager.teaminfoall command
 * @param teamInfoResponse The raw response from the team info command
 * @param players List of currently connected players to filter out disconnected ones
 * @returns Object containing team list with player team references set
 */
export declare function parseTeamInfo(teamInfoResponse: string, players?: IPlayer[]): {
    teams: ITeam[];
};
