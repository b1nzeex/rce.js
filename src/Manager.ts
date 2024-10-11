import GPortalAuth from "./auth/Auth";
import GPortalSocket from "./socket/Socket";
import ServerManager from "./servers/Servers";
import RCELogger from "./logger/Logger";
import type { AuthOptions, LoggerOptions, RCEEventTypes } from "./interfaces";
import { EventEmitter } from "events";
import { ILogger } from "./logger/interfaces";
import CommandHandler from "./servers/CommandHandler";

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
  public logger: ILogger;
  public events: RCEEventManager = new RCEEventManager();
  public servers: ServerManager;

  public constructor() {}

  /**
   *
   * @param auth {AuthOptions} - The authentication options for the GPortal API
   * @returns {Promise<void>}
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
   */
  public destroy() {
    this._socket.close();
    this.servers.removeAll();
    this._auth.destroy();
    CommandHandler.destroy();

    this.logger.info("RCE.JS - Closed Gracefully");
  }
}