"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const ServerUtils_1 = __importDefault(require("../util/ServerUtils"));
class ServiceStateHandler {
    static handle(manager, message, server) {
        const status = message.payload.data.serviceState
            .state;
        if (server.status === status)
            return;
        server.status = status;
        if (status === "RUNNING" && !server.flags.includes("READY")) {
            ServerUtils_1.default.setReady(manager, server, true);
        }
        else if (status === "STOPPED" && server.flags.includes("READY")) {
            ServerUtils_1.default.setReady(manager, server, false);
        }
        manager.events.emit(constants_1.RCEEvent.ServiceStatus, { server, status });
        if (status === "SUSPENDED") {
            manager.logger.warn(`[${server.identifier}] Server Suspended - Removing`);
            manager.servers.remove(server);
        }
    }
}
exports.default = ServiceStateHandler;
//# sourceMappingURL=ServiceState.js.map