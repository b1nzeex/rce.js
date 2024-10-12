import { LogLevel } from "../constants";
import type { ILogger } from "./interfaces";
export default class RCELogger implements ILogger {
    private logLevel;
    private file?;
    constructor(logLevel: LogLevel, file?: string);
    private format;
    private logToFile;
    private log;
    debug(message: string): void;
    error(message: string): void;
    info(message: string): void;
    warn(message: string): void;
}
