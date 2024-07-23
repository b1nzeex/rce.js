import { LogLevel } from "../constants";
import { inspect } from "util";

enum ConsoleColor {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}

export default class Logger {
  private level: LogLevel;

  public constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private format(content: any) {
    return typeof content === "string"
      ? content
      : inspect(content, { depth: 5 });
  }

  public error(content: any) {
    if (this.level >= LogLevel.ERROR) {
      console.log(
        `[rce.js] ${ConsoleColor.FgRed}[ERROR]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }

  public warn(content: any) {
    if (this.level >= LogLevel.WARN) {
      console.log(
        `[rce.js] ${ConsoleColor.FgYellow}[WARN]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }

  public info(content: any) {
    if (this.level >= LogLevel.INFO) {
      console.log(
        `[rce.js] ${ConsoleColor.FgCyan}[INFO]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }

  public debug(content: any) {
    if (this.level >= LogLevel.DEBUG) {
      console.log(
        `[rce.js] ${ConsoleColor.FgGreen}[DEBUG]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }
}
