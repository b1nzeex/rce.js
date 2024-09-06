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
    ConsoleColor["Bright"] = "\u001B[1m";
    ConsoleColor["Dim"] = "\u001B[2m";
    ConsoleColor["Underscore"] = "\u001B[4m";
    ConsoleColor["Blink"] = "\u001B[5m";
    ConsoleColor["Reverse"] = "\u001B[7m";
    ConsoleColor["Hidden"] = "\u001B[8m";
    ConsoleColor["FgBlack"] = "\u001B[30m";
    ConsoleColor["FgRed"] = "\u001B[31m";
    ConsoleColor["FgGreen"] = "\u001B[32m";
    ConsoleColor["FgYellow"] = "\u001B[33m";
    ConsoleColor["FgBlue"] = "\u001B[34m";
    ConsoleColor["FgMagenta"] = "\u001B[35m";
    ConsoleColor["FgCyan"] = "\u001B[36m";
    ConsoleColor["FgWhite"] = "\u001B[37m";
    ConsoleColor["BgBlack"] = "\u001B[40m";
    ConsoleColor["BgRed"] = "\u001B[41m";
    ConsoleColor["BgGreen"] = "\u001B[42m";
    ConsoleColor["BgYellow"] = "\u001B[43m";
    ConsoleColor["BgBlue"] = "\u001B[44m";
    ConsoleColor["BgMagenta"] = "\u001B[45m";
    ConsoleColor["BgCyan"] = "\u001B[46m";
    ConsoleColor["BgWhite"] = "\u001B[47m";
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
            if (typeof content === "string") {
                fs_1.default.appendFileSync(this.file, `[${type}]: ` + content + "\n");
            }
            else {
                fs_1.default.appendFileSync(this.file, `[${type}]: ${(0, util_1.inspect)(content, { depth: 5 }) + "\n"}`);
            }
        }
    }
    format(content) {
        return typeof content === "string"
            ? content
            : (0, util_1.inspect)(content, { depth: 5 });
    }
    error(content) {
        this.logToFile("ERROR", content);
        this.emitter.emit(constants_1.RCEEvent.Log, {
            level: constants_1.LogLevel.Error,
            content: this.format(content),
        });
        if (this.level >= constants_1.LogLevel.Error) {
            console.log(`[rce.js] ${ConsoleColor.FgRed}[ERROR]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
    warn(content) {
        this.logToFile("WARN", content);
        this.emitter.emit(constants_1.RCEEvent.Log, {
            level: constants_1.LogLevel.Warn,
            content: this.format(content),
        });
        if (this.level >= constants_1.LogLevel.Warn) {
            console.log(`[rce.js] ${ConsoleColor.FgYellow}[WARN]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
    info(content) {
        this.logToFile("INFO", content);
        this.emitter.emit(constants_1.RCEEvent.Log, {
            level: constants_1.LogLevel.Info,
            content: this.format(content),
        });
        if (this.level >= constants_1.LogLevel.Info) {
            console.log(`[rce.js] ${ConsoleColor.FgCyan}[INFO]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
    debug(content) {
        this.logToFile("DEBUG", content);
        this.emitter.emit(constants_1.RCEEvent.Log, {
            level: constants_1.LogLevel.Debug,
            content: this.format(content),
        });
        if (this.level >= constants_1.LogLevel.Debug) {
            console.log(`[rce.js] ${ConsoleColor.FgGreen}[DEBUG]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map