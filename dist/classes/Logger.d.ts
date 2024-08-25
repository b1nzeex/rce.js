import { type LoggerOptions } from "../types";
export default class Logger {
    private level;
    private file;
    constructor(opts: LoggerOptions);
    private logToFile;
    private format;
    error(content: any): void;
    warn(content: any): void;
    info(content: any): void;
    debug(content: any): void;
}
