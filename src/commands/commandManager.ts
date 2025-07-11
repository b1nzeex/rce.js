import type { ICommandRequest } from "../types";

export default class CommandManager {
  private static _commands: Map<string, ICommandRequest> = new Map();

  public static add(command: ICommandRequest) {
    this._commands.set(`${command.identifier}:${command.uniqueId}`, command);
  }

  public static remove(command: ICommandRequest) {
    this._commands.delete(`${command.identifier}:${command.uniqueId}`);
  }

  public static get(identifier: string, uniqueId?: number) {
    return this._commands.get(`${identifier}:${uniqueId}`);
  }
}
