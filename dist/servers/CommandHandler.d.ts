import type { CommandRequest } from "./interfaces";
export default class CommandHandler {
    private static commands;
    static destroy(): void;
    static add(command: CommandRequest): void;
    static remove(command: CommandRequest): void;
    static get(identifier: string, command: string): CommandRequest;
    static getQueued(identifier: string, timestamp: string): CommandRequest;
}
