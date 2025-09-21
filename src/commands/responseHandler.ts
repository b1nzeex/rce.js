import { RCEEvent, type IServer, GamePlatform } from "../types";
import type RCEManager from "../manager";
import { RegularExpressions } from "../data/regularExpressions";
import { QuickChat, QuickChatChannel } from "../data/quickChat";
import { EVENTS } from "../data/events";
import { getKill } from "../data/playerKill";

export default class ResponseHandler {
  public static handle(manager: RCEManager, server: IServer, message: string) {
    // Emit the message event
    manager.emit(RCEEvent.Message, {
      server,
      message,
    });

    // Event: Vending Machine Name
    const vendingMachineNameMatch = message.match(
      RegularExpressions.VendingMachineName
    );
    if (vendingMachineNameMatch) {
      const player = manager.getOrCreatePlayer(server.identifier, vendingMachineNameMatch[1]);
      manager.emit(RCEEvent.VendingMachineName, {
        server,
        player,
        oldName: vendingMachineNameMatch[2],
        newName: vendingMachineNameMatch[3],
      });
    }

    // Event: Quick Chat
    const quickChatMatch = message.match(RegularExpressions.QuickChat);
    if (quickChatMatch) {
      const player = manager.getOrCreatePlayer(server.identifier, quickChatMatch[3]);
      manager.emit(RCEEvent.QuickChat, {
        server,
        type: quickChatMatch[2] as QuickChatChannel,
        player,
        message: quickChatMatch[4] as QuickChat,
      });
    }

    // Event: Player Suicide
    if (message.includes("was suicide by Suicide")) {
      const ign = message.split(" was suicide by Suicide")[0];
      const player = manager.getOrCreatePlayer(server.identifier, ign);

      manager.emit(RCEEvent.PlayerSuicide, {
        server,
        player,
      });
    }

    // Event: Player Respawned
    if (message.includes("has entered the game")) {
      const ign = message.split(" [")[0];
      const platform: GamePlatform = message.includes("[SCARLETT]")
        ? GamePlatform.XBOX
        : GamePlatform.Playstation;

      // Create or get player and update platform
      const player = manager.getOrCreatePlayer(server.identifier, ign, { platform });

      manager.emit(RCEEvent.PlayerRespawned, {
        server,
        player,
        platform,
      });
    }

    // Event: Custom Zone Created
    const customZoneCreatedMatch = message.match(
      RegularExpressions.CustomZoneCreated
    );
    if (customZoneCreatedMatch) {
      manager.emit(RCEEvent.CustomZoneCreated, {
        server,
        zone: customZoneCreatedMatch[1],
      });
    }

    // Event: Custom Zone Removed
    const customZoneRemovedMatch = message.match(
      RegularExpressions.CustomZoneRemoved
    );
    if (customZoneRemovedMatch) {
      manager.emit(RCEEvent.CustomZoneRemoved, {
        server,
        zone: customZoneRemovedMatch[1],
      });
    }

    // Event: Player Role Add / Player Banned
    if (message.includes("Added")) {
      const playerRoleAddMatch = message.match(
        RegularExpressions.PlayerRoleAdd
      );
      if (playerRoleAddMatch) {
        manager.emit(RCEEvent.PlayerRoleAdd, {
          server,
          admin:
            playerRoleAddMatch[1] === "SERVER"
              ? undefined
              : playerRoleAddMatch[1],
          ign: playerRoleAddMatch[2],
          role: playerRoleAddMatch[3],
        });
      }
      const playerBannedMatch = message.match(RegularExpressions.PlayerBanned);
      if (playerBannedMatch) {
        manager.emit(RCEEvent.PlayerBanned, {
          server,
          admin:
            playerBannedMatch[1] === "SERVER"
              ? undefined
              : playerBannedMatch[1],
          ign: playerBannedMatch[2],
        });
      }
    }

    // Event: Player Role Remove / Player Unbanned
    if (message.includes("Removed")) {
      const playerRoleRemoveMatch = message.match(
        RegularExpressions.PlayerRoleRemove
      );
      if (playerRoleRemoveMatch) {
        manager.emit(RCEEvent.PlayerRoleRemove, {
          server,
          admin:
            playerRoleRemoveMatch[1] === "SERVER"
              ? undefined
              : playerRoleRemoveMatch[1],
          ign: playerRoleRemoveMatch[2],
          role: playerRoleRemoveMatch[3],
        });
      }
      const playerUnbannedMatch = message.match(
        RegularExpressions.PlayerUnbanned
      );
      if (playerUnbannedMatch) {
        manager.emit(RCEEvent.PlayerUnbanned, {
          server,
          admin:
            playerUnbannedMatch[1] === "SERVER"
              ? undefined
              : playerUnbannedMatch[1],
          ign: playerUnbannedMatch[2],
        });
      }
    }

    // Event: Item Spawn
    const itemSpawnMatch = message.match(RegularExpressions.ItemSpawn);
    if (itemSpawnMatch) {
      const player = manager.getOrCreatePlayer(server.identifier, itemSpawnMatch[1]);
      manager.emit(RCEEvent.ItemSpawn, {
        server,
        player,
        item: itemSpawnMatch[3],
        quantity: parseInt(itemSpawnMatch[2]),
      });
    }

    // Event: Note Edit
    const noteEditMatch = message.match(RegularExpressions.NoteEdit);
    if (noteEditMatch) {
      const oldContent = noteEditMatch[2].trim().split("\\n")[0];
      const newContent = noteEditMatch[3].trim().split("\\n")[0];

      if (newContent.length > 0 && newContent !== oldContent) {
        const player = manager.getOrCreatePlayer(server.identifier, noteEditMatch[1]);
        manager.emit(RCEEvent.NoteEdit, {
          server,
          player,
          oldContent,
          newContent,
        });
      }
    }

    // Event: Team Create
    const teamCreateMatch = message.match(RegularExpressions.TeamCreate);
    if (teamCreateMatch) {
      const teamId = parseInt(teamCreateMatch[2]);
      const owner = teamCreateMatch[1];
      
      // Create or get player and add team to teams list
      const serverData = manager.getServer(server.identifier);
      let leaderPlayer;
      if (serverData) {
        const team = {
          id: teamId,
          leader: null, // Will be set below
          members: []
        };
        
        leaderPlayer = manager.getOrCreatePlayer(server.identifier, owner, { team });
        team.leader = leaderPlayer;
        team.members = [leaderPlayer];
        
        serverData.teams.push(team);
        manager.updateServer(serverData);
      } else {
        leaderPlayer = manager.getOrCreatePlayer(server.identifier, owner);
      }
      
      manager.emit(RCEEvent.TeamCreated, {
        server,
        team: serverData?.teams.find(t => t.id === teamId) || {
          id: teamId,
          leader: leaderPlayer,
          members: [leaderPlayer]
        },
      });
    }

    // Event: Team Join
    const teamJoinMatch = message.match(RegularExpressions.TeamJoin);
    if (teamJoinMatch) {
      const teamId = parseInt(teamJoinMatch[3]);
      const ign = teamJoinMatch[1];
      
      // Create or get player and add to team members list
      const serverData = manager.getServer(server.identifier);
      let joiningPlayer;
      if (serverData) {
        const team = serverData.teams.find(t => t.id === teamId);
        if (team && !team.members.some(member => member.ign === ign)) {
          joiningPlayer = manager.getOrCreatePlayer(server.identifier, ign, { team });
          team.members.push(joiningPlayer);
          manager.updateServer(serverData);
        } else {
          joiningPlayer = manager.getOrCreatePlayer(server.identifier, ign);
        }
      } else {
        joiningPlayer = manager.getOrCreatePlayer(server.identifier, ign);
      }
      
      const team = serverData?.teams.find(t => t.id === teamId);
      manager.emit(RCEEvent.TeamJoin, {
        server,
        team: team || {
          id: teamId,
          leader: joiningPlayer,
          members: [joiningPlayer]
        },
        player: joiningPlayer,
      });
    }

    // Event: Team Leave
    const teamLeaveMatch = message.match(RegularExpressions.TeamLeave);
    if (teamLeaveMatch) {
      const ign = teamLeaveMatch[1];
      const teamId = parseInt(teamLeaveMatch[3]);
      
      // Create or get player and remove from team members list
      const serverData = manager.getServer(server.identifier);
      if (serverData) {
        const team = serverData.teams.find(t => t.id === teamId);
        if (team) {
          team.members = team.members.filter(member => member.ign !== ign);
          manager.getOrCreatePlayer(server.identifier, ign, { team: null });
          
          // If team is empty, remove it
          if (team.members.length === 0) {
            serverData.teams = serverData.teams.filter(t => t.id !== teamId);
          }
          manager.updateServer(serverData);
        }
      }
      
      const leavingPlayer = manager.getOrCreatePlayer(server.identifier, ign, { team: null });
      const team = serverData?.teams.find(t => t.id === teamId);
      manager.emit(RCEEvent.TeamLeave, {
        server,
        team: team || {
          id: teamId,
          leader: leavingPlayer,
          members: []
        },
        player: leavingPlayer,
      });
    }

    // Event: Team Invite
    const teamInviteMatch = message.match(RegularExpressions.TeamInvite);
    if (teamInviteMatch) {
      const teamId = parseInt(teamInviteMatch[3]);
      const player = manager.getOrCreatePlayer(server.identifier, teamInviteMatch[2]);
      const serverData = manager.getServer(server.identifier);
      const team = serverData?.teams.find(t => t.id === teamId);
      manager.emit(RCEEvent.TeamInvite, {
        server,
        team: team || {
          id: teamId,
          leader: player,
          members: []
        },
        player,
      });
    }

    // Event: Team Invite Cancel
    const teamInviteCancelMatch = message.match(
      RegularExpressions.TeamInviteCancel
    );
    if (teamInviteCancelMatch) {
      const owner = manager.getOrCreatePlayer(server.identifier, teamInviteCancelMatch[2]);
      manager.emit(RCEEvent.TeamInviteCancel, {
        server,
        id: parseInt(teamInviteCancelMatch[3]),
        owner,
        ign: teamInviteCancelMatch[1],
      });
    }

    // Event: Team Promoted
    const teamPromotedMatch = message.match(RegularExpressions.TeamPromoted);
    if (teamPromotedMatch) {
      const teamId = parseInt(teamPromotedMatch[3]);
      const oldOwner = teamPromotedMatch[1];
      const newOwner = teamPromotedMatch[2];
      
      // Update team leadership
      const serverData = manager.getServer(server.identifier);
      if (serverData) {
        const team = serverData.teams.find(t => t.id === teamId);
        if (team) {
          // Update the team's leader
          team.leader = manager.getOrCreatePlayer(server.identifier, newOwner, { team });
          manager.updateServer(serverData);
        }
      }
      
      const oldOwnerPlayer = manager.getOrCreatePlayer(server.identifier, oldOwner);
      const newOwnerPlayer = manager.getOrCreatePlayer(server.identifier, newOwner);
      
      const team = serverData?.teams.find(t => t.id === teamId);
      manager.emit(RCEEvent.TeamPromoted, {
        server,
        team: team || {
          id: teamId,
          leader: newOwnerPlayer,
          members: []
        },
        oldOwner: oldOwnerPlayer,
        newOwner: newOwnerPlayer,
      });
    }

    // Event: Kit Spawn
    const kitSpawnMatch = message.match(RegularExpressions.KitSpawn);
    if (kitSpawnMatch) {
      manager.emit(RCEEvent.KitSpawn, {
        server,
        admin: undefined,
        ign: kitSpawnMatch[1],
        kit: kitSpawnMatch[2],
      });
    }

    // Event: Kit Give
    const kitGiveMatch = message.match(RegularExpressions.KitGive);
    if (kitGiveMatch) {
      manager.emit(RCEEvent.KitSpawn, {
        server,
        admin: kitGiveMatch[1],
        ign: kitGiveMatch[2],
        kit: kitGiveMatch[3],
      });
    }

    // Event: Event Start
    if (message.startsWith("[EVENT")) {
      for (const [key, options] of Object.entries(EVENTS)) {
        if (message.includes(key)) {
          manager.emit(RCEEvent.EventStart, {
            server,
            event: options.name as any,
            special: options.special,
          });
        }
      }
    }

    // Event: Player Kill
    if (message.includes(" was killed by ")) {
      const [victim, killer] = message
        .split(" was killed by ")
        .map((str) => str.trim());

      const victimData = getKill(victim);
      const killerData = getKill(killer);

      manager.emit(RCEEvent.PlayerKill, {
        server,
        victim: victimData,
        killer: killerData,
      });
    }

    // Event: Server Saving
    if (message.startsWith("[ SAVE ]")) {
      const serverSavingMatch = message.match(RegularExpressions.ServerSaving);
      if (serverSavingMatch) {
        manager.emit(RCEEvent.ServerSaving, {
          server,
          entities: parseInt(serverSavingMatch[1]),
        });
      }
    }
  }
}
