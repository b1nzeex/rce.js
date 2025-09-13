import {
  type IServerOptions,
  type IServer,
  type IEvent,
  RCEEvent,
  type IRustServerInformation,
  type IOptions,
  LogLevel,
  type ILogger,
} from "./types";
import SocketManager from "./socket/socketManager";
import { EventEmitter } from "events";
import CommandManager from "./commands/commandManager";
import Logger from "./logger";

export default class RCEManager extends EventEmitter {
  private servers: Map<string, IServer> = new Map();
  public logger: ILogger;

  /**
   *
   * @param opts Options for the RCEManager instance.
   * @param opts.logLevel The log level for the logger. Default is LogLevel.Info
   * Creates an instance of RCEManager.
   */
  public constructor(opts: IOptions) {
    super();

    this.logger =
      opts.logger?.instance ||
      new Logger(opts.logger?.level, opts.logger?.file);

    this.on(RCEEvent.Error, (payload) => {
      if (payload.server) {
        this.logger.error(`[${payload.server.identifier}] ${payload.error}`);
      } else {
        this.logger.error(payload.error);
      }
    });
    this.on(RCEEvent.Ready, (payload) => {
      this.updatePlayers(payload.server.identifier);
      this.updateBroadcasters(payload.server.identifier);
      this.fetchGibs(payload.server.identifier);
      this.logger.info(
        `[${payload.server.identifier}] Server Successfully Added!`
      );
    });
  }

