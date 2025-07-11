"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const regularExpressions_1 = require("../data/regularExpressions");
const events_1 = require("../data/events");
const playerKill_1 = require("../data/playerKill");
class ResponseHandler {
    static handle(manager, server, message) {
        // Emit the message event
        manager.emit(types_1.RCEEvent.Message, {
            server,
            message,
        });
        // Event: Vending Machine Name
        const vendingMachineNameMatch = message.match(regularExpressions_1.RegularExpressions.VendingMachineName);
        if (vendingMachineNameMatch) {
            manager.emit(types_1.RCEEvent.VendingMachineName, {
                server,
                ign: vendingMachineNameMatch[1],
                oldName: vendingMachineNameMatch[2],
                newName: vendingMachineNameMatch[3],
            });
        }
        // Event: Quick Chat
        const quickChatMatch = message.match(regularExpressions_1.RegularExpressions.QuickChat);
        if (quickChatMatch) {
            const types = {
                "[CHAT TEAM]": "team",
                "[CHAT SERVER]": "server",
                "[CHAT LOCAL]": "local",
            };
            manager.emit(types_1.RCEEvent.QuickChat, {
                server,
                type: types[quickChatMatch[1]],
                ign: quickChatMatch[3],
                message: quickChatMatch[4],
            });
        }
        // Event: Player Suicide
        if (message.includes("was suicide by Suicide")) {
            const ign = message.split(" was suicide by Suicide")[0];
            manager.emit(types_1.RCEEvent.PlayerSuicide, {
                server,
                ign,
            });
        }
        // Event: Player Respawned
        if (message.includes("has entered the game")) {
            const ign = message.split(" [")[0];
            const platform = message.includes("[SCARLETT]") ? "XBL" : "PS";
            manager.emit(types_1.RCEEvent.PlayerRespawned, {
                server,
                ign,
                platform,
            });
        }
        // Event: Custom Zone Created
        const customZoneCreatedMatch = message.match(regularExpressions_1.RegularExpressions.CustomZoneCreated);
        if (customZoneCreatedMatch) {
            manager.emit(types_1.RCEEvent.CustomZoneCreated, {
                server,
                zone: customZoneCreatedMatch[1],
            });
        }
        // Event: Custom Zone Removed
        const customZoneRemovedMatch = message.match(regularExpressions_1.RegularExpressions.CustomZoneRemoved);
        if (customZoneRemovedMatch) {
            manager.emit(types_1.RCEEvent.CustomZoneRemoved, {
                server,
                zone: customZoneRemovedMatch[1],
            });
        }
        // Event: Player Role Add
        if (message.includes("Added")) {
            const playerRoleAddMatch = message.match(regularExpressions_1.RegularExpressions.PlayerRoleAdd);
            if (playerRoleAddMatch) {
                manager.emit(types_1.RCEEvent.PlayerRoleAdd, {
                    server,
                    admin: playerRoleAddMatch[1] === "SERVER"
                        ? undefined
                        : playerRoleAddMatch[1],
                    ign: playerRoleAddMatch[2],
                    role: playerRoleAddMatch[3],
                });
            }
        }
        // Event: Player Role Remove
        if (message.includes("Removed")) {
            const playerRoleRemoveMatch = message.match(regularExpressions_1.RegularExpressions.PlayerRoleRemove);
            if (playerRoleRemoveMatch) {
                manager.emit(types_1.RCEEvent.PlayerRoleRemove, {
                    server,
                    admin: playerRoleRemoveMatch[1] === "SERVER"
                        ? undefined
                        : playerRoleRemoveMatch[1],
                    ign: playerRoleRemoveMatch[2],
                    role: playerRoleRemoveMatch[3],
                });
            }
        }
        // Event: Item Spawn
        const itemSpawnMatch = message.match(regularExpressions_1.RegularExpressions.ItemSpawn);
        if (itemSpawnMatch) {
            manager.emit(types_1.RCEEvent.ItemSpawn, {
                server,
                ign: itemSpawnMatch[1],
                item: itemSpawnMatch[3],
                quantity: parseInt(itemSpawnMatch[2]),
            });
        }
        // Event: Note Edit
        const noteEditMatch = message.match(regularExpressions_1.RegularExpressions.NoteEdit);
        if (noteEditMatch) {
            const oldContent = noteEditMatch[2].trim().split("\\n")[0];
            const newContent = noteEditMatch[3].trim().split("\\n")[0];
            if (newContent.length > 0 && newContent !== oldContent) {
                manager.emit(types_1.RCEEvent.NoteEdit, {
                    server,
                    ign: noteEditMatch[1],
                    oldContent,
                    newContent,
                });
            }
        }
        // Event: Team Create
        const teamCreateMatch = message.match(regularExpressions_1.RegularExpressions.TeamCreate);
        if (teamCreateMatch) {
            manager.emit(types_1.RCEEvent.TeamCreated, {
                server,
                id: parseInt(teamCreateMatch[2]),
                owner: teamCreateMatch[1],
            });
        }
        // Event: Team Join
        const teamJoinMatch = message.match(regularExpressions_1.RegularExpressions.TeamJoin);
        if (teamJoinMatch) {
            manager.emit(types_1.RCEEvent.TeamJoin, {
                server,
                id: parseInt(teamJoinMatch[3]),
                owner: teamJoinMatch[2],
                ign: teamJoinMatch[1],
            });
        }
        // Event: Team Leave
        const teamLeaveMatch = message.match(regularExpressions_1.RegularExpressions.TeamLeave);
        if (teamLeaveMatch) {
            manager.emit(types_1.RCEEvent.TeamLeave, {
                server,
                id: parseInt(teamLeaveMatch[3]),
                owner: teamLeaveMatch[2],
                ign: teamLeaveMatch[1],
            });
        }
        // Event: Team Invite
        const teamInviteMatch = message.match(regularExpressions_1.RegularExpressions.TeamInvite);
        if (teamInviteMatch) {
            manager.emit(types_1.RCEEvent.TeamInvite, {
                server,
                id: parseInt(teamInviteMatch[3]),
                owner: teamInviteMatch[1],
                ign: teamInviteMatch[2],
            });
        }
        // Event: Team Invite Cancel
        const teamInviteCancelMatch = message.match(regularExpressions_1.RegularExpressions.TeamInviteCancel);
        if (teamInviteCancelMatch) {
            manager.emit(types_1.RCEEvent.TeamInviteCancel, {
                server,
                id: parseInt(teamInviteCancelMatch[3]),
                owner: teamInviteCancelMatch[2],
                ign: teamInviteCancelMatch[1],
            });
        }
        // Event: Team Promoted
        const teamPromotedMatch = message.match(regularExpressions_1.RegularExpressions.TeamPromoted);
        if (teamPromotedMatch) {
            manager.emit(types_1.RCEEvent.TeamPromoted, {
                server,
                id: parseInt(teamPromotedMatch[3]),
                oldOwner: teamPromotedMatch[1],
                newOwner: teamPromotedMatch[2],
            });
        }
        // Event: Kit Spawn
        const kitSpawnMatch = message.match(regularExpressions_1.RegularExpressions.KitSpawn);
        if (kitSpawnMatch) {
            manager.emit(types_1.RCEEvent.KitSpawn, {
                server,
                admin: undefined,
                ign: kitSpawnMatch[1],
                kit: kitSpawnMatch[2],
            });
        }
        // Event: Kit Give
        const kitGiveMatch = message.match(regularExpressions_1.RegularExpressions.KitGive);
        if (kitGiveMatch) {
            manager.emit(types_1.RCEEvent.KitSpawn, {
                server,
                admin: kitGiveMatch[1],
                ign: kitGiveMatch[2],
                kit: kitGiveMatch[3],
            });
        }
        // Event: Event Start
        if (message.startsWith("[EVENT")) {
            for (const [key, options] of Object.entries(events_1.EVENTS)) {
                if (message.includes(key)) {
                    manager.emit(types_1.RCEEvent.EventStart, {
                        server,
                        event: options.name,
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
            const victimData = (0, playerKill_1.getKill)(victim);
            const killerData = (0, playerKill_1.getKill)(killer);
            manager.emit(types_1.RCEEvent.PlayerKill, {
                server,
                victim: victimData,
                killer: killerData,
            });
        }
    }
}
exports.default = ResponseHandler;
//# sourceMappingURL=responseHandler.js.map