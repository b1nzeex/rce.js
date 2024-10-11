import type { RustServer } from "../servers/interfaces";
import type { WSMessage } from "./interfaces";
import { RCEEvent } from "../constants";
import type RCEManager from "../Manager";
import ServerUtils from "../util/ServerUtils";

export default class ServiceStateHandler {
  public static handle(
    manager: RCEManager,
    message: WSMessage,
    server: RustServer
  ) {
    const status = message.payload.data.serviceState
      .state as RustServer["status"];
    if (server.status === status) return;

    server.status = status;

    if (status === "RUNNING" && !server.flags.includes("READY")) {
      ServerUtils.setReady(manager, server, true);
    } else if (status === "STOPPED" && server.flags.includes("READY")) {
      ServerUtils.setReady(manager, server, false);
    }

    manager.events.emit(RCEEvent.ServiceStatus, { server, status });
    if (status === "SUSPENDED") {
      manager.logger.warn(`[${server.identifier}] Server Suspended - Removing`);
      manager.servers.remove(server);
    }
  }
}
