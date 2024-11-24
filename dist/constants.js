"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularExpressions = exports.LogLevel = exports.RCEIntent = exports.QuickChat = exports.RCEEvent = exports.playerKillData = exports.PlayerKillType = exports.GPortalRoutes = void 0;
var GPortalRoutes;
(function (GPortalRoutes) {
    GPortalRoutes["Api"] = "https://www.g-portal.com/ngpapi/";
    GPortalRoutes["Token"] = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/token";
    GPortalRoutes["WS"] = "wss://www.g-portal.com/ngpapi/";
    GPortalRoutes["Origin"] = "https://www.g-portal.com";
    GPortalRoutes["Home"] = "https://www.g-portal.com/en";
    GPortalRoutes["Auth"] = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/auth";
})(GPortalRoutes || (exports.GPortalRoutes = GPortalRoutes = {}));
var PlayerKillType;
(function (PlayerKillType) {
    PlayerKillType["Natural"] = "Natural";
    PlayerKillType["Entity"] = "Entity";
    PlayerKillType["Player"] = "Player";
    PlayerKillType["Npc"] = "Npc";
})(PlayerKillType || (exports.PlayerKillType = PlayerKillType = {}));
exports.playerKillData = [
    {
        id: "thirst",
        name: "Thirst",
        type: PlayerKillType.Natural,
    },
    {
        id: "hunger",
        name: "Hunger",
        type: PlayerKillType.Natural,
    },
    {
        id: "guntrap.deployed",
        name: "Shotgun Trap",
        type: PlayerKillType.Entity,
    },
    {
        id: "pee pee 9000",
        name: "Pee Pee 9000",
        type: PlayerKillType.Natural,
    },
    {
        id: "barricade.wood",
        name: "Wooden Barricade",
        type: PlayerKillType.Entity,
    },
    {
        id: "wall.external.high.stone",
        name: "High External Stone Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "wall.external.high",
        name: "High External Wooden Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "gates.external.high.wood",
        name: "High External Wooden Gate",
        type: PlayerKillType.Entity,
    },
    {
        id: "gates.external.high.stone",
        name: "High External Stone Gate",
        type: PlayerKillType.Entity,
    },
    {
        id: "gates.external.high.wood (entity)",
        name: "High External Wooden Gate",
        type: PlayerKillType.Entity,
    },
    {
        id: "gates.external.high.stone (entity)",
        name: "High External Stone Gate",
        type: PlayerKillType.Entity,
    },
    {
        id: "flameturret_fireball (entity)",
        name: "Flame Turret",
        type: PlayerKillType.Entity,
    },
    {
        id: "icewall (entity)",
        name: "Ice Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "wall.external.high.wood (entity)",
        name: "High External Wooden Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "wall.external.high.ice (entity)",
        name: "High External Ice Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "bear",
        name: "Bear",
        type: PlayerKillType.Npc,
    },
    {
        id: "autoturret_deployed",
        name: "Auto Turret",
        type: PlayerKillType.Entity,
    },
    {
        id: "cold",
        name: "Cold",
        type: PlayerKillType.Natural,
    },
    {
        id: "bleeding",
        name: "Bleeding",
        type: PlayerKillType.Natural,
    },
    {
        id: "boar",
        name: "Boar",
        type: PlayerKillType.Npc,
    },
    {
        id: "wolf",
        name: "Wolf",
        type: PlayerKillType.Npc,
    },
    {
        id: "fall",
        name: "Fall",
        type: PlayerKillType.Natural,
    },
    {
        id: "drowned",
        name: "Drowned",
        type: PlayerKillType.Natural,
    },
    {
        id: "radiation",
        name: "Radiation",
        type: PlayerKillType.Natural,
    },
    {
        id: "autoturret_deployed (entity)",
        name: "Auto Turret",
        type: PlayerKillType.Entity,
    },
    {
        id: "bear (bear)",
        name: "Bear",
        type: PlayerKillType.Npc,
    },
    {
        id: "boar (boar)",
        name: "Boar",
        type: PlayerKillType.Npc,
    },
    {
        id: "wolf (wolf)",
        name: "Wolf",
        type: PlayerKillType.Npc,
    },
    {
        id: "guntrap.deployed (entity)",
        name: "Shotgun Trap",
        type: PlayerKillType.Entity,
    },
    {
        id: "fall!",
        name: "Fall",
        type: PlayerKillType.Natural,
    },
    {
        id: "lock.code (entity)",
        name: "Code Lock",
        type: PlayerKillType.Entity,
    },
    {
        id: "bradleyapc (entity)",
        name: "Bradley APC",
        type: PlayerKillType.Npc,
    },
    {
        id: "wall.external.high.stone (entity)",
        name: "High External Stone Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "wall.external.high (entity)",
        name: "High External Wooden Wall",
        type: PlayerKillType.Entity,
    },
    {
        id: "barricade.metal (entity)",
        name: "Metal Barricade",
        type: PlayerKillType.Entity,
    },
    {
        id: "spikes.floor (entity)",
        name: "Floor Spikes",
        type: PlayerKillType.Entity,
    },
    {
        id: "sentry.bandit.static (entity)",
        name: "Bandit Sentry",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-1 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-2 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-3 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-4 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-5 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-6 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "cactus-7 (entity)",
        name: "Cactus",
        type: PlayerKillType.Entity,
    },
    {
        id: "landmine (entity)",
        name: "Landmine",
        type: PlayerKillType.Entity,
    },
    {
        id: "sentry.scientist.static (entity)",
        name: "Scientist Sentry",
        type: PlayerKillType.Entity,
    },
    {
        id: "patrolhelicopter (entity)",
        name: "Patrol Helicopter",
        type: PlayerKillType.Npc,
    },
    {
        id: "flameturret.deployed (entity)",
        name: "Flame Turret",
        type: PlayerKillType.Entity,
    },
    {
        id: "oilfireballsmall (entity)",
        name: "Small Oil Fire",
        type: PlayerKillType.Entity,
    },
    {
        id: "napalm (entity)",
        name: "Napalm",
        type: PlayerKillType.Entity,
    },
    {
        id: "cargoshipdynamic2 (entity)",
        name: "Cargo Ship",
        type: PlayerKillType.Entity,
    },
    {
        id: "cargoshipdynamic1 (entity)",
        name: "Cargo Ship",
        type: PlayerKillType.Entity,
    },
    {
        id: "barricade.wood (entity)",
        name: "Wooden Barricade",
        type: PlayerKillType.Entity,
    },
    {
        id: "beartrap (entity)",
        name: "Bear Trap",
        type: PlayerKillType.Entity,
    },
    {
        id: "barricade.woodwire (entity)",
        name: "Wooden Barricade",
        type: PlayerKillType.Entity,
    },
    {
        id: "campfire (entity)",
        name: "Campfire",
        type: PlayerKillType.Entity,
    },
    {
        id: "rocket_crane_lift_trigger (entity)",
        name: "Crane Lift",
        type: PlayerKillType.Entity,
    },
    {
        id: "rowboat (entity)",
        name: "Rowboat",
        type: PlayerKillType.Entity,
    },
    {
        id: "fireball (entity)",
        name: "Fireball",
        type: PlayerKillType.Entity,
    },
    {
        id: "teslacoil.deployed (entity)",
        name: "Tesla Coil",
        type: PlayerKillType.Entity,
    },
];
var RCEEvent;
(function (RCEEvent) {
    RCEEvent["Message"] = "MESSAGE";
    RCEEvent["ServerReady"] = "SERVER_READY";
    RCEEvent["ServiceStatus"] = "SERVICE_STATUS";
    RCEEvent["ServiceSensor"] = "SERVICE_SENSOR";
    RCEEvent["ExecutingCommand"] = "EXECUTING_COMMAND";
    RCEEvent["VendingMachineName"] = "VENDING_MACHINE_NAME";
    RCEEvent["QuickChat"] = "QUICK_CHAT";
    RCEEvent["PlayerSuicide"] = "PLAYER_SUICIDE";
    RCEEvent["PlayerRespawned"] = "PLAYER_RESPAWNED";
    RCEEvent["CustomZoneCreated"] = "CUSTOM_ZONE_CREATED";
    RCEEvent["CustomZoneRemoved"] = "CUSTOM_ZONE_REMOVED";
    RCEEvent["PlayerRoleAdd"] = "PLAYER_ROLE_ADD";
    RCEEvent["ItemSpawn"] = "ITEM_SPAWN";
    RCEEvent["NoteEdit"] = "NOTE_EDIT";
    RCEEvent["TeamCreate"] = "TEAM_CREATE";
    RCEEvent["TeamJoin"] = "TEAM_JOIN";
    RCEEvent["TeamLeave"] = "TEAM_LEAVE";
    RCEEvent["KitSpawn"] = "KIT_SPAWN";
    RCEEvent["KitGive"] = "KIT_GIVE";
    RCEEvent["SpecialEventSet"] = "SPECIAL_EVENT_SET";
    RCEEvent["EventStart"] = "EVENT_START";
    RCEEvent["PlayerKill"] = "PLAYER_KILL";
    RCEEvent["PlayerJoined"] = "PLAYER_JOINED";
    RCEEvent["PlayerLeft"] = "PLAYER_LEFT";
    RCEEvent["PlayerListUpdated"] = "PLAYER_LIST_UPDATED";
    RCEEvent["FrequencyGained"] = "FREQUENCY_GAINED";
    RCEEvent["FrequencyLost"] = "FREQUENCY_LOST";
    RCEEvent["Error"] = "ERROR";
})(RCEEvent || (exports.RCEEvent = RCEEvent = {}));
var QuickChat;
(function (QuickChat) {
    QuickChat["COMBAT_WereUnderAttack"] = "d11_quick_chat_combat_slot_0";
    QuickChat["COMBAT_Retreat"] = "d11_quick_chat_combat_slot_1";
    QuickChat["COMBAT_MoveOut"] = "d11_quick_chat_combat_slot_2";
    QuickChat["COMBAT_DontShoot"] = "d11_quick_chat_combat_slot_3";
    QuickChat["COMBAT_BeCareful"] = "d11_quick_chat_combat_slot_4";
    QuickChat["COMBAT_TheyreBetterArmed"] = "d11_quick_chat_combat_slot_5";
    QuickChat["COMBAT_ImOutOfAmmo"] = "d11_quick_chat_combat_slot_6";
    QuickChat["COMBAT_ImHurt"] = "d11_quick_chat_combat_slot_7";
    QuickChat["BUILDING_UpgradeWalls"] = "d11_quick_chat_building_slot_0";
    QuickChat["BUILDING_NeedBeds"] = "d11_quick_chat_building_slot_1";
    QuickChat["BUILDING_NeedBuildingPermission"] = "d11_quick_chat_building_slot_2";
    QuickChat["BUILDING_WhatsDoorCode"] = "d11_quick_chat_building_slot_3";
    QuickChat["BUILDING_CanIHaveKey"] = "d11_quick_chat_building_slot_4";
    QuickChat["BUILDING_NeedBetterDoor"] = "d11_quick_chat_building_slot_5";
    QuickChat["BUILDING_UpkeepRunningLow"] = "d11_quick_chat_building_slot_6";
    QuickChat["BUILDING_WhichChestFreeGame"] = "d11_quick_chat_building_slot_7";
    QuickChat["ACTIVITIES_GoingForStone"] = "d11_quick_chat_activities_phrase_format d11_Stone";
    QuickChat["ACTIVITIES_GoingForWood"] = "d11_quick_chat_activities_phrase_format d11_Wood";
    QuickChat["ACTIVITIES_GoingForMetal"] = "d11_quick_chat_activities_phrase_format d11_Metal";
    QuickChat["ACTIVITIES_GoingForFood"] = "d11_quick_chat_activities_phrase_format d11_Food";
    QuickChat["ACTIVITIES_GoingForWater"] = "d11_quick_chat_activities_phrase_format d11_Water";
    QuickChat["ACTIVITIES_GoingForScrap"] = "d11_quick_chat_activities_phrase_format d11_Scrap";
    QuickChat["ACTIVITIES_GoingForMetalFragments"] = "d11_quick_chat_activities_phrase_format d11_Metal_Fragments";
    QuickChat["ACTIVITIES_GoingForMedicine"] = "d11_quick_chat_activities_phrase_format d11_Medicine";
    QuickChat["QUESTIONS_AreYouFriendly"] = "d11_quick_chat_questions_slot_0";
    QuickChat["QUESTIONS_CanIBuildAroundHere"] = "d11_quick_chat_questions_slot_1";
    QuickChat["QUESTIONS_DoYouWantToTeamUp"] = "d11_quick_chat_questions_slot_2";
    QuickChat["QUESTIONS_DoYouNeedAnything"] = "d11_quick_chat_questions_slot_3";
    QuickChat["QUESTIONS_CouldYouHelpMe"] = "d11_quick_chat_questions_slot_4";
    QuickChat["QUESTIONS_WantToTrade"] = "d11_quick_chat_questions_slot_5";
    QuickChat["QUESTIONS_WhosThere"] = "d11_quick_chat_questions_slot_6";
    QuickChat["QUESTIONS_CanIEnter"] = "d11_quick_chat_questions_slot_7";
    QuickChat["RESPONSES_Yes"] = "d11_quick_chat_responses_slot_0";
    QuickChat["RESPONSES_No"] = "d11_quick_chat_responses_slot_1";
    QuickChat["RESPONSES_OK"] = "d11_quick_chat_responses_slot_2";
    QuickChat["RESPONSES_ThankYou"] = "d11_quick_chat_responses_slot_3";
    QuickChat["RESPONSES_NoProblem"] = "d11_quick_chat_responses_slot_4";
    QuickChat["RESPONSES_Hello"] = "d11_quick_chat_responses_slot_5";
    QuickChat["RESPONSES_Goodbye"] = "d11_quick_chat_responses_slot_6";
    QuickChat["RESPONSES_ImSorry"] = "d11_quick_chat_responses_slot_7";
    QuickChat["ORDERS_FollowMe"] = "d11_quick_chat_orders_slot_0";
    QuickChat["ORDERS_GoAway"] = "d11_quick_chat_orders_slot_1";
    QuickChat["ORDERS_RepairThis"] = "d11_quick_chat_orders_slot_2";
    QuickChat["ORDERS_WaitHere"] = "d11_quick_chat_orders_slot_3";
    QuickChat["ORDERS_ComeIn"] = "d11_quick_chat_orders_slot_4";
    QuickChat["ORDERS_LetsGo"] = "d11_quick_chat_orders_slot_5";
    QuickChat["ORDERS_HereTakeThis"] = "d11_quick_chat_orders_slot_6";
    QuickChat["ORDERS_HurryUp"] = "d11_quick_chat_orders_slot_7";
    QuickChat["LOCATION_North"] = "d11_quick_chat_location_slot_0";
    QuickChat["LOCATION_NorthEast"] = "d11_quick_chat_location_slot_1";
    QuickChat["LOCATION_East"] = "d11_quick_chat_location_slot_2";
    QuickChat["LOCATION_SouthEast"] = "d11_quick_chat_location_slot_3";
    QuickChat["LOCATION_South"] = "d11_quick_chat_location_slot_4";
    QuickChat["LOCATION_SouthWest"] = "d11_quick_chat_location_slot_5";
    QuickChat["LOCATION_West"] = "d11_quick_chat_location_slot_6";
    QuickChat["LOCATION_NorthWest"] = "d11_quick_chat_location_slot_7";
    QuickChat["NEED_Scrap"] = "d11_quick_chat_i_need_phrase_format d11_Scrap";
    QuickChat["NEED_LowGradeFuel"] = "d11_quick_chat_i_need_phrase_format lowgradefuel";
    QuickChat["NEED_Food"] = "d11_quick_chat_i_need_phrase_format d11_Food";
    QuickChat["NEED_Water"] = "d11_quick_chat_i_need_phrase_format d11_Water";
    QuickChat["NEED_Wood"] = "d11_quick_chat_i_need_phrase_format d11_Wood";
    QuickChat["NEED_Stone"] = "d11_quick_chat_i_need_phrase_format stones";
    QuickChat["NEED_MetalFragments"] = "d11_quick_chat_i_need_phrase_format d11_Metal_Fragments";
    QuickChat["NEED_HighQualityMetal"] = "d11_quick_chat_i_need_phrase_format metal.refined";
    QuickChat["HAVE_Scrap"] = "d11_quick_chat_i_have_phrase_format d11_Scrap";
    QuickChat["HAVE_LowGradeFuel"] = "d11_quick_chat_i_have_phrase_format lowgradefuel";
    QuickChat["HAVE_Food"] = "d11_quick_chat_i_have_phrase_format d11_Food";
    QuickChat["HAVE_Water"] = "d11_quick_chat_i_have_phrase_format d11_Water";
    QuickChat["HAVE_HuntingBow"] = "d11_quick_chat_i_have_phrase_format bow.hunting";
    QuickChat["HAVE_Pickaxe"] = "d11_quick_chat_i_have_phrase_format pickaxe";
    QuickChat["HAVE_Hatchet"] = "d11_quick_chat_i_have_phrase_format hatchet";
    QuickChat["HAVE_HighQualityMetal"] = "d11_quick_chat_i_have_phrase_format metal.refined";
})(QuickChat || (exports.QuickChat = QuickChat = {}));
var RCEIntent;
(function (RCEIntent) {
    RCEIntent["All"] = "ALL";
    RCEIntent["ConsoleMessages"] = "CONSOLE_MESSAGES";
    RCEIntent["ServiceState"] = "SERVICE_STATE";
    RCEIntent["ServiceSensors"] = "SERVICE_SENSORS";
})(RCEIntent || (exports.RCEIntent = RCEIntent = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
exports.RegularExpressions = {
    AIO_RPC_Error: new RegExp(/status\s*=\s*([^\n]+)\s+details\s*=\s*"([^"]+)"/),
    Log: new RegExp(/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}):LOG:[^:]+: (.+)$/),
    CommandExecuting: new RegExp(/Executing console system command '([^']+)'/),
    VendingMachineName: new RegExp(/\[VENDING MACHINE\] Player \[ ([^\]]+) \] changed name from \[ ([^\]]+) \] to \[ ([^\]]+) \]/),
    QuickChat: new RegExp(/(\[CHAT (TEAM|SERVER|LOCAL)\]) ([\w\s\-_]+) : (.+)/),
    CustomZoneCreated: new RegExp(/Successfully created zone \[([\w\d\s_-]+)\]/),
    CustomZoneRemoved: new RegExp(/Successfully removed zone \[([\w\d\s_-]+)\]/),
    PlayerRoleAdd: new RegExp(/\[?SERVER\]?\s*Added\s*\[([^\]]+)\](?::\[([^\]]+)\])?\s*(?:to\s*(?:Group\s*)?)?\[(\w+)\]/i),
    ItemSpawn: new RegExp(/\bgiving ([\w\s_-]+) ([\d.]+) x ([\w\s-]+(?: [\w\s-]+)*)\b/),
    NoteEdit: new RegExp(/\[NOTE PANEL\] Player \[ ([^\]]+) \] changed name from \[\s*([\s\S]*?)\s*\] to \[\s*([\s\S]*?)\s*\]/),
    TeamCreate: new RegExp(/\[([^\]]+)\] created a new team, ID: (\d+)/),
    TeamJoin: new RegExp(/\[([^\]]+)\] has joined \[([^\]]+)]s team, ID: \[(\d+)\]/),
    TeamLeave: new RegExp(/\[([^\]]+)\] has left \[([^\]]+)]s team, ID: \[(\d+)\]/),
    KitSpawn: new RegExp(/SERVER giving (.+?) kit (\w+)/),
    KitGive: new RegExp(/\[ServerVar\] ([\w\s_-]+) giving ([\w\s_-]+) kit ([\w\s_-]+)/),
    SpecialEventSet: new RegExp(/Setting event as :(\w+)/),
};
//# sourceMappingURL=constants.js.map