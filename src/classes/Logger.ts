import { LogLevel, RCEEvent } from "../constants";
import { inspect } from "util";
import { type LoggerOptions } from "../types";
import fs from "fs";
import RCEManager from "./RCEManager";

enum ConsoleColor {
  Reset = "\x1b[0m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgCyan = "\x1b[36m",
  FgMagenta = "\x1b[35m",
}

interface LogType {
  prefix: string;
  emoji: string;
  color: string;
}

export default class Logger {
  private emitter: RCEManager;
  private level: LogLevel;
  private file: string | undefined;

  public constructor(emitter: RCEManager, opts: LoggerOptions) {
    this.level = opts.logLevel ?? LogLevel.Info;
    this.file = opts.logFile;
    this.emitter = emitter;
  }

  private logToFile(type: string, content: any): void {
    if (this.file) {
      const stats = fs.statSync(this.file);
      if (stats.size > 300000000) {
        fs.writeFileSync(this.file, "");
      }

      const logMessage = typeof content === "string"
        ? `[${type.toUpperCase()}]: ${content}\n`
        : `[${type.toUpperCase()}]: ${inspect(content, { depth: 5 })}\n`;

      fs.appendFileSync(this.file, logMessage);
    }
  }

  private format(content: any): string {
    return typeof content === "string" ? content : inspect(content, { depth: 5 });
  }

  public log(type: "success" | "error" | "warn" | "info" | "debug" | string = "info", ...args: any[]): void {
    const date = new Date();
    const timestamp = date.toLocaleTimeString([], { hour12: false });

    const logTypes: Record<string, LogType> = {
      success: { prefix: "[SUCCESS]", emoji: "✅", color: ConsoleColor.FgGreen },
      error: { prefix: "[ERROR]", emoji: "❌", color: ConsoleColor.FgRed },
      warn: { prefix: "[WARNING]", emoji: "⚠️", color: ConsoleColor.FgYellow },
      info: { prefix: "[INFO]", emoji: "💬", color: ConsoleColor.FgCyan },
      debug: { prefix: "[DEBUG]", emoji: "🔧", color: ConsoleColor.FgMagenta },
    };

    const logType = logTypes[type] || { prefix: `[${type.toUpperCase()}]`, emoji: "🔧", color: ConsoleColor.FgMagenta };
    const padding = ' '.repeat(Math.max(0, 15 - logType.prefix.length));
    const formattedMessage = `\x1b[90m[${timestamp}]\x1b[0m ${logType.color}${logType.prefix}${padding}${logType.emoji}${ConsoleColor.Reset}`;

    // Output to console
    console.log(formattedMessage, ...args);

    // Log to file and emit events
    this.logToFile(type, args.length === 1 ? args[0] : args);
    this.emitter.emit(RCEEvent.Log, { level: this.getLogLevel(type), content: this.format(args.length === 1 ? args[0] : args) });
  }

  private getLogLevel(type: string): LogLevel {
    switch (type) {
      case "success":
      case "info":
        return LogLevel.Info;
      case "warn":
        return LogLevel.Warn;
      case "error":
        return LogLevel.Error;
      case "debug":
        return LogLevel.Debug;
      default:
        return LogLevel.Info;
    }
  }

  public warn(content: any): void {
    this.log("warn", content);
  }

  public info(content: any): void {
    this.log("info", content);
  }

  public debug(content: any): void {
    this.log("debug", content);
  }

  public error(content: any): void {
    this.log("error", content);
  }
}
