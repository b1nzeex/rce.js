import {
  AuthOptions,
  Auth,
  RustServer,
  WebsocketRequest,
  WebsocketMessage,
  ServerOptions,
} from "../types";
import {
  GPORTALRoutes,
  GPORTALWebsocketTypes,
  RCEEvent,
  QuickChat,
  EVENTS,
} from "../constants";
import { WebSocket } from "ws";
import { writeFileSync, readFileSync } from "fs";
import Logger from "./Logger";
import { RCEEvents } from "../types";
import Helper from "./Helper";

interface QueuedCommand {
  identifier: string;
  command: string;
  response: boolean;
  resolve: (value?: string | undefined | null) => void;
  reject: (reason?: any) => void;
}

interface CommandRequest {
  identifier: string;
  command: string;
  timestamp?: string;
  resolve: (value?: string) => void;
  reject: (reason?: any) => void;
  timeout: ReturnType<typeof setTimeout>;
}

export default class RCEManager extends RCEEvents {
  private logger: Logger;
  private auth?: Auth = {
    refresh_token: "",
    access_token: "",
    token_type: "Bearer",
    expires_in: 0,
  };
  private servers: Map<string, RustServer> = new Map();
  private socket?: WebSocket;
  private requests: Map<string, WebsocketRequest> = new Map();
  private commands: CommandRequest[] = [];
  private queue: QueuedCommand[] = [];
  private authMethod: {
    method: "file" | "manual";
    file: string;
    refreshToken: string;
  } = {
    method: "manual",
    refreshToken: "",
    file: "",
  };
  private lastLogDate: Date = new Date();

  /*
    * Create a new RCEManager instance

    * @param {AuthOptions} auth - The authentication options
    * @memberof RCEManager
    * @example
    * const rce = new RCEManager({ refreshToken: "", servers: [{ identifier: "server1", region: "US", serverId: 12345 }], logLevel: LogLevel.INFO, authMethod: "manual" });
    * @example
    * const rce = new RCEManager({ servers: [{ identifier: "server1", region: "US", serverId: 12345 }], logLevel: LogLevel.INFO, authMethod: "file", file: "auth.txt" });
  */
  public constructor(auth: AuthOptions) {
    super();

    this.logger = new Logger(auth.logLevel);

    this.authMethod.refreshToken = auth.refreshToken;
    this.authMethod.file = auth.file || "auth.txt";
    this.authMethod.method = auth.authMethod || "manual";

    if (this.authMethod.method === "manual") {
      if (!auth.refreshToken) {
        throw new Error(
          "No refreshToken argument provided; required for manual auth"
        );
      }

      this.auth.refresh_token = auth.refreshToken;
    }

    if (this.authMethod.method === "file") {
      try {
        const data = readFileSync(this.authMethod.file, "utf-8");
        this.auth.refresh_token = data;
      } catch (err) {
        this.logger.warn("File not found; creating new auth file");
        writeFileSync(this.authMethod.file, "REPLACE_WITH_REFRESH_TOKEN");
        throw new Error("No refresh token provided in file; please add it");
      }
    }

    const servers = auth.servers || [];
    servers.forEach((server) => {
      this.servers.set(server.identifier, {
        identifier: server.identifier,
        serverId: server.serverId,
        region: server.region,
        refreshPlayers: server.refreshPlayers || 0,
        players: [],
        added: false,
        ready: false,
      });
    });
  }

  /*
    * Login to GPORTAL and establish a websocket connection

    * @param {number} [timeout=60_000] - The timeout for the websocket connection
    * @returns {Promise<void>}
    * @memberof RCEManager
    * @example
    * await rce.init();
    * @example
    * await rce.init(30_000);
  */
  public async init(timeout: number = 60_000) {
    await this.authenticate(timeout);
  }

  /*
    * Close the RCEManager and clear all intervals

    * @returns {Promise<void>}
    * @memberof RCEManager
    * @example
    * await rce.close();
  */
  public async close() {
    this.socket?.close();
    this.servers.forEach((server) => {
      clearInterval(server.refreshPlayersInterval);
    });
    this.servers.clear();

    this.logger.info("RCEManager closed successfully");
  }

