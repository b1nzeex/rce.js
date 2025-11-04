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
            const player = manager.upsertPlayer(server.identifier, vendingMachineNameMatch[1], undefined, false);
            manager.emit(types_1.RCEEvent.VendingMachineName, {
                server,
                player,
                oldName: vendingMachineNameMatch[2],
                newName: vendingMachineNameMatch[3],
            });
        }
        // Event: Quick Chat
        const quickChatMatch = message.match(regularExpressions_1.RegularExpressions.QuickChat);
        if (quickChatMatch) {
            const player = manager.upsertPlayer(server.identifier, quickChatMatch[3], undefined, true);
            manager.emit(types_1.RCEEvent.QuickChat, {
                server,
                type: quickChatMatch[2],
                player,
                message: quickChatMatch[4],
            });
        }
        // Event: Player Suicide
        if (message.includes("was suicide by Suicide")) {
            const ign = message.split(" was suicide by Suicide")[0];
            const player = manager.upsertPlayer(server.identifier, ign, undefined, true);
            manager.emit(types_1.RCEEvent.PlayerSuicide, {
                server,
                player,
            });
        }
        // Event: Player Respawned
        if (message.includes("has entered the game")) {
            const ign = message.split(" [")[0];
            const platform = message.includes("[SCARLETT]")
                ? types_1.GamePlatform.XBOX
                : types_1.GamePlatform.Playstation;
            // Create or get player and update platform
            const player = manager.upsertPlayer(server.identifier, ign, {
                platform,
            }, true);
            manager.emit(types_1.RCEEvent.PlayerRespawned, {
                server,
                player,
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
        // Event: Player Role Add / Player Banned
        if (message.includes("Added")) {
            const playerRoleAddMatch = message.match(regularExpressions_1.RegularExpressions.PlayerRoleAdd);
            if (playerRoleAddMatch) {
                const admin = manager.upsertPlayer(server.identifier, playerRoleAddMatch[1], undefined, false);
                const player = manager.upsertPlayer(server.identifier, playerRoleAddMatch[2], undefined, false);
                manager.emit(types_1.RCEEvent.PlayerRoleAdd, {
                    server,
                    admin: playerRoleAddMatch[1] === "SERVER" ? undefined : admin,
                    player,
                    role: playerRoleAddMatch[3],
                });
            }
            const playerBannedMatch = message.match(regularExpressions_1.RegularExpressions.PlayerBanned);
            if (playerBannedMatch) {
                const admin = manager.upsertPlayer(server.identifier, playerBannedMatch[1], undefined, false);
                const player = manager.upsertPlayer(server.identifier, playerBannedMatch[2], undefined, false);
                manager.emit(types_1.RCEEvent.PlayerBanned, {
                    server,
                    admin: playerBannedMatch[1] === "SERVER" ? undefined : admin,
                    player,
                });
            }
        }
        // Event: Player Role Remove / Player Unbanned
        if (message.includes("Removed")) {
            const playerRoleRemoveMatch = message.match(regularExpressions_1.RegularExpressions.PlayerRoleRemove);
            if (playerRoleRemoveMatch) {
                const admin = manager.upsertPlayer(server.identifier, playerRoleRemoveMatch[1], undefined, false);
                const player = manager.upsertPlayer(server.identifier, playerRoleRemoveMatch[2], undefined, false);
                manager.emit(types_1.RCEEvent.PlayerRoleRemove, {
                    server,
                    admin: playerRoleRemoveMatch[1] === "SERVER" ? undefined : admin,
                    player,
                    role: playerRoleRemoveMatch[3],
                });
            }
            const playerUnbannedMatch = message.match(regularExpressions_1.RegularExpressions.PlayerUnbanned);
            if (playerUnbannedMatch) {
                const admin = manager.upsertPlayer(server.identifier, playerUnbannedMatch[1], undefined, false);
                const player = manager.upsertPlayer(server.identifier, playerUnbannedMatch[2], undefined, false);
                manager.emit(types_1.RCEEvent.PlayerUnbanned, {
                    server,
                    admin: playerUnbannedMatch[1] === "SERVER" ? undefined : admin,
                    player,
                });
            }
        }
        // Event: Item Spawn
        const itemSpawnMatch = message.match(regularExpressions_1.RegularExpressions.ItemSpawn);
        if (itemSpawnMatch) {
            const player = manager.upsertPlayer(server.identifier, itemSpawnMatch[1], undefined, true);
            manager.emit(types_1.RCEEvent.ItemSpawn, {
                server,
                player,
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
                const player = manager.upsertPlayer(server.identifier, noteEditMatch[1], undefined, true);
                manager.emit(types_1.RCEEvent.NoteEdit, {
                    server,
                    player,
                    oldContent,
                    newContent,
                });
            }
        }
        // Event: Team Create
        const teamCreateMatch = message.match(regularExpressions_1.RegularExpressions.TeamCreate);
        if (teamCreateMatch) {
            const teamId = parseInt(teamCreateMatch[2]);
            const owner = teamCreateMatch[1];
            // Create or get player and add team to teams list
            const serverData = manager.getServer(server.identifier);
            let leaderPlayer;
            if (serverData) {
                const team = {
                    id: teamId,
                    leader: null,
                    members: [],
                };
                leaderPlayer = manager.upsertPlayer(server.identifier, owner, {
                    team,
                }, true);
                team.leader = leaderPlayer;
                team.members = [leaderPlayer];
                serverData.teams.push(team);
                manager.updateServer(serverData);
            }
            else {
                leaderPlayer = manager.upsertPlayer(server.identifier, owner, undefined, true);
            }
            manager.emit(types_1.RCEEvent.TeamCreated, {
                server,
                team: serverData?.teams.find((t) => t.id === teamId) || {
                    id: teamId,
                    leader: leaderPlayer,
                    members: [leaderPlayer],
                },
            });
        }
        // Event: Team Join
        const teamJoinMatch = message.match(regularExpressions_1.RegularExpressions.TeamJoin);
        if (teamJoinMatch) {
            const teamId = parseInt(teamJoinMatch[3]);
            const ign = teamJoinMatch[1];
            const serverData = manager.getServer(server.identifier);
            let joiningPlayer;
            if (serverData) {
                const team = serverData.teams.find((t) => t.id === teamId);
                if (team && !team.members.some((member) => member.ign === ign)) {
                    joiningPlayer = manager.upsertPlayer(server.identifier, ign, {
                        team,
                    }, true);
                    team.members.push(joiningPlayer);
                    manager.updateServer(serverData);
                }
                else {
                    joiningPlayer = manager.upsertPlayer(server.identifier, ign, undefined, true);
                }
            }
            else {
                joiningPlayer = manager.upsertPlayer(server.identifier, ign, undefined, true);
            }
            const team = serverData?.teams.find((t) => t.id === teamId);
            manager.emit(types_1.RCEEvent.TeamJoin, {
                server,
                team: team || {
                    id: teamId,
                    leader: joiningPlayer,
                    members: [joiningPlayer],
                },
                player: joiningPlayer,
            });
        }
        // Event: Team Leave
        const teamLeaveMatch = message.match(regularExpressions_1.RegularExpressions.TeamLeave);
        if (teamLeaveMatch) {
            const ign = teamLeaveMatch[1];
            const teamId = parseInt(teamLeaveMatch[3]);
            const serverData = manager.getServer(server.identifier);
            if (serverData) {
                const team = serverData.teams.find((t) => t.id === teamId);
                if (team) {
                    team.members = team.members.filter((member) => member.ign !== ign);
                    manager.upsertPlayer(server.identifier, ign, { team: null }, true);
                    if (team.members.length === 0) {
                        serverData.teams = serverData.teams.filter((t) => t.id !== teamId);
                    }
                    manager.updateServer(serverData);
                }
            }
            const leavingPlayer = manager.upsertPlayer(server.identifier, ign, {
                team: null,
            }, true);
            const team = serverData?.teams.find((t) => t.id === teamId);
            manager.emit(types_1.RCEEvent.TeamLeave, {
                server,
                team: team || {
                    id: teamId,
                    leader: leavingPlayer,
                    members: [],
                },
                player: leavingPlayer,
            });
        }
        // Event: Team Invite
        const teamInviteMatch = message.match(regularExpressions_1.RegularExpressions.TeamInvite);
        if (teamInviteMatch) {
            const teamId = parseInt(teamInviteMatch[3]);
            const player = manager.upsertPlayer(server.identifier, teamInviteMatch[2], undefined, true);
            const serverData = manager.getServer(server.identifier);
            const team = serverData?.teams.find((t) => t.id === teamId);
            manager.emit(types_1.RCEEvent.TeamInvite, {
                server,
                team: team || {
                    id: teamId,
                    leader: player,
                    members: [],
                },
                player,
            });
        }
        // Event: Team Invite Cancel
        const teamInviteCancelMatch = message.match(regularExpressions_1.RegularExpressions.TeamInviteCancel);
        if (teamInviteCancelMatch) {
            const teamId = parseInt(teamInviteMatch[3]);
            const player = manager.upsertPlayer(server.identifier, teamInviteCancelMatch[1], undefined, false);
            const serverData = manager.getServer(server.identifier);
            const team = serverData?.teams.find((t) => t.id === teamId);
            manager.emit(types_1.RCEEvent.TeamInviteCancel, {
                server,
                team: team || {
                    id: teamId,
                    leader: player,
                    members: [],
                },
                player,
            });
        }
        // Event: Team Promoted
        const teamPromotedMatch = message.match(regularExpressions_1.RegularExpressions.TeamPromoted);
        if (teamPromotedMatch) {
            const teamId = parseInt(teamPromotedMatch[3]);
            const oldOwner = teamPromotedMatch[1];
            const newOwner = teamPromotedMatch[2];
            const serverData = manager.getServer(server.identifier);
            if (serverData) {
                const team = serverData.teams.find((t) => t.id === teamId);
                if (team) {
                    team.leader = manager.upsertPlayer(server.identifier, newOwner, {
                        team,
                    }, false);
                    manager.updateServer(serverData);
                }
            }
            const oldOwnerPlayer = manager.upsertPlayer(server.identifier, oldOwner, undefined, true);
            const newOwnerPlayer = manager.upsertPlayer(server.identifier, newOwner, undefined, false);
            const team = serverData?.teams.find((t) => t.id === teamId);
            manager.emit(types_1.RCEEvent.TeamPromoted, {
                server,
                team: team || {
                    id: teamId,
                    leader: newOwnerPlayer,
                    members: [],
                },
                oldOwner: oldOwnerPlayer,
                newOwner: newOwnerPlayer,
            });
        }
        // Event: Kit Spawn
        const kitSpawnMatch = message.match(regularExpressions_1.RegularExpressions.KitSpawn);
        if (kitSpawnMatch) {
            const player = manager.upsertPlayer(server.identifier, kitSpawnMatch[1], undefined, true);
            manager.emit(types_1.RCEEvent.KitSpawn, {
                server,
                admin: undefined,
                player,
                kit: kitSpawnMatch[2],
            });
        }
        // Event: Kit Give
        const kitGiveMatch = message.match(regularExpressions_1.RegularExpressions.KitGive);
        if (kitGiveMatch) {
            const player = manager.upsertPlayer(server.identifier, kitGiveMatch[2], undefined, true);
            const admin = manager.upsertPlayer(server.identifier, kitGiveMatch[1], undefined, false);
            manager.emit(types_1.RCEEvent.KitSpawn, {
                server,
                admin,
                player,
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
            if (victimData.type === playerKill_1.PlayerKillType.Player) {
                victimData.player = manager.upsertPlayer(server.identifier, victimData.name, undefined, false);
            }
            if (killerData.type === playerKill_1.PlayerKillType.Player) {
                killerData.player = manager.upsertPlayer(server.identifier, killerData.name, undefined, true);
            }
            manager.emit(types_1.RCEEvent.PlayerKill, {
                server,
                victim: victimData,
                killer: killerData,
            });
        }
        // Event: Server Saving
        if (message.startsWith("[ SAVE ]")) {
            const serverSavingMatch = message.match(regularExpressions_1.RegularExpressions.ServerSaving);
            if (serverSavingMatch) {
                manager.emit(types_1.RCEEvent.ServerSaving, {
                    server,
                    entities: parseInt(serverSavingMatch[1]),
                });
            }
        }
    }
}
exports.default = ResponseHandler;
//# sourceMappingURL=responseHandler.js.map