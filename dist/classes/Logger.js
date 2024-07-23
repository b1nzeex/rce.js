"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const util_1 = require("util");
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
    level;
    constructor(level = constants_1.LogLevel.INFO) {
        this.level = level;
    }
    format(content) {
        return typeof content === "string"
            ? content
            : (0, util_1.inspect)(content, { depth: 5 });
    }
    error(content) {
        if (this.level >= constants_1.LogLevel.ERROR) {
            console.log(`[rce.js] ${ConsoleColor.FgRed}[ERROR]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
    warn(content) {
        if (this.level >= constants_1.LogLevel.WARN) {
            console.log(`[rce.js] ${ConsoleColor.FgYellow}[WARN]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
    info(content) {
        if (this.level >= constants_1.LogLevel.INFO) {
            console.log(`[rce.js] ${ConsoleColor.FgCyan}[INFO]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
    debug(content) {
        if (this.level >= constants_1.LogLevel.DEBUG) {
            console.log(`[rce.js] ${ConsoleColor.FgGreen}[DEBUG]${ConsoleColor.Reset} ${this.format(content)}`);
        }
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map