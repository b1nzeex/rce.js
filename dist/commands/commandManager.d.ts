import type { ICommandRequest } from "../types";
export default class CommandManager {
    private static _commands;
    static add(command: ICommandRequest): void;
    static remove(command: ICommandRequest): void;
    static get(identifier: string, uniqueId?: number): ICommandRequest;
}
