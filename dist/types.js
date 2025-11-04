"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.GameRole = exports.GamePlatform = exports.RCEEvent = exports.RCEIntent = void 0;
/*
  Intents - v4.6.0
*/
var RCEIntent;
(function (RCEIntent) {
    RCEIntent["ServerInfo"] = "ServerInfo";
    RCEIntent["PlayerList"] = "PlayerList";
    RCEIntent["Frequencies"] = "Frequencies";
    RCEIntent["Gibs"] = "Gibs";
    RCEIntent["Kits"] = "Kits";
    RCEIntent["CustomZones"] = "CustomZones";
    RCEIntent["Teams"] = "Teams";
    RCEIntent["RoleInfo"] = "RoleInfo";
})(RCEIntent || (exports.RCEIntent = RCEIntent = {}));
var RCEEvent;
(function (RCEEvent) {
    RCEEvent["Ready"] = "ready";
    RCEEvent["Message"] = "message";
    RCEEvent["ExecutingCommand"] = "executingCommand";
    RCEEvent["VendingMachineName"] = "vendingMachineName";
    RCEEvent["QuickChat"] = "quickChat";
    RCEEvent["PlayerSuicide"] = "playerSuicide";
    RCEEvent["PlayerRespawned"] = "playerRespawned";
    RCEEvent["CustomZoneCreated"] = "customZoneCreated";
    RCEEvent["CustomZoneRemoved"] = "customZoneRemoved";
    RCEEvent["PlayerRoleAdd"] = "playerRoleAdd";
    RCEEvent["PlayerRoleRemove"] = "playerRoleRemove";
    RCEEvent["PlayerBanned"] = "playerBanned";
    RCEEvent["PlayerUnbanned"] = "playerUnbanned";
    RCEEvent["ItemSpawn"] = "itemSpawn";
    RCEEvent["NoteEdit"] = "noteEdit";
    RCEEvent["TeamCreated"] = "teamCreated";
    RCEEvent["TeamJoin"] = "teamJoin";
    RCEEvent["TeamLeave"] = "teamLeave";
    RCEEvent["TeamInvite"] = "teamInvite";
    RCEEvent["TeamInviteCancel"] = "teamInviteCancel";
    RCEEvent["TeamPromoted"] = "teamPromoted";
    RCEEvent["KitSpawn"] = "kitSpawn";
    RCEEvent["PlayerJoined"] = "playerJoined";
    RCEEvent["PlayerLeft"] = "playerLeft";
    RCEEvent["EventStart"] = "eventStart";
    RCEEvent["PlayerKill"] = "playerKill";
    RCEEvent["PlayerListUpdated"] = "playerListUpdated";
    RCEEvent["FrequencyGained"] = "frequencyGained";
    RCEEvent["FrequencyLost"] = "frequencyLost";
    RCEEvent["ServerSaving"] = "serverSaving";
    RCEEvent["Error"] = "error";
    RCEEvent["ServerInfoUpdated"] = "serverInfoUpdate";
})(RCEEvent || (exports.RCEEvent = RCEEvent = {}));
var GamePlatform;
(function (GamePlatform) {
    GamePlatform["Playstation"] = "PS";
    GamePlatform["XBOX"] = "XBL";
})(GamePlatform || (exports.GamePlatform = GamePlatform = {}));
var GameRole;
(function (GameRole) {
    GameRole["None"] = "None";
    GameRole["VIP"] = "VIP";
    GameRole["Moderator"] = "Moderator";
    GameRole["Admin"] = "Admin";
    GameRole["Owner"] = "Owner";
})(GameRole || (exports.GameRole = GameRole = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
//# sourceMappingURL=types.js.map