  private async authenticate(timeout: number) {
    this.logger.debug("Attempting to authenticate");

    const s = await this.refreshToken();
    if (s) {
      this.logger.info("Authenticated successfully");
      await this.connectWebsocket(timeout);
    } else {
      this.logError("Failed to authenticate");
      setTimeout(() => this.authenticate(timeout), 60_000);
    }
  }

  private async refreshToken() {
    this.logger.debug("Attempting to refresh token");

    if (!this.auth?.refresh_token) {
      this.logError("Failed to refresh token: No refresh token");
      return false;
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
      setTimeout(() => this.refreshToken(), this.auth.expires_in * 1000);

      if (this.authMethod.method === "file" && this.authMethod.file) {
        this.logger.debug("Writing auth data to file");
        writeFileSync(this.authMethod.file, this.auth.refresh_token);
      }

      this.logger.debug("Token refreshed successfully");
      return true;
    } catch (err) {
      this.logError(`Failed to refresh token: ${err}`);
      return false;
    }
  }

  private logError(message: string, server?: RustServer) {
    this.emit(RCEEvent.ERROR, { server, error: message });
    this.logger.error(
      `${server ? `[${server.identifier}]: ${message}` : message}`
    );
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

    this.socket.on("open", async () => {
      this.logger.debug("Websocket connection established");
      await this.authenticateWebsocket();

      this.servers.forEach(async (server) => {
        if (!server.added) await this.addServer(server);
      });
    });

    this.socket.on("error", (err) => {
      this.logError(`Websocket error: ${err.message}`);
      this.socket?.close();
      this.socket = undefined;
      this.connectWebsocket(timeout);
    });

    this.socket.on("close", (code: number, reason: string) => {
      this.logError(`Websocket closed: ${code} ${reason}`);
      this.socket = undefined;
      this.connectWebsocket(timeout);
    });

    this.socket.on("message", (data) => {
      try {
        const message: WebsocketMessage = JSON.parse(data.toString());

        if (message.type === "ka") return;

        this.logger.debug(`Received message: ${JSON.stringify(message)}`);

        if (message.type === "error") {
          return this.logError(`Websocket error: ${message?.payload?.message}`);
        }

        if (message.type === "connection_ack") {
          return this.logger.debug("Websocket authenticated successfully");
        }

        if (message.type === "data") {
          const request = this.requests.get(message.id);

          if (!request) {
            return this.logError(
              `Failed to handle message: No request found for ID ${message.id}`
            );
          }

          const server = this.servers.get(request.identifier);

          if (!server) {
            return this.logError(
              `Failed to handle message: No server found for ID ${request.identifier}`
            );
          }

          this.handleWebsocketMessage(message, server);
        }
      } catch (err) {
        this.logError(`Failed to handle message: ${err}`);
      }
    });
  }

  private async authenticateWebsocket() {
    this.logger.debug("Attempting to authenticate websocket");

    if (!this.auth?.access_token) {
      return this.logError("Failed to authenticate websocket: No access token");
    }

    this.socket.send(
      JSON.stringify({
        type: GPORTALWebsocketTypes.INIT,
        payload: {
          authorization: this.auth.access_token,
        },
      })
    );

    setInterval(() => {
      if (this.socket && this.socket.OPEN) {
        this.logger.debug("Sending keep-alive message");
        this.socket.send(JSON.stringify({ type: "ka" }));
      }
    }, 30_000);
  }

  private updateLastLogDate() {
    this.lastLogDate = new Date();

    // If no logs are received for 10 minutes, restart the websocket connection
    setTimeout(() => {
      const now = new Date();
      const diff = now.getTime() - this.lastLogDate.getTime();

      if (diff >= 600_000) {
        this.logger.warn(
          "No logs received for 10 minutes; restarting websocket"
        );
        this.socket?.close();
        this.socket = undefined;
        this.connectWebsocket(60_000);
      }
    }, 600_000);
  }

