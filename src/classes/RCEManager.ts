import {
  AuthOptions,
  Auth,
  RustServer,
  ServerOptions,
  WebsocketRequest,
  WebsocketMessage,
} from "../types";
import { GPORTALRoutes, GPORTALWebsocketTypes, RCEEvent } from "../constants";
import { EventEmitter } from "events";
import { WebSocket } from "ws";
import Logger from "./Logger";

export default class RCEManager extends EventEmitter {
  private logger: Logger;
  private email: string;
  private password: string;
  private auth?: Auth;
  private servers: Map<string, RustServer> = new Map();
  private socket?: WebSocket;
  private requests: Map<string, WebsocketRequest> = new Map();

  public constructor(auth: AuthOptions) {
    super();

    this.logger = new Logger(auth.logLevel);
    this.email = auth.email;
    this.password = auth.password;

    this.authenticate(auth.wsTimeout || 60_000);
  }

  private async authenticate(timeout: number) {
    this.logger.debug("Attempting to authenticate");

    this.connectWebsocket(timeout);
  }

  private async refreshToken() {
    this.logger.debug("Attempting to refresh token");

    if (!this.auth?.refresh_token) {
      return this.logger.error("Failed to refresh token: No refresh token");
    }

    try {
      const response = await fetch(GPORTALRoutes.REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: "website",
          refresh_token: this.auth.refresh_token,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }

      this.auth = await response.json();

      this.logger.debug("Token refreshed successfully");
    } catch (err) {
      this.logger.error(`Failed to refresh token: ${err}`);
    }
  }

  private async connectWebsocket(timeout: number) {
    this.logger.debug("Connecting to websocket");

    this.socket = new WebSocket(GPORTALRoutes.WEBSOCKET, ["graphql-ws"], {
      headers: {
        origin: GPORTALRoutes.ORIGIN,
        host: "www.g-portal.com",
      },
      timeout,
    });

    this.socket.on("open", () => {
      this.logger.debug("Websocket connection established");
    });

    this.socket.on("error", (err) => {
      this.logger.error(`Websocket error: ${err.message}`);
      this.socket?.close();
      this.socket = undefined;
      this.connectWebsocket(timeout);
    });

    this.socket.on("close", (code: number, reason: string) => {
      this.logger.error(`Websocket closed: ${code} ${reason}`);
      this.socket = undefined;
      this.connectWebsocket(timeout);
    });

    this.socket.on("message", (data) => {
      try {
        const message: WebsocketMessage = JSON.parse(data.toString());

        if (message.type === "ka") return;

        this.logger.debug(`Received message: ${JSON.stringify(message)}`);

        if (message.type === "error") {
          return this.logger.error(
            `Websocket error: ${message?.payload?.message}`
          );
        }

        if (message.type === "connection_ack") {
          return this.logger.debug("Websocket authenticated successfully");
        }

        if (message.type === "data") {
          const request = this.requests.get(message.id);

          if (!request) {
            return this.logger.error(
              `Failed to handle message: No request found for ID ${message.id}`
            );
          }

          const server = this.servers.get(request.identifier);

          if (!server) {
            return this.logger.error(
              `Failed to handle message: No server found for ID ${request.identifier}`
            );
          }

          this.handleWebsocketMessage(message, server);
        }
      } catch (err) {
        this.logger.error(`Failed to handle message: ${err}`);
      }
    });

    this.authenticateWebsocket();
  }

  private async authenticateWebsocket() {
    this.logger.debug("Attempting to authenticate websocket");

    if (!this.auth?.access_token) {
      return this.logger.error(
        "Failed to authenticate websocket: No access token"
      );
    }

    this.socket.send(
      JSON.stringify({
        type: GPORTALWebsocketTypes.INIT,
        payload: {
          Authorization: `Bearer ${this.auth.access_token}`,
        },
      })
    );

    setInterval(() => {
      this.socket?.send(JSON.stringify({ type: "ka" }));
    }, 30_000);
  }

  private handleWebsocketMessage(
    message: WebsocketMessage,
    server: RustServer
  ) {
    const logMessages: string[] =
      message?.payload?.data?.consoleMessages?.message?.split(
        /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}:LOG:DEFAULT: /gm
      );

