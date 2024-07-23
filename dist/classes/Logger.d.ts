import { LogLevel } from "../constants";
export default class Logger {
    private level;
    constructor(level?: LogLevel);
    private format;
    error(content: any): void;
    warn(content: any): void;
    info(content: any): void;
    debug(content: any): void;
}
