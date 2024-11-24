export enum GPortalRoutes {
  Api = "https://www.g-portal.com/ngpapi/",
  Token = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/token",
  WS = "wss://www.g-portal.com/ngpapi/",
  Origin = "https://www.g-portal.com",
  Home = "https://www.g-portal.com/en",
  Auth = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/auth",
}

export enum PlayerKillType {
  Natural = "Natural",
  Entity = "Entity",
  Player = "Player",
  Npc = "Npc",
}

export const playerKillData = [
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

export enum RCEEvent {
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
  FrequencyLost = "FREQUENCY_LOST",
  Error = "ERROR",
}

export enum QuickChat {
  COMBAT_WereUnderAttack = "d11_quick_chat_combat_slot_0",
  COMBAT_Retreat = "d11_quick_chat_combat_slot_1",
  COMBAT_MoveOut = "d11_quick_chat_combat_slot_2",
  COMBAT_DontShoot = "d11_quick_chat_combat_slot_3",
  COMBAT_BeCareful = "d11_quick_chat_combat_slot_4",
  COMBAT_TheyreBetterArmed = "d11_quick_chat_combat_slot_5",
  COMBAT_ImOutOfAmmo = "d11_quick_chat_combat_slot_6",
  COMBAT_ImHurt = "d11_quick_chat_combat_slot_7",
  BUILDING_UpgradeWalls = "d11_quick_chat_building_slot_0",
  BUILDING_NeedBeds = "d11_quick_chat_building_slot_1",
  BUILDING_NeedBuildingPermission = "d11_quick_chat_building_slot_2",
  BUILDING_WhatsDoorCode = "d11_quick_chat_building_slot_3",
  BUILDING_CanIHaveKey = "d11_quick_chat_building_slot_4",
  BUILDING_NeedBetterDoor = "d11_quick_chat_building_slot_5",
  BUILDING_UpkeepRunningLow = "d11_quick_chat_building_slot_6",
  BUILDING_WhichChestFreeGame = "d11_quick_chat_building_slot_7",
  ACTIVITIES_GoingForStone = "d11_quick_chat_activities_phrase_format d11_Stone",
  ACTIVITIES_GoingForWood = "d11_quick_chat_activities_phrase_format d11_Wood",
  ACTIVITIES_GoingForMetal = "d11_quick_chat_activities_phrase_format d11_Metal",
  ACTIVITIES_GoingForFood = "d11_quick_chat_activities_phrase_format d11_Food",
  ACTIVITIES_GoingForWater = "d11_quick_chat_activities_phrase_format d11_Water",
  ACTIVITIES_GoingForScrap = "d11_quick_chat_activities_phrase_format d11_Scrap",
  ACTIVITIES_GoingForMetalFragments = "d11_quick_chat_activities_phrase_format d11_Metal_Fragments",
  ACTIVITIES_GoingForMedicine = "d11_quick_chat_activities_phrase_format d11_Medicine",
  QUESTIONS_AreYouFriendly = "d11_quick_chat_questions_slot_0",
  QUESTIONS_CanIBuildAroundHere = "d11_quick_chat_questions_slot_1",
  QUESTIONS_DoYouWantToTeamUp = "d11_quick_chat_questions_slot_2",
  QUESTIONS_DoYouNeedAnything = "d11_quick_chat_questions_slot_3",
  QUESTIONS_CouldYouHelpMe = "d11_quick_chat_questions_slot_4",
  QUESTIONS_WantToTrade = "d11_quick_chat_questions_slot_5",
  QUESTIONS_WhosThere = "d11_quick_chat_questions_slot_6",
  QUESTIONS_CanIEnter = "d11_quick_chat_questions_slot_7",
  RESPONSES_Yes = "d11_quick_chat_responses_slot_0",
  RESPONSES_No = "d11_quick_chat_responses_slot_1",
  RESPONSES_OK = "d11_quick_chat_responses_slot_2",
  RESPONSES_ThankYou = "d11_quick_chat_responses_slot_3",
  RESPONSES_NoProblem = "d11_quick_chat_responses_slot_4",
  RESPONSES_Hello = "d11_quick_chat_responses_slot_5",
  RESPONSES_Goodbye = "d11_quick_chat_responses_slot_6",
  RESPONSES_ImSorry = "d11_quick_chat_responses_slot_7",
  ORDERS_FollowMe = "d11_quick_chat_orders_slot_0",
  ORDERS_GoAway = "d11_quick_chat_orders_slot_1",
  ORDERS_RepairThis = "d11_quick_chat_orders_slot_2",
  ORDERS_WaitHere = "d11_quick_chat_orders_slot_3",
  ORDERS_ComeIn = "d11_quick_chat_orders_slot_4",
  ORDERS_LetsGo = "d11_quick_chat_orders_slot_5",
  ORDERS_HereTakeThis = "d11_quick_chat_orders_slot_6",
  ORDERS_HurryUp = "d11_quick_chat_orders_slot_7",
  LOCATION_North = "d11_quick_chat_location_slot_0",
  LOCATION_NorthEast = "d11_quick_chat_location_slot_1",
  LOCATION_East = "d11_quick_chat_location_slot_2",
  LOCATION_SouthEast = "d11_quick_chat_location_slot_3",
  LOCATION_South = "d11_quick_chat_location_slot_4",
  LOCATION_SouthWest = "d11_quick_chat_location_slot_5",
  LOCATION_West = "d11_quick_chat_location_slot_6",
  LOCATION_NorthWest = "d11_quick_chat_location_slot_7",
  NEED_Scrap = "d11_quick_chat_i_need_phrase_format d11_Scrap",
  NEED_LowGradeFuel = "d11_quick_chat_i_need_phrase_format lowgradefuel",
  NEED_Food = "d11_quick_chat_i_need_phrase_format d11_Food",
  NEED_Water = "d11_quick_chat_i_need_phrase_format d11_Water",
  NEED_Wood = "d11_quick_chat_i_need_phrase_format d11_Wood",
  NEED_Stone = "d11_quick_chat_i_need_phrase_format stones",
  NEED_MetalFragments = "d11_quick_chat_i_need_phrase_format d11_Metal_Fragments",
  NEED_HighQualityMetal = "d11_quick_chat_i_need_phrase_format metal.refined",
  HAVE_Scrap = "d11_quick_chat_i_have_phrase_format d11_Scrap",
  HAVE_LowGradeFuel = "d11_quick_chat_i_have_phrase_format lowgradefuel",
  HAVE_Food = "d11_quick_chat_i_have_phrase_format d11_Food",
  HAVE_Water = "d11_quick_chat_i_have_phrase_format d11_Water",
  HAVE_HuntingBow = "d11_quick_chat_i_have_phrase_format bow.hunting",
  HAVE_Pickaxe = "d11_quick_chat_i_have_phrase_format pickaxe",
  HAVE_Hatchet = "d11_quick_chat_i_have_phrase_format hatchet",
  HAVE_HighQualityMetal = "d11_quick_chat_i_have_phrase_format metal.refined",
}

export enum RCEIntent {
  All = "ALL",
  ConsoleMessages = "CONSOLE_MESSAGES",
  ServiceState = "SERVICE_STATE",
  ServiceSensors = "SERVICE_SENSORS",
}

export enum LogLevel {
  None = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4,
}

export const RegularExpressions: { [key: string]: RegExp } = {
  AIO_RPC_Error: new RegExp(/status\s*=\s*([^\n]+)\s+details\s*=\s*"([^"]+)"/),
  Log: new RegExp(/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}):LOG:[^:]+: (.+)$/),
  CommandExecuting: new RegExp(/Executing console system command '([^']+)'/),
  VendingMachineName: new RegExp(
    /\[VENDING MACHINE\] Player \[ ([^\]]+) \] changed name from \[ ([^\]]+) \] to \[ ([^\]]+) \]/
  ),
  QuickChat: new RegExp(/(\[CHAT (TEAM|SERVER|LOCAL)\]) ([\w\s\-_]+) : (.+)/),
  CustomZoneCreated: new RegExp(/Successfully created zone \[([\w\d\s_-]+)\]/),
  CustomZoneRemoved: new RegExp(/Successfully removed zone \[([\w\d\s_-]+)\]/),
  PlayerRoleAdd: new RegExp(
    /\[?SERVER\]?\s*Added\s*\[([^\]]+)\](?::\[([^\]]+)\])?\s*(?:to\s*(?:Group\s*)?)?\[(\w+)\]/i
  ),
  ItemSpawn: new RegExp(
    /\bgiving ([\w\s_-]+) ([\d.]+) x ([\w\s-]+(?: [\w\s-]+)*)\b/
  ),
  NoteEdit: new RegExp(
    /\[NOTE PANEL\] Player \[ ([^\]]+) \] changed name from \[\s*([\s\S]*?)\s*\] to \[\s*([\s\S]*?)\s*\]/
  ),
  TeamCreate: new RegExp(/\[([^\]]+)\] created a new team, ID: (\d+)/),
  TeamJoin: new RegExp(
    /\[([^\]]+)\] has joined \[([^\]]+)]s team, ID: \[(\d+)\]/
  ),
  TeamLeave: new RegExp(
    /\[([^\]]+)\] has left \[([^\]]+)]s team, ID: \[(\d+)\]/
  ),
  KitSpawn: new RegExp(/SERVER giving (.+?) kit (\w+)/),
  KitGive: new RegExp(
    /\[ServerVar\] ([\w\s_-]+) giving ([\w\s_-]+) kit ([\w\s_-]+)/
  ),
  SpecialEventSet: new RegExp(/Setting event as :(\w+)/),
};
