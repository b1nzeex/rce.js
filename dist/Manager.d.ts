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
    private _plugins;
    logger: ILogger;
    events: RCEEventManager;
    servers: ServerManager;
    constructor();
    /**
     *
     * @param auth {AuthOptions} - The authentication options for the GPortal API
     * @returns {Promise<void>}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * await rce.init({
     *  username: "username",
     *  password: "password"
     * });
     * ```
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * await rce.init({
     *  username: "username",
     *  password: "password"
     * }, {
     *  level: LogLevel.Info,
     *  file: "rce.log"
     * });
     */
    init(auth: AuthOptions, logger: LoggerOptions): Promise<void>;
    /**
     * Gracefully close the RCE Manager
     * @returns {void}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * rce.destroy();
     * ```
     */
    destroy(): void;
    /**
     * Register a plugin with the RCE Manager
     * @param name {string} - The name of the plugin
     * @param instance {any} - The instance of the plugin
     * @returns {void}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * rce.registerPlugin("myPlugin", new MyPlugin());
     * ```
     */
    registerPlugin(name: string, instance: any): void;
    /**
     * Get a registered plugin
     * @param name {string} - The name of the plugin
     * @returns {any}
     *
     * @example
     * ```js
     * const rce = new RCEManager();
     * const myPlugin = rce.getPlugin("myPlugin");
     * ```
     */
    getPlugin(name: string): any;
}
export {};
