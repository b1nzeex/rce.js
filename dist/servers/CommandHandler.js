"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandHandler {
    static commands = new Map();
    static destroy() {
        this.commands.clear();
    }
    static add(command) {
        this.commands.set(`${command.identifier}:${command.command}`, command);
    }
    static remove(command) {
        if (command) {
            this.commands.delete(`${command.identifier}:${command.command}`);
        }
    }
    static get(identifier, command) {
        return this.commands.get(`${identifier}:${command}`);
    }
    static getQueued(identifier, timestamp) {
        return Array.from(this.commands.values()).find((command) => command.identifier === identifier && command.timestamp === timestamp);
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map