import { type LoggerOptions } from "../types";
import RCEManager from "./RCEManager";
export default class Logger {
    private emitter;
    private level;
    private file;
    constructor(emitter: RCEManager, opts: LoggerOptions);
    private logToFile;
    private format;
    error(content: any): void;
    warn(content: any): void;
    info(content: any): void;
    debug(content: any): void;
}
