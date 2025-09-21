import { RegularExpressions } from "./regularExpressions";
import { Team, Player } from "../types";

/**
 * Parses the team info response from relationshipmanager.teaminfoall command
 * @param teamInfoResponse The raw response from the team info command
 * @param players List of currently connected players to filter out disconnected ones
 * @returns Object containing team list with player team references set
 */
export function parseTeamInfo(teamInfoResponse: string, players: Player[] = []): {
  teams: Team[];
} {
  const teams: Team[] = [];
  
  if (!teamInfoResponse || RegularExpressions.TeamInfoNoTeams.test(teamInfoResponse)) {
    return { teams };
  }

  // Create a map of player names to Player objects for quick lookup
  const playerMap = new Map<string, Player>();
  players.forEach(player => {
    playerMap.set(player.ign, player);
  });

  // Split the response into lines for processing
  const lines = teamInfoResponse.split('\n').filter(line => line.trim());
  
  let currentTeamId: number | null = null;
  let currentTeamMembers: Player[] = [];
  let currentTeamLeader: Player | null = null;
  
  for (const line of lines) {
    // Check if this line is a team header
    const teamHeaderMatch = line.match(RegularExpressions.TeamInfoTeamHeader);
    if (teamHeaderMatch) {
      // Save the previous team if we have one
      if (currentTeamId !== null && currentTeamLeader !== null) {
        if (currentTeamMembers.length > 0) {
          const team: Team = {
            id: currentTeamId,
            leader: currentTeamLeader,
            members: currentTeamMembers
          };
          
          // Set team reference on all team members
          currentTeamMembers.forEach(player => {
            player.team = team;
          });
          
          teams.push(team);
        }
      }
      
      // Start new team
      currentTeamId = parseInt(teamHeaderMatch[1]);
      currentTeamMembers = [];
      currentTeamLeader = null;
      continue;
    }
    
    // Check if this line is a player entry
    const playerMatch = line.match(RegularExpressions.TeamInfoPlayer);
    if (playerMatch && currentTeamId !== null) {
      const playerName = playerMatch[1].trim();
      const player = playerMap.get(playerName);
      
      // Only process connected players
      if (player) {
        currentTeamMembers.push(player);
        
        // Check if this player is the leader
        if (line.includes('(LEADER)')) {
          currentTeamLeader = player;
        }
      }
    }
  }
  
  // Save the last team
  if (currentTeamId !== null && currentTeamLeader !== null) {
    if (currentTeamMembers.length > 0) {
      const team: Team = {
        id: currentTeamId,
        leader: currentTeamLeader,
        members: currentTeamMembers
      };
      
      // Set team reference on all team members
      currentTeamMembers.forEach(player => {
        player.team = team;
      });
      
      teams.push(team);
    }
  }
  
  return { teams };
}
