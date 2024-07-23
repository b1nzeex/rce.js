"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RCEEvent = exports.LogLevel = exports.GPORTALWebsocketTypes = exports.GPORTALRoutes = void 0;
var GPORTALRoutes;
(function (GPORTALRoutes) {
    GPORTALRoutes["COMMAND"] = "https://www.g-portal.com/ngpapi/";
    GPORTALRoutes["REFRESH"] = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/token";
    GPORTALRoutes["WEBSOCKET"] = "wss://www.g-portal.com/ngpapi/";
    GPORTALRoutes["ORIGIN"] = "https://www.g-portal.com";
    GPORTALRoutes["HOME"] = "https://www.g-portal.com/en";
})(GPORTALRoutes || (exports.GPORTALRoutes = GPORTALRoutes = {}));
var GPORTALWebsocketTypes;
(function (GPORTALWebsocketTypes) {
    GPORTALWebsocketTypes["INIT"] = "connection_init";
    GPORTALWebsocketTypes["START"] = "start";
})(GPORTALWebsocketTypes || (exports.GPORTALWebsocketTypes = GPORTALWebsocketTypes = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var RCEEvent;
(function (RCEEvent) {
    RCEEvent["CONNECTED"] = "connected";
    RCEEvent["MESSAGE"] = "message";
    RCEEvent["PLAYER_KILL"] = "player_kill";
    RCEEvent["PLAYER_JOINED"] = "player_joined";
    RCEEvent["PLAYER_ROLE_ADD"] = "player_role_add";
    RCEEvent["QUICK_CHAT"] = "quick_chat";
    RCEEvent["NOTE_EDIT"] = "note_edit";
    RCEEvent["EVENT_START"] = "event_start";
})(RCEEvent || (exports.RCEEvent = RCEEvent = {}));
//# sourceMappingURL=constants.js.map