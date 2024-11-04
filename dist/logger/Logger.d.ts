import { LogLevel } from "../constants";
import type { ILogger } from "./interfaces";
export default class RCELogger implements ILogger {
    private logLevel;
    private file?;
    constructor(logLevel?: LogLevel, file?: string);
    private format;
    private logToFile;
    private log;
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
    debug(message: string): void;
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
    error(message: string): void;
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
    info(message: string): void;
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
    warn(message: string): void;
}
