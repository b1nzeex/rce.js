import { WebSocket } from "ws";
import type GPortalAuth from "../auth/Auth";
import { GPortalRoutes, RCEIntent, RegularExpressions } from "../constants";
import type { RustServer } from "../servers/interfaces";
import type { WSMessage, WSRequest } from "./interfaces";
import type RCEManager from "../Manager";
import ServiceStateHandler from "./ServiceState";
import ConsoleMessagesHandler from "./ConsoleMessages";
import ServiceSensorHandler from "./ServiceSensors";
import ServerUtils from "../util/ServerUtils";

export default class GPortalSocket {
  private _manager: RCEManager;
  private _auth: GPortalAuth;
  private _socket: WebSocket;
  private _connectionAttempts: number = 0;
  private _heartbeatInterval: NodeJS.Timeout;
  private _requests: Map<string, WSRequest> = new Map();

  public constructor(manager: RCEManager, auth: GPortalAuth) {
    this._manager = manager;
    this._auth = auth;
  }

  public close() {
    this._manager.logger.debug("Closing WebSocket Connection");

    if (this._socket) {
      this._socket.removeAllListeners();
      this._socket.close();
    }

    if (this._heartbeatInterval) {
      clearInterval(this._heartbeatInterval);
    }

    this._requests.clear();
    this._socket = null;

    this._manager.logger.debug("WebSocket Connection Closed");
  }

  public connect(resubsctibe: boolean = false) {
    this._manager.logger.debug("Connecting to WebSocket Server");

    this._connectionAttempts++;
    this._socket = new WebSocket(GPortalRoutes.WS, ["graphql-ws"], {
      headers: {
        origin: GPortalRoutes.Origin,
        host: "www.g-portal.com",
      },
      timeout: 60_000,
    });

    this._socket.on("open", () => {
      this._manager.logger.debug("WebSocket Connection Established");

      this._connectionAttempts = 0;
      this.authenticate(resubsctibe);

      this._heartbeatInterval = setInterval(() => {
        if (this._socket?.OPEN) {
          this._manager.logger.debug("Sending WebSocket Heartbeat");
          this._socket.send(JSON.stringify({ type: "ka" }));
        }
      }, 30_000);
    });

    this._socket.on("close", (code: number, reason: string) => {
      this._manager.logger.debug(
        `WebSocket Connection Closed: ${code} - ${reason}`
      );

      this.close();

      if (code !== 1000) {
        if (this._connectionAttempts < 5) {
          this._manager.logger.warn(
            `WebSocket Connection Closed - Reconnecting in 10 Seconds (Attempt ${
              this._connectionAttempts + 1
            })`
          );

          setTimeout(
            () => this.connect(true),
            (this._connectionAttempts + 1) * 10_000
          );
        } else {
          throw new Error(
            "Failed to reconnect to the WS server after 5 attempts"
          );
        }
      } else {
        throw new Error(`WS connection closed (${code}): ${reason}`);
      }
    });

    this._socket.on("message", (message) => {
      try {
        const data: WSMessage = JSON.parse(message.toString());

        this._manager.logger.debug(
          `WebSocket Message Received: ${JSON.stringify(data)}`
        );

        if (data.type === "ka") return;

        if (data.type === "error") {
          return ServerUtils.error(
            this._manager,
            `WebSocket Error: ${data.payload?.message}`
          );
        }

        if (data.type === "connection_ack") {
          return this._manager.logger.info("RCE.JS - Authenticated");
        }

        if (data.type === "data") {
          const request = this._requests.get(data.id);
          if (!request) {
            return ServerUtils.error(
              this._manager,
              `Unknown Request ID: ${data.id}`
            );
          }

          const server = this._manager.servers.get(request.identifier);
          if (!server) {
            return ServerUtils.error(
              this._manager,
              `[${server.identifier}] Unknown Server ID`
            );
          }

          if (data.payload?.errors?.length) {
            const error: string = data.payload.errors[0].message;
            const match = error.match(RegularExpressions.AIO_RPC_Error);
            if (match) {
              const status = match[1].trim();
              if (status === "StatusCode.UNAVAILABLE") {
                this._manager.logger.warn(
                  `[${server.identifier}] AioRpcError: Server Is Unavailable, Recreating in 2 Minutes...`
                );

                this._manager.servers.remove(server);
                setTimeout(
                  () =>
                    this._manager.servers.add({
                      identifier: server.identifier,
                      region: server.region,
                      serverId: server.serverId,
                      state: server.state,
                      extendedEventRefreshing:
                        server.intervals.extendedEventRefreshing.enabled,
                      playerRefreshing:
                        server.intervals.playerRefreshing.enabled,
                      radioRefreshing: server.intervals.radioRefreshing.enabled,
                      intents: server.intents,
                    }),
                  120_000
                );
              }

              return;
            }

            return ServerUtils.error(this._manager, `Error: ${error}`, server);
          }

          if (data.payload?.data?.serviceState) {
            ServiceStateHandler.handle(this._manager, data, server);
          } else if (data.payload?.data?.consoleMessages) {
            ConsoleMessagesHandler.handle(this._manager, data, server);
          } else if (data.payload?.data?.serviceSensors) {
            ServiceSensorHandler.handle(this._manager, data, server);
          }
        }
      } catch (error) {}
    });
  }

