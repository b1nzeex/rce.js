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

      const logMessage =
        typeof content === "string"
          ? `[${type.toUpperCase()}]: ${content}\n`
          : `[${type.toUpperCase()}]: ${inspect(content, { depth: 5 })}\n`;

      fs.appendFileSync(this.file, logMessage);
    }
  }

  private format(content: any): string {
    return typeof content === "string"
      ? content
      : inspect(content, { depth: 5 });
  }

  private log(
    level: LogLevel,
    type: string,
    content: any,
    logType: LogType
  ): void {
    this.logToFile(type, content);

    if (this.level !== LogLevel.None && level <= this.level) {
      const date = new Date();
      const timestamp = date.toLocaleTimeString([], { hour12: false });

      const padding = " ".repeat(Math.max(0, 15 - logType.prefix.length));
      const formattedMessage = `\x1b[90m[${timestamp}]\x1b[0m ${logType.color}${logType.prefix}${padding}${logType.emoji}${ConsoleColor.Reset}`;

      console.log(formattedMessage, this.format(content));

      this.emitter.emit(RCEEvent.Log, { level, content: this.format(content) });
    }
  }

  public warn(content: any): void {
    const logType: LogType = {
      prefix: "[WARNING]",
      emoji: "⚠️ ",
      color: ConsoleColor.FgYellow,
    };
    this.log(LogLevel.Warn, "warn", content, logType);
  }

  public info(content: any): void {
    const logType: LogType = {
      prefix: "[INFO]",
      emoji: "💬",
      color: ConsoleColor.FgCyan,
    };
    this.log(LogLevel.Info, "info", content, logType);
  }

  public debug(content: any): void {
    const logType: LogType = {
      prefix: "[DEBUG]",
      emoji: "🔧",
      color: ConsoleColor.FgMagenta,
    };
    this.log(LogLevel.Debug, "debug", content, logType);
  }

  public error(content: any): void {
    const logType: LogType = {
      prefix: "[ERROR]",
      emoji: "❌",
      color: ConsoleColor.FgRed,
    };
    this.log(LogLevel.Error, "error", content, logType);
  }
}
