"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const util_1 = require("util");
const fs_1 = require("fs");
var ConsoleColor;
(function (ConsoleColor) {
    ConsoleColor["Reset"] = "\u001B[0m";
    ConsoleColor["FgRed"] = "\u001B[31m";
    ConsoleColor["FgGreen"] = "\u001B[32m";
    ConsoleColor["FgYellow"] = "\u001B[33m";
    ConsoleColor["FgCyan"] = "\u001B[36m";
})(ConsoleColor || (ConsoleColor = {}));
class RCELogger {
    logLevel = constants_1.LogLevel.Info;
    file;
    constructor(logLevel = constants_1.LogLevel.Info, file) {
        this.logLevel = logLevel;
        this.file = file;
    }
    format(content) {
        return typeof content === "string"
            ? content
            : (0, util_1.inspect)(content, { depth: 5 });
    }
    logToFile(type, message) {
        if (this.file) {
            (0, fs_1.stat)(this.file, (err, stats) => {
                if (err) {
                    (0, fs_1.writeFile)(this.file, "", (err) => {
                        if (err) {
                            this.warn(`Failed To Create Log File: ${err.message}`);
                        }
                    });
                }
                if (stats.size > 300 * 1024 * 1024) {
                    (0, fs_1.writeFile)(this.file, "", (err) => {
                        if (err) {
                            this.warn(`Failed To Clear Log File: ${err.message}`);
                        }
                    });
                }
                const log = typeof message === "string"
                    ? `[${type.toUpperCase()}]: ${message}\n`
                    : `[${type.toUpperCase()}]: ${(0, util_1.inspect)(message, { depth: 5 })}\n`;
                (0, fs_1.appendFile)(this.file, log, (err) => {
                    if (err) {
                        this.warn(`Failed To Write To Log File: ${err.message}`);
                    }
                });
            });
        }
    }
    log(level, logType, message) {
        this.logToFile(logType.prefix, message);
        if (this.logLevel !== constants_1.LogLevel.None && level <= this.logLevel) {
            const date = new Date();
            const timestamp = date.toLocaleTimeString([], { hour12: false });
            const padding = " ".repeat(Math.max(0, 15 - logType.prefix.length));
            const formattedMessage = `\x1b[90m[${timestamp}]\x1b[0m ${logType.color}${logType.prefix}${padding}${logType.emoji}${ConsoleColor.Reset}`;
            console.log(formattedMessage, this.format(message));
        }
    }
    /**
     *
     * @param message - The message to log
     * @description Logs a message with the [DEBUG] prefix
     *
     * @example
     * ```js
     * manager.logger.debug("Hello, World!");
     * ```
     */
    debug(message) {
        const logType = {
            prefix: "[DEBUG]",
            emoji: "🔧",
            color: ConsoleColor.FgGreen,
        };
        this.log(constants_1.LogLevel.Debug, logType, message);
    }
    /**
     *
     * @param message - The message to log
     * @description Logs a message with the [ERROR] prefix
     *
     * @example
     * ```js
     * manager.logger.error("An error occurred!");
     * ```
     */
    error(message) {
        const logType = {
            prefix: "[ERROR]",
            emoji: "❌",
            color: ConsoleColor.FgRed,
        };
        this.log(constants_1.LogLevel.Error, logType, message);
    }
    /**
     *
     * @param message - The message to log
     * @description Logs a message with the [INFO] prefix
     *
     * @example
     * ```js
     * manager.logger.info("Hello, World!");
     * ```
     */
    info(message) {
        const logType = {
            prefix: "[INFO]",
            emoji: "💬",
            color: ConsoleColor.FgCyan,
        };
        this.log(constants_1.LogLevel.Info, logType, message);
    }
    /**
     *
     * @param message - The message to log
     * @description Logs a message with the [WARNING] prefix
     *
     * @example
     * ```js
     * manager.logger.warn("This is a warning!");
     * ```
     */
    warn(message) {
        const logType = {
            prefix: "[WARNING]",
            emoji: "⚠️ ",
            color: ConsoleColor.FgYellow,
        };
        this.log(constants_1.LogLevel.Warn, logType, message);
    }
}
exports.default = RCELogger;
//# sourceMappingURL=Logger.js.map