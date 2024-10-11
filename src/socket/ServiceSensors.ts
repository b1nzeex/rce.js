import type { RustServer } from "../servers/interfaces";
import type { WSMessage } from "./interfaces";
import { RCEEvent } from "../constants";
import type RCEManager from "../Manager";

export default class ServiceSensorHandler {
  public static handle(
    manager: RCEManager,
    message: WSMessage,
    server: RustServer
  ) {
    const { cpuTotal, memory } = message.payload.data.serviceSensors;

    manager.events.emit(RCEEvent.ServiceSensor, {
      server,
      cpuPercentage: Number(cpuTotal.toFixed(2)),
      memoryUsed: Number(memory.used),
    });
  }
}
