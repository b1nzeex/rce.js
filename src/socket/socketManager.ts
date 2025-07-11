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

  public constructor(manager: RCEManager, options: IServerOptions) {
    this._manager = manager;
    this.connect(options);
  }

  public connect(opts: IServerOptions): void {
    const { rcon } = opts;
    const { host, port, password } = rcon;

    const url = `ws://${host}:${port}/${password}`;
    this._socket = new WebSocket(url);

    this._socket.on("open", () => {
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

      this._socket.removeAllListeners();
      this._socket.terminate();

      const server = this._manager.getServer(opts.identifier);
      if (server) {
        server.flags = server.flags.filter((flag) => flag !== "READY");
        this._manager.updateServer(server);
      }

      if (code !== 1000) {
        if (this.connectionAttempts < 5) {
          this._manager.logger.warn(
            `[${opts.identifier}] Reconnecting WebSocket...`
          );

          setTimeout(() => {
            this.connectionAttempts++;
            this.connect(opts);
          }, (this.connectionAttempts + 1) * 10_000);
        } else {
          this._manager.emit(RCEEvent.Error, {
            error: `WebSocket connection failed for server "${opts.identifier}" after multiple attempts.`,
            server: this._manager.getServer(opts.identifier) || undefined,
          });

          this._manager.removeServer(opts.identifier);
        }
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

        this._manager.logger.debug(
          `[${opts.identifier}] Received message: ${JSON.stringify(
            parsed.Message
          )}`
        );

        // Resolve the command if it exists
        if (uniqueId > 0) {
          const cmd = CommandManager.get(opts.identifier, Number(uniqueId));
          if (cmd) {
            if (cmd.timeout) {
              clearTimeout(cmd.timeout);
            }

            cmd.resolve(parsed.Message);
          }
        }

        // Send the command to regular expression handler
        ResponseHandler.handle(this._manager, server, parsed.Message);
      }
    });
  }

  public getSocket(): WebSocket | null {
    return this._socket;
  }
}