  private handleWebsocketMessage(
    message: WebsocketMessage,
    server: RustServer
  ) {
    const logMessages =
      message?.payload?.data?.consoleMessages?.message
        ?.split("\n")
        .filter((e) => e !== "") || [];

    if (logMessages.length > 2) {
      if (!server.ready) this.handleServerReady(server.identifier);
      return;
    }

    logMessages?.forEach((logMessage) => {
      const logMatch = logMessage.match(
        /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}):LOG:[^:]+: (.+)$/
      );
      if (!logMatch) return;

      const logMessageDate = logMatch[1];
      const logMessageContent = logMatch[2];

      const log = logMessageContent.trim();
      if (!log) return;

      // Check for a command being executed
      const executingMatch = log.match(
        /Executing console system command '([^']+)'/
      );
      if (executingMatch) {
        this.logger.debug(`Executing message found for: ${executingMatch[1]}`);
        const command = executingMatch[1];

        this.emit(RCEEvent.EXECUTING_COMMAND, {
          server,
          command,
        });

        // Handle command responses (if using sendCommand function)
        const commandRequest = this.commands.find(
          (req) =>
            req.command === command &&
            req.identifier === server.identifier &&
            !req.timestamp
        );
        if (commandRequest) {
          this.logger.debug(`Command "${command}" found in queue`);
          commandRequest.timestamp = logMessageDate;

          this.commands = this.commands.map((req) =>
            req.command === command ? commandRequest : req
          );

          this.logger.debug(`Command "${command}" updated with timestamp`);

          return;
        }
      }

      // Check for a command response
      const commandRequest = this.commands.find(
        (req) =>
          req.identifier === server.identifier &&
          req.timestamp === logMessageDate
      );
      if (commandRequest && !log.startsWith("[ SAVE ]")) {
        this.logger.debug(
          `Command response found for: ${commandRequest.command}`
        );

        commandRequest.resolve(log);
        clearTimeout(commandRequest.timeout);

        this.commands = this.commands.filter(
          (req) =>
            req.command !== commandRequest.command &&
            req.identifier !== commandRequest.identifier &&
            req.timestamp !== commandRequest.timestamp
        );
      }

      this.updateLastLogDate();

      // Population
      if (log.startsWith("<slot:")) {
        const players = log
          .match(/"(.*?)"/g)
          .map((ign) => ign.replace(/"/g, ""));
        players.shift();

        this.emit(RCEEvent.PLAYERLIST_UPDATE, { server, players });

        return this.servers.set(server.identifier, {
          ...server,
          players,
        });
      }

      this.emit(RCEEvent.MESSAGE, { server, message: log });
      this.logger.debug(`Received message: ${log} from ${server.identifier}`);

      // PLAYER_KILL event
      if (log.includes(" was killed by ")) {
        const [victim, killer] = log
          .split(" was killed by ")
          .map((str) => str.trim());

        const victimData = Helper.getKillInformation(victim);
        const killerData = Helper.getKillInformation(killer);

        this.emit(RCEEvent.PLAYER_KILL, {
          server,
          victim: victimData,
          killer: killerData,
        });
      }

      // VENDING_MACHINE_NAME event
      const vendingMachineMatch = log.match(
        /\[VENDING MACHINE\] Player \[ ([^\]]+) \] changed name from \[ ([^\]]+) \] to \[ ([^\]]+) \]/
      );
      if (vendingMachineMatch) {
        const ign = vendingMachineMatch[1];
        const oldName = vendingMachineMatch[2];
        const newName = vendingMachineMatch[3];

        this.emit(RCEEvent.VENDING_MACHINE_NAME, {
          server,
          ign,
          oldName,
          newName,
        });
      }

      // QUICK_CHAT event
      if (log.includes("[CHAT LOCAL]") || log.includes("[CHAT SERVER]")) {
        const type = log.includes("[CHAT LOCAL]") ? "local" : "server";
        const msg = log.split(" : ")[1];
        const ign = log.includes("[CHAT LOCAL]")
          ? log.split("[CHAT LOCAL] ")[1].split(" : ")[0]
          : log.split("[CHAT SERVER] ")[1].split(" : ")[0];

        this.emit(RCEEvent.QUICK_CHAT, {
          server,
          type,
          ign,
          message: msg as QuickChat,
        });
      }

      // PLAYER_SUICIDE event
      if (log.includes("was suicide by Suicide")) {
        const ign = log.split(" was suicide by Suicide")[0];

        this.emit(RCEEvent.PLAYER_SUICIDE, { server, ign });
      }

      // PLAYER_RESPAWNED event
      if (log.includes("has entered the game")) {
        const ign = log.split(" [")[0];
        const platform = log.includes("[xboxone]") ? "XBL" : "PS";

        this.emit(RCEEvent.PLAYER_RESPAWNED, { server, ign, platform });
      }

      // PLAYER_JOINED event
      if (log.includes("joined [xboxone]") || log.includes("joined [ps4]")) {
        const ign = log.split(" joined ")[0];
        const platform = log.includes("[xboxone]") ? "XBL" : "PS";

        this.emit(RCEEvent.PLAYER_JOINED, { server, ign, platform });
      }

      // PLAYER_ROLE_ADD event
      const roleMatch = log.match(
        /\[?SERVER\]?\s*Added\s*\[([^\]]+)\](?::\[([^\]]+)\])?\s*(?:to\s*(?:Group\s*)?)?\[(\w+)\]/i
      );
      if (roleMatch && log.includes("Added")) {
        const ign = roleMatch[1];
        const role = roleMatch[3];

        this.emit(RCEEvent.PLAYER_ROLE_ADD, { server, ign, role });
      }

      // ITEM_SPAWN event
      const itemSpawnMatch = log.match(/\bgiving (\w+) (\d+) x ([\w\s]+)\b/);
      if (itemSpawnMatch) {
        const ign = itemSpawnMatch[1];
        const quantity = Number(itemSpawnMatch[2]);
        const item = itemSpawnMatch[3];

        this.emit(RCEEvent.ITEM_SPAWN, { server, ign, item, quantity });
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

      // TEAM_CREATE event
      const teamCreateMatch = log.match(
        /\[([^\]]+)\] created a new team, ID: (\d+)/
      );
      if (teamCreateMatch) {
        const owner = teamCreateMatch[1];
        const id = Number(teamCreateMatch[2]);

        this.emit(RCEEvent.TEAM_CREATE, { server, owner, id });
      }

      // TEAM_JOIN event
      const teamJoinMatch = log.match(
        /\[([^\]]+)\] has joined \[([^\]]+)]s team, ID: \[(\d+)\]/
      );
      if (teamJoinMatch) {
        const ign = teamJoinMatch[1];
        const owner = teamJoinMatch[2];
        const id = Number(teamJoinMatch[3]);

        this.emit(RCEEvent.TEAM_JOIN, { server, ign, owner, id });
      }

      // TEAM_LEAVE event
      const teamLeaveMatch = log.match(
        /\[([^\]]+)\] has left \[([^\]]+)]s team, ID: \[(\d+)\]/
      );

      if (teamLeaveMatch) {
        const ign = teamLeaveMatch[1];
        const owner = teamLeaveMatch[2];
        const id = Number(teamLeaveMatch[3]);

        this.emit(RCEEvent.TEAM_LEAVE, { server, ign, owner, id });
      }

      // KIT_SPAWN event
      const kitSpawnMatch = log.match(/SERVER giving (.+?) kit (\w+)/);
      if (kitSpawnMatch) {
        const ign = kitSpawnMatch[1];
        const kit = kitSpawnMatch[2];

        this.emit(RCEEvent.KIT_SPAWN, { server, ign, kit });
      }

      // KIT_GIVE event
      const kitGiveMatch = log.match(
        /\[ServerVar\] (\w+) giving (\w+) kit (\w+)/
      );
      if (kitGiveMatch) {
        const admin = kitGiveMatch[1];
        const ign = kitGiveMatch[2];
        const kit = kitGiveMatch[3];

        this.emit(RCEEvent.KIT_GIVE, { server, admin, ign, kit });
      }

      // SPECIAL_EVENT_START event
      const specialEventStartMatch = log.match(/Setting event as :(\w+)/);
      if (specialEventStartMatch) {
        const event = specialEventStartMatch[1] as
          | "Easter"
          | "Halloween"
          | "Xmas"
          | "HalloweenPortal"
          | "XmasPortal";

        this.emit(RCEEvent.SPECIAL_EVENT_START, { server, event });
      }

      // SPECIAL_EVENT_END event
      if (log.startsWith("Event set as: none")) {
        this.emit(RCEEvent.SPECIAL_EVENT_END, { server });
      }

      // EVENT_START event
      if (log.startsWith("[event]")) {
        for (const [key, options] of Object.entries(EVENTS)) {
          if (log.includes(key)) {
            this.emit(RCEEvent.EVENT_START, {
              server,
              event: options.name,
              special: options.special,
            });
          }
        }
      }
    });
  }

  private async resolveServerId(
    region: "US" | "EU",
    serverId: number
  ): Promise<number | undefined> {
    if (!this.auth?.access_token) {
      this.logError("Failed to resolve server ID: No access token");
      return undefined;
    }

    try {
      const response = await fetch(GPORTALRoutes.COMMAND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
        },
        body: JSON.stringify({
          operationName: "sid",
          variables: {
            gameserverId: serverId,
            region,
          },
          query:
            "query sid($gameserverId: Int!, $region: REGION!) {\n  sid(gameserverId: $gameserverId, region: $region)\n}",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to resolve server ID: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.data?.sid as number;
    } catch (err) {
      this.logError(`Failed to resolve server ID: ${err}`);
      return undefined;
    }
  }

  private markServerAsReady(server: RustServer) {
    this.servers.set(server.identifier, {
      ...server,
      ready: true,
    });
    this.emit(RCEEvent.SERVER_READY, { server });
    this.logger.info(`Server "${server.identifier}" added successfully`);
    this.processQueue();
  }

  private handleServerReady(identifier: string) {
    const s = this.servers.get(identifier);
    if (s && !s.ready) {
      this.markServerAsReady(s);
    }
  }

  private async processQueue() {
    this.servers.forEach((server) => {
      if (server.ready) {
        const queuedCommands = this.queue.filter(
          (cmd) => cmd.identifier === server.identifier
        );

        this.queue = this.queue.filter(
          (cmd) => cmd.identifier !== server.identifier
        );

        queuedCommands.forEach(
          ({ identifier, command, response, resolve, reject }) => {
            const s = this.getServer(identifier);
            this.sendCommandInternal(s, command, response)
              .then(resolve)
              .catch(reject);
          }
        );
      }
    });
  }

  private async sendCommandInternal(
    server: RustServer,
    command: string,
    response: boolean
  ): Promise<string | undefined | null> {
    if (!this.auth?.access_token) {
      this.logError("Failed to send command: No access token");
      return null;
    }

    if (!this.socket || !this.socket.OPEN) {
      this.logError("Failed to send command: No websocket connection");
      return null;
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

    if (response) {
      return new Promise((resolve, reject) => {
        this.commands.push({
          identifier: server.identifier,
          command,
          resolve,
          reject,
          timeout: undefined,
        });

        this.logger.debug(`Command "${command}" added to queue`);

        try {
          fetch(GPORTALRoutes.COMMAND, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${this.auth.token_type} ${this.auth.access_token}`,
            },
            body: JSON.stringify(payload),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to send command: ${response.statusText}`
                );
              }

              this.logger.debug(`Command "${command}" sent successfully`);
              this.logger.debug(`Starting timeout for command "${command}"`);

              const cmd = this.commands.find(
                (req) =>
                  req.command === command &&
                  req.identifier === server.identifier
              );

              if (cmd) {
                cmd.timeout = setTimeout(() => {
                  this.commands = this.commands.filter(
                    (req) =>
                      req.command !== command &&
                      req.identifier !== server.identifier
                  );
                  resolve(undefined);
                }, 3_000);
              }
            })
            .catch((err) => {
              this.commands = this.commands.filter(
                (req) =>
                  req.command !== command &&
                  req.identifier !== server.identifier
              );
              reject(err);
            });
        } catch (err) {
          this.commands = this.commands.filter(
            (req) =>
              req.command !== command && req.identifier !== server.identifier
          );
          reject(err);
        }
      });
    } else {
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
          this.logError(
            `Failed to send command: ${response.statusText}`,
            server
          );
          return null;
        }

        this.logger.debug(`Command "${command}" sent successfully`);
        return undefined;
      } catch (err) {
        this.logError(`Failed to send command: ${err}`, server);
        return null;
      }
    }
  }

  /*
    * Send a command to a Rust server

    * @param {string} identifier - The server identifier
    * @param {string} command - The command to send
    * @param {boolean} [response=false] - Whether to wait for a response
    * @returns {Promise<string | undefined | null>}
    * @memberof RCEManager
    * @example
    * await rce.sendCommand("server1", "RemoveOwner username");
    * @example
    * await rce.sendCommand("server1", "BanID username", true);
  */
  public async sendCommand(
    identifier: string,
    command: string,
    response: boolean = false
  ): Promise<string | undefined | null> {
    return new Promise((resolve, reject) => {
      const server = this.servers.get(identifier);

      if (!server) {
        this.logError(
          `Failed to send command: No server found for ID ${identifier}`
        );
        return null;
      }

      if (server.ready) {
        this.logger.debug(
          `Server ${identifier} is ready, sending command immediately`
        );
        this.sendCommandInternal(server, command, response)
          .then(resolve)
          .catch(reject);
      } else {
        this.logger.debug(
          `Server ${identifier} is not ready, adding command to queue`
        );
        this.queue.push({ identifier, command, response, resolve, reject });
      }
    });
  }

  /*
    * Add a Rust server to the manager

    * @param {ServerOptions} opts - The server options
    * @returns {Promise<boolean>}
    * @memberof RCEManager
    * @example
    * await rce.addServer({ identifier: "server1", region: "US", serverId: 12345 });
    * @example
    * await rce.addServer({ identifier: "server2", region: "EU", serverId: 54321, refreshPlayers: 5 });
  */
  public async addServer(opts: ServerOptions): Promise<boolean> {
    this.logger.debug(`Adding server "${opts.identifier}"`);

    const sid = await this.resolveServerId(opts.region, opts.serverId);
    if (!sid) {
      this.logError(
        `Failed to add server "${opts.identifier}": No server ID found`
      );
      return false;
    }

    this.servers.set(opts.identifier, {
      identifier: opts.identifier,
      serverId: sid,
      region: opts.region,
      refreshPlayers: opts.refreshPlayers || 0,
      refreshPlayersInterval: opts.refreshPlayers
        ? setInterval(() => {
            this.refreshPlayers(opts.identifier);
          }, opts.refreshPlayers * 60_000)
        : undefined,
      players: [],
      added: true,
      ready: false,
    });

    const payload = {
      type: GPORTALWebsocketTypes.START,
      payload: {
        variables: { sid, region: opts.region },
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
      sid,
      region: opts.region,
      identifier: opts.identifier,
    });

    this.socket.send(JSON.stringify(payload), (err) => {
      if (err) {
        this.logError(`Failed to add server "${opts.identifier}": ${err}`);
        return false;
      }

      if (opts.refreshPlayers) {
        this.refreshPlayers(opts.identifier);
      }

      setTimeout(async () => {
        const s = this.getServer(opts.identifier);
        if (s && !s.ready) {
          await this.handleServerReady(opts.identifier);
        }
      }, 20_000);
    });
  }

  private async refreshPlayers(identifier: string) {
    const server = this.servers.get(identifier);
    if (!server) {
      this.logError(
        `Failed to refresh players: No server found for ID ${identifier}`
      );
      return;
    }

    const users = await this.sendCommand(identifier, "Users", true);
    if (!users) return this.refreshPlayers(identifier);

    const players = users.match(/"(.*?)"/g).map((ign) => ign.replace(/"/g, ""));
    players.shift();

    this.servers.set(identifier, {
      ...server,
      players,
    });

    this.emit(RCEEvent.PLAYERLIST_UPDATE, { server, players });

    this.logger.debug(`Players refreshed for ${identifier}`);
  }

  /*
    * Get a Rust server from the manager

    * @param {string}
    * @returns {RustServer}
    * @memberof RCEManager
    * @example
    * const server = rce.getServer("server1");
  */
  public getServer(identifier: string) {
    return this.servers.get(identifier);
  }

  /*
    * Remove a Rust server from the manager

    * @param {string}
    * @memberof RCEManager
    * @example
    * rce.removeServer("server1");
    * @example
    * rce.removeServer("my-solo-duo-trio-3x");
  */
  public removeServer(identifier: string) {
    clearInterval(this.servers.get(identifier)?.refreshPlayersInterval);
    this.servers.delete(identifier);

    const request = this.requests.get(identifier);
    if (request) this.requests.delete(request.identifier);

    this.logger.info(`Server "${identifier}" removed successfully`);
  }

  /*
    * Get all Rust servers from the manager

    * @returns {Map<string, RustServer>}
    * @memberof RCEManager
    * @example
    * const servers = rce.getServers();
    * for (const [identifier, server] of servers) {
    *  console.log(identifier, server);
    * }
  */
  public getServers() {
    return this.servers;
  }
}