  public removeServer(server: RustServer) {
    this._manager.logger.debug(
      `[${server.identifier}] Removing WebSocket Subscription`
    );

    if (this._socket?.OPEN) {
      this._socket.send(
        JSON.stringify({
          type: "stop",
          id: server.identifier,
        })
      );
    }

    this._requests.delete(server.identifier);

    this._manager.logger.debug(
      `[${server.identifier}] WebSocket Subscription Removed`
    );
  }

  public addServer(server: RustServer) {
    this._manager.logger.debug(
      `[${server.identifier}] Adding WebSocket Subscription`
    );

    if (this._socket?.OPEN) {
      if (
        server.intents.includes(RCEIntent.All) ||
        server.intents.includes(RCEIntent.ConsoleMessages)
      ) {
        this._socket.send(
          JSON.stringify({
            type: "start",
            payload: {
              variables: {
                sid: server.serverId[1],
                region: server.region,
              },
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
            id: server.identifier,
          })
        );

        this._manager.logger.debug(
          `[${server.identifier}] Subscribed to Console Messages`
        );
      }

      if (
        server.intents.includes(RCEIntent.All) ||
        server.intents.includes(RCEIntent.ServiceState)
      ) {
        this._socket.send(
          JSON.stringify({
            type: "start",
            payload: {
              variables: {
                sid: server.serverId[1],
                region: server.region,
              },
              extensions: {},
              operationName: "serviceState",
              query:
                "subscription serviceState($sid: Int!, $region: REGION!) {\n  serviceState(rsid: {id: $sid, region: $region}) {\n    ...ServiceStateFields\n    __typename\n  }\n}\n\nfragment ServiceStateFields on ServiceState {\n  state\n  fsmState\n  fsmIsTransitioning\n  fsmIsExclusiveLocked\n  fsmFileAccess\n  fsmLastStateChange\n  fsmStateLiveProgress {\n    ... on InstallProgress {\n      action\n      percentage\n      __typename\n    }\n    ... on BroadcastProgress {\n      nextMessageAt\n      stateExitAt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}",
            },
            id: server.identifier,
          })
        );

        this._manager.logger.debug(
          `[${server.identifier}] Subscribed to Service State`
        );
      }

      if (
        server.intents.includes(RCEIntent.All) ||
        server.intents.includes(RCEIntent.ServiceSensors)
      ) {
        this._socket.send(
          JSON.stringify({
            type: "start",
            payload: {
              variables: {
                sid: server.serverId[1],
                region: server.region,
              },
              extensions: {},
              operationName: "serviceSensors",
              query:
                "subscription serviceSensors($sid: Int!, $region: REGION!) {\n  serviceSensors(rsid: {id: $sid, region: $region}) {\n    cpuTotal\n    memory {\n      used\n      __typename\n    }\n    __typename\n  }\n}",
            },
            id: server.identifier,
          })
        );

        this._manager.logger.debug(
          `[${server.identifier}] Subscribed to Service Sensors`
        );
      }

      this._requests.set(server.identifier, {
        sid: server.serverId[1],
        region: server.region,
        identifier: server.identifier,
      });

      this._manager.logger.debug(
        `[${server.identifier}] WebSocket Subscription Added`
      );
    }
  }

  private authenticate(resubsctibe: boolean) {
    const token = this._auth.accessToken;
    if (!token) {
      throw new Error("No access token available");
    }

    this._manager.logger.debug("Authenticating WebSocket Connection");

    if (this._socket.OPEN) {
      this._socket.send(
        JSON.stringify({
          type: "connection_init",
          payload: {
            authorization: token,
          },
        })
      );

      if (resubsctibe) {
        this._manager.servers
          .getAll()
          .forEach((server) => this.addServer(server));
      }
    } else {
      throw new Error("Socket is not open");
    }
  }
}
