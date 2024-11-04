import GPortalAuth from "./auth/Auth";
import GPortalSocket from "./socket/Socket";
import ServerManager from "./servers/Servers";
import RCELogger from "./logger/Logger";
import type { AuthOptions, LoggerOptions, RCEEventTypes } from "./interfaces";
import { EventEmitter } from "events";
import { ILogger } from "./logger/interfaces";
import CommandHandler from "./servers/CommandHandler";
import { RCEEvent } from "./constants";

class RCEEventManager extends EventEmitter {
  emit<K extends keyof RCEEventTypes>(
    event: K,
    ...args: RCEEventTypes[K] extends undefined ? [] : [RCEEventTypes[K]]
  ): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof RCEEventTypes>(
    event: K,
    listener: (arg: RCEEventTypes[K]) => void
  ): this {
    return super.on(event, listener);
  }

  once<K extends keyof RCEEventTypes>(
    event: K,
    listener: (arg: RCEEventTypes[K]) => void
  ): this {
    return super.once(event, listener);
  }

  off<K extends keyof RCEEventTypes>(
    event: K,
    listener: (arg: RCEEventTypes[K]) => void
  ): this {
    return super.off(event, listener);
  }
}

export default class RCEManager {
  private _auth: GPortalAuth;
  private _socket: GPortalSocket;
  private _plugins: Map<string, any> = new Map();
  public logger: ILogger;
  public events: RCEEventManager = new RCEEventManager();
  public servers: ServerManager;

  public constructor() {
    this.events.on(RCEEvent.Error, (payload) => {
      if (payload.server) {
        this.logger.error(`[${payload.server.identifier}] ${payload.error}`);
      } else {
        this.logger.error(payload.error);
      }
    });
  }

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
  public async init(auth: AuthOptions, logger: LoggerOptions) {
    this.logger =
      logger?.instance || new RCELogger(logger?.level, logger?.file);

    this._auth = new GPortalAuth(this);
    await this._auth.login(auth.username, auth.password);

    this._socket = new GPortalSocket(this, this._auth);
    this._socket.connect();

    this.servers = new ServerManager(this, this._auth, this._socket);
  }

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
  public destroy() {
    this._socket.close();
    this.servers.removeAll();
    this._auth.destroy();
    CommandHandler.destroy();

    this.logger.info("RCE.JS - Closed Gracefully");
  }

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
  public registerPlugin(name: string, instance: any) {
    if (this._plugins.has(name)) {
      return this.logger.warn(`Plugin Is Already Registered: ${name}`);
    }

    this._plugins.set(name, instance);
    if (typeof instance.init === "function") {
      instance.init(this);
    }

    this.logger.info(`Plugin Registered: ${name}`);
  }

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
  public getPlugin(name: string): any {
    return this._plugins.get(name);
  }
}