  /**
   *
   * @param options Options for the server to be added.
   * @param options.identifier Unique identifier for the server.
   * @param options.state Any additional information for the server.
   * @param options.rcon RCON connection options for the server.
   * @param options.rcon.port RCON port for the server.
   * @param options.rcon.password RCON password for the server.
   * @param options.rcon.host RCON host for the server.
   * Creates a new server instance and adds it to the manager.
   * @returns void
   */
  public addServer(options: IServerOptions): void {
    this.logger.debug(`[${options.identifier}] Attempting To Add Server...`);

    if (this.servers.has(options.identifier)) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${options.identifier}" Already Exists!`,
      });
      return;
    }

    const socketManager = new SocketManager(this, options);
    const socket = socketManager.getSocket();
    const server: IServer = {
      identifier: options.identifier,
      socket,
      socketManager,
      flags: [],
      intervals: {
        playerRefreshing: setInterval(() => {
          this.updatePlayers(options.identifier);
        }, 60_000),

        frequencyRefreshing: setInterval(() => {
          this.updateBroadcasters(options.identifier);
        }, 60_000),

        gibRefreshing: setInterval(() => {
          this.fetchGibs(options.identifier);
        }, 60_000),
      },
      state: options.state || [],
      connectedPlayers: [],
      frequencies: [],
    };

    this.servers.set(options.identifier, server);
  }

  /**
   *
   * @param server The server object to update.
   * @param server.identifier Unique identifier for the server.
   * @returns void
   * Updates an existing server instance in the manager.
   */
  public updateServer(server: IServer): void {
    if (!this.servers.has(server.identifier)) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${server.identifier}" Does Not Exist!`,
      });
      return;
    }

    this.servers.set(server.identifier, server);
  }

  /**
   *
   * @param identifier Unique identifier for the server to be removed.
   * Removes a server instance from the manager.
   * @returns void
   */
  public removeServer(identifier: string): void {
    if (!this.servers.has(identifier)) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Does Not Exist!`,
      });
      return;
    }

    const server = this.servers.get(identifier);
    if (server) {
      // Properly destroy the SocketManager to stop reconnection attempts
      if (server.socketManager) {
        server.socketManager.destroy();
      }

      if (server.socket) {
        server.socket.close();
      }

      Object.values(server.intervals).forEach(clearInterval);
    }

    this.servers.delete(identifier);
    this.logger.info(`[${identifier}] Server Successfully Removed!`);
  }

  /**
   *
   * @param identifier Unique identifier for the server to be fetched.
   * Retrieves a server instance by its identifier.
   * @returns IServer | null
   */
  public getServer(identifier: string): IServer | null {
    return this.servers.get(identifier) || null;
  }

  /**
   *
   * @param identifier Unique identifier for the server to fetch information from.
   * Fetches server information using the RCON command "serverinfo".
   * @returns IRustServerInformation | string | undefined
   */
  public async fetchInfo(identifier: string) {
    const server = this.getServer(identifier);
    if (!server) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Does Not Exist!`,
      });
      return;
    }

    const info = await this.sendCommand(identifier, "serverinfo");
    if (!info) {
      this.emit(RCEEvent.Error, {
        error: `Failed To Fetch Server Information For "${identifier}"!`,
      });
      return;
    }

    let cleanOutput = info.replace(/\\n/g, "").trim();
    try {
      const json = JSON.parse(cleanOutput);
      return json as IRustServerInformation;
    } catch (error) {
      return info;
    }
  }

  /**
   *
   * @param identifier Unique identifier for the server to send the command to.
   * @param command The command to be sent to the server.
   * Sends a command to the server using the RCON connection.
   * @returns Promise<string | undefined>
   */
  public async sendCommand(
    identifier: string,
    command: string
  ): Promise<string | undefined> {
    const server = this.getServer(identifier);
    if (!server?.socket) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Does Not Exist Or Is Not Connected!`,
      });
      return;
    }

    if (!server.flags.includes("READY")) return undefined;

    if (server.socket.readyState === server.socket.OPEN) {
      const rand = Math.floor(Math.random() * 999999999);

      return new Promise(async (resolve, reject) => {
        CommandManager.add({
          identifier,
          command,
          uniqueId: rand,
          resolve,
          reject,
        });

        server.socket.send(
          JSON.stringify({
            message: command,
            identifier: rand,
          })
        );

        this.logger.debug(
          `[${identifier}] Sending Command: ${command} (ID: ${rand})`
        );

        const cmd = CommandManager.get(identifier, rand);
        if (cmd) {
          cmd.timeout = setTimeout(() => {
            CommandManager.remove(cmd);
            resolve(undefined);
          }, 3_000);
        }
      });
    } else {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Is Not Connected!`,
      });
      return;
    }
  }

  /**
   * Destroys the RCEManager instance, cleaning up all resources.
   * Closes all server sockets, clears intervals, and removes all listeners.
   */
  public destroy(): void {
    this.servers.forEach((server) => {
      // Properly destroy the SocketManager to stop reconnection attempts
      if (server.socketManager) {
        server.socketManager.destroy();
      }

      if (server.socket) {
        server.socket.close();
      }
      Object.values(server.intervals).forEach(clearInterval);
    });
    this.servers.clear();
    this.removeAllListeners();
    this.logger.info("RCEManager Successfully Destroyed!");
  }

  /*
    Event Handling
  */
  emit<K extends keyof IEvent>(
    event: K,
    ...args: IEvent[K] extends undefined ? [] : [IEvent[K]]
  ): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof IEvent>(
    event: K,
    listener: (payload: IEvent[K]) => void
  ): this {
    return super.on(event, listener);
  }

  once<K extends keyof IEvent>(
    event: K,
    listener: (payload: IEvent[K]) => void
  ): this {
    return super.once(event, listener);
  }

  off<K extends keyof IEvent>(
    event: K,
    listener: (payload: IEvent[K]) => void
  ): this {
    return super.off(event, listener);
  }

  /*
    Scheduled Tasks
  */
  private async updateBroadcasters(identifier: string): Promise<void> {
    const server = this.getServer(identifier);
    if (!server) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Does Not Exist!`,
      });
      return;
    }

    const broadcasters = await this.sendCommand(
      identifier,
      "rf.listboardcaster"
    );
    if (broadcasters) {
      const broadcasts = [];
      const regex =
        /\[(\d+) MHz\] Position: \(([\d.-]+), ([\d.-]+), ([\d.-]+)\), Range: (\d+)/g;
      let match;

      while ((match = regex.exec(broadcasters)) !== null) {
        const frequency = parseInt(match[1], 10);
        const coordinates = [
          parseFloat(match[2]),
          parseFloat(match[3]),
          parseFloat(match[4]),
        ];
        const range = parseInt(match[5], 10);

        broadcasts.push({ frequency, coordinates, range });
      }

      server.frequencies.forEach((freq) => {
        if (!broadcasts.find((b) => parseInt(b.frequency) === freq)) {
          this.emit(RCEEvent.FrequencyLost, {
            server,
            frequency: freq,
          });

          server.frequencies = server.frequencies.filter((f) => f !== freq);
        }
      });

      broadcasts.forEach((broadcast) => {
        if (server.frequencies.includes(broadcast.frequency)) return;
        server.frequencies.push(broadcast.frequency);

        if (broadcast.frequency === 4765) {
          this.emit(RCEEvent.EventStart, {
            server,
            event: "Small Oil Rig",
            special: false,
          });
        } else if (broadcast.frequency === 4768) {
          this.emit(RCEEvent.EventStart, {
            server,
            event: "Oil Rig",
            special: false,
          });
        }

        this.emit(RCEEvent.FrequencyGained, {
          server,
          frequency: broadcast.frequency,
          coordinates: broadcast.coordinates,
          range: broadcast.range,
        });
      });

      this.updateServer(server);
    }
  }

  private async fetchGibs(identifier: string): Promise<void> {
    const server = this.getServer(identifier);
    if (!server) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Does Not Exist!`,
      });
      return;
    }

    const bradley = await this.sendCommand(
      identifier,
      "find_entity servergibs_bradley"
    );
    const helicopter = await this.sendCommand(
      identifier,
      "find_entity servergibs_patrolhelicopter"
    );

    if (!bradley || !helicopter) {
      this.emit(RCEEvent.Error, {
        error: `Failed To Fetch Gibs For Server "${identifier}"`,
      });
      return;
    }

    if (
      bradley.includes("servergibs_bradley") &&
      !server.flags.includes("BRADLEY")
    ) {
      server.flags.push("BRADLEY");

      setTimeout(() => {
        const s = this.getServer(identifier);
        if (s) {
          s.flags = s.flags.filter((f) => f !== "BRADLEY");
          this.updateServer(s);
        }
      }, 60_000 * 10);

      this.emit(RCEEvent.EventStart, {
        server,
        event: "Bradley APC Debris",
        special: false,
      });
    }

    if (
      helicopter.includes("servergibs_patrolhelicopter") &&
      !server.flags.includes("HELICOPTER")
    ) {
      server.flags.push("HELICOPTER");

      setTimeout(() => {
        const s = this.getServer(identifier);
        if (s) {
          s.flags = s.flags.filter((f) => f !== "HELICOPTER");
          this.updateServer(s);
        }
      }, 60_000 * 10);

      this.emit(RCEEvent.EventStart, {
        server,
        event: "Patrol Helicopter Debris",
        special: false,
      });
    }

    this.updateServer(server);
  }

  private async updatePlayers(identifier: string): Promise<void> {
    const server = this.getServer(identifier);
    if (!server) {
      this.emit(RCEEvent.Error, {
        error: `Server With Identifier "${identifier}" Does Not Exist!`,
      });
      return;
    }

    const players = await this.sendCommand(identifier, "Users");
    if (players) {
      const playerlist = players
        .match(/"(.*?)"/g)
        .map((ign) => ign.replace(/"/g, ""));
      playerlist.shift();

      const comparePopulation = (oldList: string[], newList: string[]) => {
        const joined = newList.filter((ign) => !oldList.includes(ign));
        const left = oldList.filter((ign) => !newList.includes(ign));

        return { joined, left };
      };

      const { joined, left } = comparePopulation(
        server.connectedPlayers,
        playerlist
      );

      joined.forEach((player) => {
        this.emit(RCEEvent.PlayerJoined, {
          server,
          ign: player,
        });
      });

      left.forEach((player) => {
        this.emit(RCEEvent.PlayerLeft, {
          server,
          ign: player,
        });
      });

      server.connectedPlayers = playerlist;
      this.updateServer(server);

      this.emit(RCEEvent.PlayerListUpdated, {
        server,
        players: playerlist,
        joined,
        left,
      });
    }
  }
}
