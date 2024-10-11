import type { RustServer } from "../servers/interfaces";
import type { WSMessage } from "./interfaces";
import type RCEManager from "../Manager";
export default class ConsoleMessagesHandler {
    static handle(manager: RCEManager, message: WSMessage, server: RustServer): void;
    private static getKill;
}
