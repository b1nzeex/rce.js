"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RCEEvents = exports.KillPlayerType = void 0;
const constants_1 = require("./constants");
const events_1 = require("events");
var KillPlayerType;
(function (KillPlayerType) {
    KillPlayerType["Player"] = "player";
    KillPlayerType["Npc"] = "npc";
    KillPlayerType["Entity"] = "entity";
    KillPlayerType["Natural"] = "natural";
})(KillPlayerType || (exports.KillPlayerType = KillPlayerType = {}));
class RCEEvents extends events_1.EventEmitter {
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    off(event, listener) {
        return super.off(event, listener);
    }
}
exports.RCEEvents = RCEEvents;
//# sourceMappingURL=types.js.map