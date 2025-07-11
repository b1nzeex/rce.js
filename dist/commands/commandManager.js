"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandManager {
    static _commands = new Map();
    static add(command) {
        this._commands.set(`${command.identifier}:${command.uniqueId}`, command);
    }
    static remove(command) {
        this._commands.delete(`${command.identifier}:${command.uniqueId}`);
    }
    static get(identifier, uniqueId) {
        return this._commands.get(`${identifier}:${uniqueId}`);
    }
}
exports.default = CommandManager;
//# sourceMappingURL=commandManager.js.map