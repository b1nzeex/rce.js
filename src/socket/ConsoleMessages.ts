import type { RustServer } from "../servers/interfaces";
import type { PlayerKillData, WSMessage } from "./interfaces";
import {
  playerKillData,
  PlayerKillType,
  QuickChat,
  RCEEvent,
  RegularExpressions,
} from "../constants";
import type RCEManager from "../Manager";
import CommandHandler from "../servers/CommandHandler";

const EVENTS = {
  event_airdrop: {
    name: "Airdrop",
    special: false,
  },
  event_cargoship: {
    name: "Cargo Ship",
    special: false,
  },
  event_cargoheli: {
    name: "Chinook",
    special: false,
  },
  event_helicopter: {
    name: "Patrol Helicopter",
    special: false,
  },
  event_halloween: {
    name: "Halloween",
    special: true,
  },
  event_xmas: {
    name: "Christmas",
    special: true,
  },
  event_easter: {
    name: "Easter",
    special: true,
  },
};

export default class ConsoleMessagesHandler {
  public static handle(
    manager: RCEManager,
    message: WSMessage,
    server: RustServer
  ) {
    const messageArray: string[] =
      message.payload.data.consoleMessages.message
        ?.split("\n")
        .filter((e) => e !== "") || [];

    if (!server.flags.includes("INIT_LOGS")) {
      manager.logger.debug(
        `[${server.identifier}] Initial Logs Received: ${messageArray.length}`
      );

      server.flags.push("INIT_LOGS");
      return manager.servers.update(server);
    }

    let currentCommand;

    messageArray.forEach((data) => {
      const logMatch = data.match(RegularExpressions.Log);
      if (!logMatch) return;

      const [, date, content] = logMatch;
      const log = content.trim();
      if (!log) return;

      manager.events.emit(RCEEvent.Message, { server, message: log });

      // EVENT: COMMAND_EXECUTING
      const commandExecutingMatch = log.match(
        RegularExpressions.CommandExecuting
      );
      if (commandExecutingMatch) {
        const cmd = commandExecutingMatch[1];

        manager.logger.debug(`[${server.identifier}] Executing Match: ${cmd}`);

        manager.events.emit(RCEEvent.ExecutingCommand, {
          server,
          command: cmd,
        });

        const command = CommandHandler.get(server.identifier, cmd);
        if (command && !command.timestamp) {
          manager.logger.debug(
            `[${server.identifier}] Command In Queue: ${cmd}`
          );

          command.timestamp = date;
          CommandHandler.add(command);

          currentCommand = cmd;

          return manager.logger.debug(
            `[${server.identifier}] Command Timestamp Added: ${cmd}`
          );
        }
      }

      // Check for Command Response
      const command = CommandHandler.getQueued(server.identifier, date);
      if (command && !log.startsWith("[ SAVE ]")) {
        manager.logger.debug(
          `[${server.identifier}] Command Response Found: ${command.command}`
        );

        command.resolve({
          ok: true,
          response: log,
        });
        clearTimeout(command.timeout);
        CommandHandler.remove(command);
      } else if (currentCommand) {
        manager.logger.debug(
          `[${server.identifier}] Command Response Not Found, Using Other Method: ${currentCommand}`
        );

        const command = CommandHandler.get(server.identifier, currentCommand);
        if (command) {
          command.resolve({
            ok: true,
            response: log,
          });
          clearTimeout(command.timeout);
          CommandHandler.remove(command);
          currentCommand = null;
        }
      }

      // EVENT: VENDING_MACHINE_NAME
      const vendingMachineNameMatch = log.match(
        RegularExpressions.VendingMachineName
      );
      if (vendingMachineNameMatch) {
        manager.events.emit(RCEEvent.VendingMachineName, {
          server,
          ign: vendingMachineNameMatch[1],
          oldName: vendingMachineNameMatch[2],
          newName: vendingMachineNameMatch[3],
        });
      }

      // EVENT: QUICK_CHAT
      const quickChatMatch = log.match(RegularExpressions.QuickChat);
      if (quickChatMatch) {
        const types = {
          "[CHAT TEAM]": "team",
          "[CHAT SERVER]": "server",
          "[CHAT LOCAL]": "local",
        };

        manager.events.emit(RCEEvent.QuickChat, {
          server,
          type: types[quickChatMatch[1]],
          ign: quickChatMatch[3],
          message: quickChatMatch[4] as QuickChat,
        });
      }

      // EVENT: PLAYER_SUICIDE
      if (log.includes("was suicide by Suicide")) {
        const ign = log.split(" was suicide by Suicide")[0];

        manager.events.emit(RCEEvent.PlayerSuicide, {
          server,
          ign,
        });
      }

      // EVENT: PLAYER_RESPAWNED
      if (log.includes("has entered the game")) {
        const ign = log.split(" [")[0];
        const platform = log.includes("[xboxone]") ? "XBL" : "PS";

        manager.events.emit(RCEEvent.PlayerRespawned, {
          server,
          ign,
          platform,
        });
      }

      // EVENT: CUSTOM_ZONE_CREATED
      const customZoneCreatedMatch = log.match(
        RegularExpressions.CustomZoneCreated
      );
      if (customZoneCreatedMatch) {
        manager.events.emit(RCEEvent.CustomZoneCreated, {
          server,
          zone: customZoneCreatedMatch[1],
        });
      }

      // EVENT: CUSTOM_ZONE_REMOVED
      const customZoneRemovedMatch = log.match(
        RegularExpressions.CustomZoneRemoved
      );
      if (customZoneRemovedMatch) {
        manager.events.emit(RCEEvent.CustomZoneRemoved, {
          server,
          zone: customZoneRemovedMatch[1],
        });
      }

      // EVENT: PLAYER_ROLE_ADD
      const playerRoleAddMatch = log.match(RegularExpressions.PlayerRoleAdd);
      if (playerRoleAddMatch && log.includes("Added")) {
        manager.events.emit(RCEEvent.PlayerRoleAdd, {
          server,
          ign: playerRoleAddMatch[1],
          role: playerRoleAddMatch[3],
        });
      }

      // EVENT: ITEM_SPAWN
      const itemSpawnMatch = log.match(RegularExpressions.ItemSpawn);
      if (itemSpawnMatch) {
        manager.events.emit(RCEEvent.ItemSpawn, {
          server,
          ign: itemSpawnMatch[1],
          item: itemSpawnMatch[3],
          quantity: parseInt(itemSpawnMatch[2]),
        });
      }

      // EVENT: NOTE_EDIT
      const noteEditMatch = log.match(RegularExpressions.NoteEdit);
      if (noteEditMatch) {
        const oldContent = noteEditMatch[2].trim().split("\\n")[0];
        const newContent = noteEditMatch[3].trim().split("\\n")[0];

        if (newContent.length > 0 && oldContent !== newContent) {
          manager.events.emit(RCEEvent.NoteEdit, {
            server,
            ign: noteEditMatch[1],
            oldContent,
            newContent,
          });
        }
      }

      // EVENT: TEAM_CREATE
      const teamCreateMatch = log.match(RegularExpressions.TeamCreate);
      if (teamCreateMatch) {
        manager.events.emit(RCEEvent.TeamCreate, {
          server,
          id: parseInt(teamCreateMatch[2]),
          owner: teamCreateMatch[1],
        });
      }

      // EVENT: TEAM_JOIN
      const teamJoinMatch = log.match(RegularExpressions.TeamJoin);
      if (teamJoinMatch) {
        manager.events.emit(RCEEvent.TeamJoin, {
          server,
          id: parseInt(teamJoinMatch[3]),
          owner: teamJoinMatch[2],
          ign: teamJoinMatch[1],
        });
      }

      // EVENT: TEAM_LEAVE
      const teamLeaveMatch = log.match(RegularExpressions.TeamLeave);
      if (teamLeaveMatch) {
        manager.events.emit(RCEEvent.TeamLeave, {
          server,
          id: parseInt(teamLeaveMatch[3]),
          owner: teamLeaveMatch[2],
          ign: teamLeaveMatch[1],
        });
      }

      // EVENT: KIT_SPAWN
      const kitSpawnMatch = log.match(RegularExpressions.KitSpawn);
      if (kitSpawnMatch) {
        manager.events.emit(RCEEvent.KitSpawn, {
          server,
          ign: kitSpawnMatch[1],
          kit: kitSpawnMatch[2],
        });
      }

      // EVENT: KIT_GIVE
      const kitGiveMatch = log.match(RegularExpressions.KitGive);
      if (kitGiveMatch) {
        manager.events.emit(RCEEvent.KitGive, {
          server,
          ign: kitGiveMatch[2],
          admin: kitGiveMatch[1],
          kit: kitGiveMatch[3],
        });
      }

      // EVENT: SPECIAL_EVENT_SET
      const specialEventSetMatch = log.match(
        RegularExpressions.SpecialEventSet
      );
      if (specialEventSetMatch) {
        manager.events.emit(RCEEvent.SpecialEventSet, {
          server,
          event: specialEventSetMatch[1] as any,
        });
      }

      // EVENT: EVENT_START
      if (log.startsWith("[event]")) {
        for (const [key, options] of Object.entries(EVENTS)) {
          if (log.includes(key)) {
            manager.events.emit(RCEEvent.EventStart, {
              server,
              event: options.name as any,
              special: options.special,
            });
          }
        }
      }

      // EVENT: PLAYER_KILL
      if (log.includes(" was killed by ")) {
        const [victim, killer] = log
          .split(" was killed by ")
          .map((str) => str.trim());

        const victimData = this.getKill(victim);
        const killerData = this.getKill(killer);

        manager.events.emit(RCEEvent.PlayerKill, {
          server,
          victim: victimData,
          killer: killerData,
        });
      }
    });
  }

  private static getKill(ign: string): PlayerKillData {
    const data = playerKillData.find((e) => e.id === ign.toLowerCase());
    if (data) {
      return {
        id: ign,
        name: data.name,
        type: data.type,
      };
    }

    if (Number(ign)) {
      return {
        id: ign,
        name: "Scientist",
        type: PlayerKillType.Npc,
      };
    }

    return {
      id: ign,
      name: ign,
      type: PlayerKillType.Player,
    };
  }
}
