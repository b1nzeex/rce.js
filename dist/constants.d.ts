export declare enum GPortalRoutes {
    Api = "https://www.g-portal.com/ngpapi/",
    Token = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/token",
    WS = "wss://www.g-portal.com/ngpapi/",
    Origin = "https://www.g-portal.com",
    Home = "https://www.g-portal.com/en",
    Auth = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/auth"
}
export declare enum PlayerKillType {
    Natural = "Natural",
    Entity = "Entity",
    Player = "Player",
    Npc = "Npc"
}
export declare const playerKillData: {
    id: string;
    name: string;
    type: PlayerKillType;
}[];
export declare enum RCEEvent {
    Message = "MESSAGE",
    ServerReady = "SERVER_READY",
    ServiceStatus = "SERVICE_STATUS",
    ServiceSensor = "SERVICE_SENSOR",
    ExecutingCommand = "EXECUTING_COMMAND",
    VendingMachineName = "VENDING_MACHINE_NAME",
    QuickChat = "QUICK_CHAT",
    PlayerSuicide = "PLAYER_SUICIDE",
    PlayerRespawned = "PLAYER_RESPAWNED",
    CustomZoneCreated = "CUSTOM_ZONE_CREATED",
    CustomZoneRemoved = "CUSTOM_ZONE_REMOVED",
    PlayerRoleAdd = "PLAYER_ROLE_ADD",
    ItemSpawn = "ITEM_SPAWN",
    NoteEdit = "NOTE_EDIT",
    TeamCreate = "TEAM_CREATE",
    TeamJoin = "TEAM_JOIN",
    TeamLeave = "TEAM_LEAVE",
    KitSpawn = "KIT_SPAWN",
    KitGive = "KIT_GIVE",
    SpecialEventSet = "SPECIAL_EVENT_SET",
    EventStart = "EVENT_START",
    PlayerKill = "PLAYER_KILL",
    PlayerJoined = "PLAYER_JOINED",
    PlayerLeft = "PLAYER_LEFT",
    PlayerListUpdated = "PLAYER_LIST_UPDATED",
    FrequencyGained = "FREQUENCY_GAINED",
    FrequencyLost = "FREQUENCY_LOST"
}
export declare enum RCEIntent {
    All = "ALL",
    ConsoleMessages = "CONSOLE_MESSAGES",
    ServiceState = "SERVICE_STATE",
    ServiceSensors = "SERVICE_SENSORS"
}
export declare enum LogLevel {
    None = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4
}
export declare const RegularExpressions: {
    [key: string]: RegExp;
};
