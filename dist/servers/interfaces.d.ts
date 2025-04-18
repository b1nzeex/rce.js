export interface ServerOptions {
    identifier: string;
    serverId: number | number[];
    region: "EU" | "US";
    state?: any[];
    playerRefreshing?: boolean;
    radioRefreshing?: boolean;
    extendedEventRefreshing?: boolean;
    intents: string[];
    silent?: boolean;
}
export interface FetchedServer {
    rawName: string;
    name: string;
    region: "EU" | "US";
    sid: number[];
}
export interface RustServer {
    identifier: string;
    serverId: number[];
    region: "EU" | "US";
    intervals: RustServerIntervals;
    flags: string[];
    state: any[];
    status: "STOPPING" | "MAINTENANCE" | "UPDATING" | "STOPPED" | "STARTING" | "RUNNING" | "SUSPENDED" | "UNKNOWN";
    players: string[];
    frequencies: number[];
    intents: string[];
    silent: boolean;
}
interface RustServerIntervals {
    playerRefreshing?: {
        enabled: boolean;
        interval?: NodeJS.Timeout;
    };
    radioRefreshing?: {
        enabled: boolean;
        interval?: NodeJS.Timeout;
    };
    extendedEventRefreshing?: {
        enabled: boolean;
        interval?: NodeJS.Timeout;
    };
}
export interface CommandRequest {
    identifier: string;
    command: string;
    timestamp?: string;
    resolve: (value: CommandResponse) => void;
    reject: (reason: any) => void;
    timeout?: ReturnType<typeof setTimeout>;
}
export interface CommandResponse {
    ok: boolean;
    response?: string;
    error?: string;
}
export interface RustServerInformation {
    Hostname: string;
    MaxPlayers: number;
    Players: number;
    Queued: number;
    Joining: number;
    EntityCount: number;
    GameTime: string;
    Uptime: number;
    Map: "Procedural Map";
    Framerate: number;
    Memory: number;
    Collections: number;
    NetworkIn: number;
    NetworkOut: number;
    Restarting: boolean;
    SaveCreatedTime: string;
}
export interface RustServerAdvancedInformation {
    name: string;
    platforms: string[];
    ipPort: string;
    permissions: RustServerAdvancedInformationPermissions;
    backups: RustServerAdvancedInformationBackups[];
    restarts: RustServerAdvancedInformationRestarts[];
}
interface RustServerAdvancedInformationPermissions {
    username: string;
    created: Date;
    owner: boolean;
}
interface RustServerAdvancedInformationBackups {
    id: number;
    size: number;
    created: Date;
    auto: boolean;
}
interface RustServerAdvancedInformationRestarts {
    id: number;
    schedule: {
        type: "weekly" | "monthly" | "daily";
        timezone: string;
        day?: string;
        dayOfMonth?: number;
        time: string;
    };
    nextRun: Date;
}
export {};
