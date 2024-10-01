"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
var ConsoleColor;
(function (ConsoleColor) {
    ConsoleColor["Reset"] = "\u001B[0m";
    ConsoleColor["FgRed"] = "\u001B[31m";
    ConsoleColor["FgGreen"] = "\u001B[32m";
    ConsoleColor["FgYellow"] = "\u001B[33m";
    ConsoleColor["FgCyan"] = "\u001B[36m";
    ConsoleColor["FgMagenta"] = "\u001B[35m";
})(ConsoleColor || (ConsoleColor = {}));
class Logger {
    emitter;
    level;
    file;
    constructor(emitter, opts) {
        this.level = opts.logLevel ?? constants_1.LogLevel.Info;
        this.file = opts.logFile;
        this.emitter = emitter;
    }
    logToFile(type, content) {
        if (this.file) {
            const stats = fs_1.default.statSync(this.file);
            if (stats.size > 300000000) {
                fs_1.default.writeFileSync(this.file, "");
            }
            const logMessage = typeof content === "string"
                ? `[${type.toUpperCase()}]: ${content}\n`
                : `[${type.toUpperCase()}]: ${(0, util_1.inspect)(content, { depth: 5 })}\n`;
            fs_1.default.appendFileSync(this.file, logMessage);
        }
    }
    format(content) {
        return typeof content === "string"
            ? content
            : (0, util_1.inspect)(content, { depth: 5 });
    }
    log(level, type, content, logType) {
        this.logToFile(type, content);
        if (this.level !== constants_1.LogLevel.None && level <= this.level) {
            const date = new Date();
            const timestamp = date.toLocaleTimeString([], { hour12: false });
            const padding = " ".repeat(Math.max(0, 15 - logType.prefix.length));
            const formattedMessage = `\x1b[90m[${timestamp}]\x1b[0m ${logType.color}${logType.prefix}${padding}${logType.emoji}${ConsoleColor.Reset}`;
            console.log(formattedMessage, this.format(content));
            this.emitter.emit(constants_1.RCEEvent.Log, { level, content: this.format(content) });
        }
    }
    warn(content) {
        const logType = {
            prefix: "[WARNING]",
            emoji: "⚠️ ",
            color: ConsoleColor.FgYellow,
        };
        this.log(constants_1.LogLevel.Warn, "warn", content, logType);
    }
    info(content) {
        const logType = {
            prefix: "[INFO]",
            emoji: "💬",
            color: ConsoleColor.FgCyan,
        };
        this.log(constants_1.LogLevel.Info, "info", content, logType);
    }
    debug(content) {
        const logType = {
            prefix: "[DEBUG]",
            emoji: "🔧",
            color: ConsoleColor.FgMagenta,
        };
        this.log(constants_1.LogLevel.Debug, "debug", content, logType);
    }
    error(content) {
        const logType = {
            prefix: "[ERROR]",
            emoji: "❌",
            color: ConsoleColor.FgRed,
        };
        this.log(constants_1.LogLevel.Error, "error", content, logType);
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map