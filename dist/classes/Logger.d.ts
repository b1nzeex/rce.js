import { type LoggerOptions } from "../types";
import RCEManager from "./RCEManager";
export default class Logger {
    private emitter;
    private level;
    private file;
    constructor(emitter: RCEManager, opts: LoggerOptions);
    private logToFile;
    private format;
    error(content: any): boolean;
    warn(content: any): boolean;
    info(content: any): boolean;
    debug(content: any): boolean;
}
