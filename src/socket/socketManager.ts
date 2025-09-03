import { IServerOptions } from "../types";
import { WebSocket } from "ws";
import type RCEManager from "../manager";
import { RCEEvent } from "../types";
import CommandManager from "../commands/commandManager";
import ResponseHandler from "../commands/responseHandler";

export default class SocketManager {
  private _manager: RCEManager;
  private _socket: WebSocket | null = null;
  private connectionAttempts: number = 0;
  private _options: IServerOptions;
  private _reconnectionTimer: NodeJS.Timeout | null = null;
  private _isDestroyed: boolean = false;

  public constructor(manager: RCEManager, options: IServerOptions) {
    this._manager = manager;
    this._options = options;
    this.connect(options);
  }

  public connect(opts: IServerOptions): void {
    if (this._isDestroyed) {
      return;
    }

    const { rcon, reconnection } = opts;
    const { host, port, password } = rcon;

    // Clear any existing reconnection timer
    if (this._reconnectionTimer) {
      clearTimeout(this._reconnectionTimer);
      this._reconnectionTimer = null;
    }

    const url = `ws://${host}:${port}/${password}`;
    this._socket = new WebSocket(url);

    this._socket.on("open", () => {
      this.connectionAttempts = 0; // Reset connection attempts on successful connection
      
      const server = this._manager.getServer(opts.identifier);
      if (server) {
        server.socket = this._socket;
        server.flags.push("READY");
        this._manager.updateServer(server);
      }

      this._manager.emit(RCEEvent.Ready, {
        server: this._manager.getServer(opts.identifier),
      });

      this._manager.logger.debug(
        `[${opts.identifier}] WebSocket connection established.`
      );
    });

    this._socket.on("close", (code: number, reason: string) => {
      this._manager.logger.debug(
        `[${opts.identifier}] WebSocket closed: ${code} - ${reason}`
      );

      if (this._socket) {
        this._socket.removeAllListeners();
        this._socket.terminate();
        this._socket = null;
      }

      const server = this._manager.getServer(opts.identifier);
      if (server) {
        server.flags = server.flags.filter((flag) => flag !== "READY");
        this._manager.updateServer(server);
      }

      // Only attempt reconnection if not a normal closure and reconnection is enabled
      if (code !== 1000 && !this._isDestroyed) {
        this.attemptReconnection(opts);
      }
    });

    this._socket.on("error", (error: Error) => {
      this._manager.emit(RCEEvent.Error, {
        error: `WebSocket error for server "${opts.identifier}": ${error.message}`,
        server: this._manager.getServer(opts.identifier) || undefined,
      });
    });

    this._socket.on("message", (data: any) => {
      const parsed = JSON.parse(data.toString());

      if (parsed.Message) {
        const uniqueId = parsed.Identifier;
        const server = this._manager.getServer(opts.identifier);
        const message = parsed.Message.replace(/\u0000/g, "").trim();

        this._manager.logger.debug(
          `[${opts.identifier}] Received message: ${JSON.stringify(message)}`
        );

        // Resolve the command if it exists
        if (uniqueId > 0) {
          const cmd = CommandManager.get(opts.identifier, Number(uniqueId));
          if (cmd) {
            if (cmd.timeout) {
              clearTimeout(cmd.timeout);
            }

            cmd.resolve(message);
          }
        }

        // Send the command to regular expression handler
        ResponseHandler.handle(this._manager, server, message);
      }
    });
  }

  private attemptReconnection(opts: IServerOptions): void {
    if (this._isDestroyed) {
      return;
    }

    const { reconnection } = opts;
    const isReconnectionEnabled = reconnection?.enabled !== false; // Default to true
    const maxAttempts = reconnection?.maxAttempts ?? -1; // Default to infinite (-1)
    const interval = reconnection?.interval ?? 5000; // Default to 5 seconds

    // Check if reconnection is disabled
    if (!isReconnectionEnabled) {
      this._manager.logger.warn(
        `[${opts.identifier}] Reconnection is disabled. Not attempting to reconnect.`
      );
      return;
    }

    // Check if we've exceeded max attempts (if maxAttempts is not -1)
    if (maxAttempts !== -1 && this.connectionAttempts >= maxAttempts) {
      this._manager.emit(RCEEvent.Error, {
        error: `WebSocket connection failed for server "${opts.identifier}" after ${maxAttempts} attempts.`,
        server: this._manager.getServer(opts.identifier) || undefined,
      });
      return;
    }

    this.connectionAttempts++;
    this._manager.logger.warn(
      `[${opts.identifier}] Attempting to reconnect WebSocket... (Attempt ${this.connectionAttempts}${maxAttempts !== -1 ? `/${maxAttempts}` : ''})`
    );

    this._reconnectionTimer = setTimeout(() => {
      if (!this._isDestroyed) {
        this.connect(opts);
      }
    }, interval);
  }

  public destroy(): void {
    this._isDestroyed = true;
    
    if (this._reconnectionTimer) {
      clearTimeout(this._reconnectionTimer);
      this._reconnectionTimer = null;
    }

    if (this._socket) {
      this._socket.removeAllListeners();
      this._socket.terminate();
      this._socket = null;
    }
  }

  public getSocket(): WebSocket | null {
    return this._socket;
  }
}