    logMessages.forEach((logMessage) => {
      const log = logMessage.trim();
      if (!log || log.startsWith("Executing console system commands")) {
        return;
      }

      this.emit(RCEEvent.MESSAGE, { server, message: log });
      this.logger.debug(`Received message: ${log} from ${server.identifier}`);

      // PLAYER_KILL event
      if (log.includes(" was killed by ")) {
        const [victim, killer] = log
          .split(" was killed by ")
          .map((str) => str.trim());

        this.emit(RCEEvent.PLAYER_KILL, { server, victim, killer });
      }

      // QUICK_CHAT event
      if (log.includes("[CHAT LOCAL]") || log.includes("[CHAT SERVER]")) {
        const type = log.includes("[CHAT LOCAL]") ? "local" : "server";
        const msg = log.split(" : ")[1];
        const ign = log.includes("[CHAT LOCAL]")
          ? log.split("[CHAT LOCAL]")[1].split(" : ")[0]
          : log.split("[CHAT SERVER]")[1].split(" : ")[0];

        this.emit(RCEEvent.QUICK_CHAT, { server, type, ign, msg });
      }

      // PLAYER_JOINED event
      if (log.includes("joined [xboxone]") || log.includes("joined [ps4]")) {
        const ign = log.split(" joined ")[0];
        const platform = log.includes("[xboxone]") ? "XBL" : "PS";

        this.emit(RCEEvent.PLAYER_JOINED, { server, ign, platform });
      }

      // PLAYER_ROLE_ADD event
      const roleMatch = log.match(/\[(.*?)\]/g);
      if (roleMatch && log.includes("Added")) {
        const ign = roleMatch[1];
        const role = roleMatch[2];

        this.emit(RCEEvent.PLAYER_ROLE_ADD, { server, ign, role });
      }

      // NOTE_EDIT event
      const noteMatch = log.match(
        /\[NOTE PANEL\] Player \[ ([^\]]+) \] changed name from \[\s*([\s\S]*?)\s*\] to \[\s*([\s\S]*?)\s*\]/
      );
      if (noteMatch) {
        const ign = noteMatch[1].trim();
        const oldContent = noteMatch[2].trim();
        const newContent = noteMatch[3].trim();

        this.emit(RCEEvent.NOTE_EDIT, { server, ign, oldContent, newContent });
      }

      // EVENT_START event
      if (log.includes("[event]")) {
        let event;

        if (log.includes("event_airdrop")) {
          event = "Airdrop";
        }

        if (log.includes("event_cargoship")) {
          event = "Cargo Ship";
        }

        if (log.includes("event_cargoheli")) {
          event = "Chinook";
        }

        if (log.includes("event_helicopter")) {
          event = "Patrol Helicopter";
        }

        this.emit(RCEEvent.EVENT_START, { server, event });
      }
    });
  }

  public async sendCommand(
    identifier: string,
    command: string
  ): Promise<boolean> {
    if (!this.auth?.access_token) {
      this.logger.error("Failed to send command: No access token");
      return false;
    }

    if (!this.socket) {
      this.logger.error("Failed to send command: No websocket connection");
      return false;
    }

    const server = this.servers.get(identifier);

    if (!server) {
      this.logger.error(
        `Failed to send command: No server found for ID ${identifier}`
      );
      return false;
    }

    this.logger.debug(`Sending command "${command}" to ${server.identifier}`);

    const payload = {
      operationName: "sendConsoleMessage",
      variables: {
        sid: server.serverId,
        region: server.region,
        message: command,
      },
      query:
        "mutation sendConsoleMessage($sid: Int!, $region: REGION!, $message: String!) {\n  sendConsoleMessage(rsid: {id: $sid, region: $region}, message: $message) {\n    ok\n    __typename\n  }\n}",
    };

    try {
      const response = await fetch(GPORTALRoutes.COMMAND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send command: ${response.statusText}`);
      }

      this.logger.debug(`Command "${command}" sent successfully`);

      return true;
    } catch (err) {
      this.logger.error(`Failed to send command: ${err}`);
      return false;
    }
  }

  public async addServer(opts: ServerOptions) {
    if (!this.socket) {
      return this.logger.error("Failed to add server: No websocket connection");
    }

    this.logger.debug(`Adding server "${opts.identifier}"`);

    if (this.servers.has(opts.identifier)) {
      return this.logger.error(`Server "${opts.identifier}" already exists`);
    }

    this.servers.set(opts.identifier, {
      identifier: opts.identifier,
      serverId: opts.serverId,
      region: opts.region,
    });

    const payload = {
      type: GPORTALWebsocketTypes.START,
      payload: {
        variables: { sid: opts.serverId, region: opts.region },
        extensions: {},
        operationName: "consoleMessages",
        query: `subscription consoleMessages($sid: Int!, $region: REGION!) {
          consoleMessages(rsid: {id: $sid, region: $region}) {
            stream
            message
            __typename
          }
        }`,
      },
      id: opts.identifier,
    };

    this.requests.set(opts.identifier, {
      sid: opts.serverId,
      region: opts.region,
      identifier: opts.identifier,
    });

    this.socket.send(JSON.stringify(payload));
  }
}
