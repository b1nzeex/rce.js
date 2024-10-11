import ServerManager from "./servers/Servers";
import type { AuthOptions, LoggerOptions, RCEEventTypes } from "./interfaces";
import { EventEmitter } from "events";
import { ILogger } from "./logger/interfaces";
declare class RCEEventManager extends EventEmitter {
    emit<K extends keyof RCEEventTypes>(event: K, ...args: RCEEventTypes[K] extends undefined ? [] : [RCEEventTypes[K]]): boolean;
    on<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
    once<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
    off<K extends keyof RCEEventTypes>(event: K, listener: (arg: RCEEventTypes[K]) => void): this;
}
export default class RCEManager {
    private _auth;
    private _socket;
    logger: ILogger;
    events: RCEEventManager;
    servers: ServerManager;
    constructor();
    /**
     *
     * @param auth {AuthOptions} - The authentication options for the GPortal API
     * @returns {Promise<void>}
     */
    init(auth: AuthOptions, logger: LoggerOptions): Promise<void>;
    /**
     * Gracefully close the RCE Manager
     * @returns {void}
     */
    destroy(): void;
}
export {};
