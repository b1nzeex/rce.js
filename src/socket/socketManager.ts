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
  private _reconnectionTimer: NodeJS.Timeout | null = null;
  private _isDestroyed: boolean = false;
  private _hasEverConnected: boolean = false;

  public constructor(manager: RCEManager) {
    this._manager = manager;
  }

  public connect(opts: IServerOptions): Promise<boolean> {
    return new Promise((resolve) => {
      if (this._isDestroyed) return resolve(false);

      let settled = false;
      const settle = (value: boolean) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      const { rcon } = opts;
      const { host, port, password } = rcon;

      if (this._reconnectionTimer) {
        clearTimeout(this._reconnectionTimer);
        this._reconnectionTimer = null;
      }

      const url = `ws://${host}:${port}/${password}`;
      this._socket = new WebSocket(url);

      // ✅ unified error handler
      this._socket.on("error", (error: NodeJS.ErrnoException) => {
        const isConnectionRefused =
          error.code === "ECONNREFUSED" || error.code === "ENOTFOUND";

        this._manager.emit(RCEEvent.Error, {
          error: `WebSocket error for server "${opts.identifier}": ${error.message}`,
          server: this._manager.getServer(opts.identifier) || undefined,
        });

        // stop reconnection if first connection is refused
        if (isConnectionRefused && this.connectionAttempts === 0) {
          this._manager.logger.warn(
            `[${opts.identifier}] Connection refused — stopping reconnection attempts.`
          );
          this._isDestroyed = true;
        }

        settle(false);
      });

      const handleSuccess = () => {
        this.connectionAttempts = 0;
        this._hasEverConnected = true;

        const server = this._manager.getServer(opts.identifier);
        if (server) {
          server.socket = this._socket;
          if (!server.flags.includes("READY")) server.flags.push("READY");
          this._manager.updateServer(server);
        }

        const s = this._manager.getServer(opts.identifier);
        if (!s) {
          this._manager.logger.warn(
            `[${opts.identifier}] No server found during Ready emit.`
          );
          settle(false);
          return;
        }

        this._manager.emit(RCEEvent.Ready, { server: s });
        this._manager.logger.debug(
          `[${opts.identifier}] WebSocket connection established.`
        );

        settle(true);
      };

      this._socket.once("open", handleSuccess);

      this._socket.on("close", (code: number, reason: string) => {
        this._manager.logger.debug(
          `[${opts.identifier}] WebSocket closed: ${code} - ${reason}`
        );

        if (this._socket) {
          if (
            this._socket.readyState === WebSocket.OPEN ||
            this._socket.readyState === WebSocket.CLOSING
          ) {
            this._socket.terminate();
          }

          setTimeout(() => {
            if (this._socket) {
              this._socket.removeAllListeners();
              this._socket = null;
            }
          }, 25);
        }

        const server = this._manager.getServer(opts.identifier);
        if (server) {
          server.flags = server.flags.filter((flag) => flag !== "READY");
          this._manager.updateServer(server);
        }

        // ✅ only reconnect if we’ve previously connected
        if (code !== 1000 && !this._isDestroyed && this._hasEverConnected) {
          this.attemptReconnection(opts);
        }
      });

      this._socket.on("message", (data: any) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (!parsed.Message) return;

          const uniqueId = parsed.Identifier;
          const message = parsed.Message.replace(/\u0000/g, "").trim();
          const server = this._manager.getServer(opts.identifier);

          this._manager.logger.debug(
            `[${opts.identifier}] Received message: ${JSON.stringify(message)}`
          );

          // resolve any pending command
          if (uniqueId > 0) {
            const cmd = CommandManager.get(opts.identifier, Number(uniqueId));
            if (cmd) {
              if (cmd.timeout) clearTimeout(cmd.timeout);
              cmd.resolve(message);
            }
          }

          if (!server) {
            this._manager.logger.warn(
              `[${opts.identifier}] Received message for unknown server.`
            );
            return;
          }

          ResponseHandler.handle(this._manager, server, message);
        } catch (err) {
          this._manager.logger.error(
            `[${opts.identifier}] Failed to parse WebSocket message: ${
              (err as Error).message
            }`
          );
        }
      });
    });
  }

  private attemptReconnection(opts: IServerOptions): void {
    if (this._isDestroyed) return;

    const { reconnection } = opts;
    const isReconnectionEnabled = reconnection?.enabled !== false;
    const maxAttempts = reconnection?.maxAttempts ?? -1;
    const interval = Math.min(
      (reconnection?.interval ?? 5000) * Math.pow(2, this.connectionAttempts),
      60_000
    );

    if (!isReconnectionEnabled) {
      this._manager.logger.warn(
        `[${opts.identifier}] Reconnection is disabled.`
      );
      return;
    }

    if (maxAttempts !== -1 && this.connectionAttempts >= maxAttempts) {
      this._manager.emit(RCEEvent.Error, {
        error: `WebSocket connection failed for server "${opts.identifier}" after ${maxAttempts} attempts.`,
        server: this._manager.getServer(opts.identifier) || undefined,
      });
      return;
    }

    this.connectionAttempts++;
    this._manager.logger.warn(
      `[${opts.identifier}] Attempting to reconnect WebSocket... (Attempt ${
        this.connectionAttempts
      }${maxAttempts !== -1 ? `/${maxAttempts}` : ""})`
    );

    this._reconnectionTimer = setTimeout(() => {
      if (!this._isDestroyed) this.connect(opts);
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
