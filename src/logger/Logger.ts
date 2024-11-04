import { LogLevel } from "../constants";
import type { ILogger, LogType } from "./interfaces";
import { inspect } from "util";
import { stat, appendFile, writeFile } from "fs";

enum ConsoleColor {
  Reset = "\x1b[0m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgCyan = "\x1b[36m",
}

export default class RCELogger implements ILogger {
  private logLevel: LogLevel = LogLevel.Info;
  private file?: string;

  constructor(logLevel: LogLevel = LogLevel.Info, file?: string) {
    this.logLevel = logLevel;
    this.file = file;
  }

  private format(content: any): string {
    return typeof content === "string"
      ? content
      : inspect(content, { depth: 5 });
  }

  private logToFile(type: string, message: string) {
    if (this.file) {
      stat(this.file, (err, stats) => {
        if (err) {
          writeFile(this.file, "", (err) => {
            if (err) {
              this.warn(`Failed To Create Log File: ${err.message}`);
            }
          });
        }

        if (stats.size > 300 * 1024 * 1024) {
          writeFile(this.file, "", (err) => {
            if (err) {
              this.warn(`Failed To Clear Log File: ${err.message}`);
            }
          });
        }

        const log =
          typeof message === "string"
            ? `[${type.toUpperCase()}]: ${message}\n`
            : `[${type.toUpperCase()}]: ${inspect(message, { depth: 5 })}\n`;

        appendFile(this.file, log, (err) => {
          if (err) {
            this.warn(`Failed To Write To Log File: ${err.message}`);
          }
        });
      });
    }
  }

  private log(level: LogLevel, logType: LogType, message: string) {
    this.logToFile(logType.prefix, message);

    if (this.logLevel !== LogLevel.None && level <= this.logLevel) {
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
  debug(message: string) {
    const logType: LogType = {
      prefix: "[DEBUG]",
      emoji: "🔧",
      color: ConsoleColor.FgGreen,
    };

    this.log(LogLevel.Debug, logType, message);
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
  error(message: string) {
    const logType: LogType = {
      prefix: "[ERROR]",
      emoji: "❌",
      color: ConsoleColor.FgRed,
    };

    this.log(LogLevel.Error, logType, message);
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
  info(message: string) {
    const logType: LogType = {
      prefix: "[INFO]",
      emoji: "💬",
      color: ConsoleColor.FgCyan,
    };

    this.log(LogLevel.Info, logType, message);
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
  warn(message: string) {
    const logType: LogType = {
      prefix: "[WARNING]",
      emoji: "⚠️ ",
      color: ConsoleColor.FgYellow,
    };

    this.log(LogLevel.Warn, logType, message);
  }
}
