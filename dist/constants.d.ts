export declare enum GPORTALRoutes {
    COMMAND = "https://www.g-portal.com/ngpapi/",
    REFRESH = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/token",
    WEBSOCKET = "wss://www.g-portal.com/ngpapi/",
    ORIGIN = "https://www.g-portal.com",
    HOME = "https://www.g-portal.com/en"
}
export declare enum GPORTALWebsocketTypes {
    INIT = "connection_init",
    START = "start"
}
export declare enum LogLevel {
    NONE = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4
}
export declare enum RCEEvent {
    CONNECTED = "connected",
    MESSAGE = "message",
    PLAYER_KILL = "player_kill",
    PLAYER_JOINED = "player_joined",
    PLAYER_ROLE_ADD = "player_role_add",
    QUICK_CHAT = "quick_chat",
    NOTE_EDIT = "note_edit",
    EVENT_START = "event_start",
    PLAYERLIST_UPDATE = "playerlist_update"
}
