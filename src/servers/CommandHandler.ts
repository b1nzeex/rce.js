import type { CommandRequest } from "./interfaces";

export default class CommandHandler {
  private static commands: Map<string, CommandRequest> = new Map();

  public static destroy() {
    this.commands.clear();
  }

  public static add(command: CommandRequest) {
    this.commands.set(`${command.identifier}:${command.command}`, command);
  }

  public static remove(command: CommandRequest) {
    if (command) {
      this.commands.delete(`${command.identifier}:${command.command}`);
    }
  }

  public static get(identifier: string, command: string) {
    return this.commands.get(`${identifier}:${command}`);
  }

  public static getQueued(identifier: string, timestamp: string) {
    return Array.from(this.commands.values()).find(
      (command) =>
        command.identifier === identifier && command.timestamp === timestamp
    );
  }
}
