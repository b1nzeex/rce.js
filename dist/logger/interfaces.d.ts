import { LogLevel } from "../constants";
export interface ILogger {
    error: (message: string) => void;
    warn: (message: string) => void;
    info: (message: string) => void;
    debug: (message: string) => void;
    updateLogLevel: (level: LogLevel) => void;
}
export interface LogType {
    prefix: string;
    emoji: string;
    color: string;
}
