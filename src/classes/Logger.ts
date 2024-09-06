import { LogLevel, RCEEvent } from "../constants";
import { inspect } from "util";
import { type LoggerOptions } from "../types";
import fs from "fs";
import RCEManager from "./RCEManager";

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
  private emitter: RCEManager;
  private level: LogLevel;
  private file;

  public constructor(emitter: RCEManager, opts: LoggerOptions) {
    this.level = opts.logLevel || LogLevel.Info;
    this.file = opts.logFile;
    this.emitter = emitter;
  }

  private logToFile(type: string, content: any) {
    if (this.file) {
      const stats = fs.statSync(this.file);
      if (stats.size > 300000000) {
        fs.writeFileSync(this.file, "");
      }

      if (typeof content === "string") {
        fs.appendFileSync(this.file, `[${type}]: ` + content + "\n");
      } else {
        fs.appendFileSync(
          this.file,
          `[${type}]: ${inspect(content, { depth: 5 }) + "\n"}`
        );
      }
    }
  }

  private format(content: any) {
    return typeof content === "string"
      ? content
      : inspect(content, { depth: 5 });
  }

  public error(content: any) {
    this.logToFile("ERROR", content);
    this.emitter.emit(RCEEvent.Log, {
      level: LogLevel.Error,
      content: this.format(content),
    });

    if (this.level >= LogLevel.Error) {
      console.log(
        `[rce.js] ${ConsoleColor.FgRed}[ERROR]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }

  public warn(content: any) {
    this.logToFile("WARN", content);
    this.emitter.emit(RCEEvent.Log, {
      level: LogLevel.Warn,
      content: this.format(content),
    });

    if (this.level >= LogLevel.Warn) {
      console.log(
        `[rce.js] ${ConsoleColor.FgYellow}[WARN]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }

  public info(content: any) {
    this.logToFile("INFO", content);
    this.emitter.emit(RCEEvent.Log, {
      level: LogLevel.Info,
      content: this.format(content),
    });

    if (this.level >= LogLevel.Info) {
      console.log(
        `[rce.js] ${ConsoleColor.FgCyan}[INFO]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }

  public debug(content: any) {
    this.logToFile("DEBUG", content);
    this.emitter.emit(RCEEvent.Log, {
      level: LogLevel.Debug,
      content: this.format(content),
    });

    if (this.level >= LogLevel.Debug) {
      console.log(
        `[rce.js] ${ConsoleColor.FgGreen}[DEBUG]${
          ConsoleColor.Reset
        } ${this.format(content)}`
      );
    }
  }
}
