export declare enum GPORTALRoutes {
    Command = "https://www.g-portal.com/ngpapi/",
    Refresh = "https://auth.g-portal.com/auth/realms/master/protocol/openid-connect/token",
    WebSocket = "wss://www.g-portal.com/ngpapi/",
    Origin = "https://www.g-portal.com",
    Home = "https://www.g-portal.com/en"
}
export declare enum GPORTALWebsocketTypes {
    Init = "connection_init",
    Start = "start"
}
export declare enum LogLevel {
    None = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4,
    Custom = 5
}
export declare enum RCEEvent {
    Message = "message",
    PlayerKill = "player_kill",
    PlayerJoined = "player_joined",
    PlayerRespawned = "player_respawned",
    PlayerSuicide = "player_suicide",
    PlayerRoleAdd = "player_role_add",
    QuickChat = "quick_chat",
    NoteEdit = "note_edit",
    EventStart = "event_start",
    PlayerlistUpdate = "playerlist_update",
    ItemSpawn = "item_spawn",
    VendingMachineName = "vending_machine_name",
    KitSpawn = "kit_spawn",
    KitGive = "kit_give",
    TeamCreate = "team_create",
    TeamJoin = "team_join",
    TeamLeave = "team_leave",
    SpecialEventStart = "special_event_start",
    SpecialEventEnd = "special_event_end",
    ExecutingCommand = "executing_command",
    Error = "error",
    Log = "log"
}
export declare enum QuickChat {
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
    HAVE_HighQualityMetal = "d11_quick_chat_i_have_phrase_format metal.refined"
}
export declare const EVENTS: {
    event_airdrop: {
        name: string;
        special: boolean;
    };
    event_cargoship: {
        name: string;
        special: boolean;
    };
    event_cargoheli: {
        name: string;
        special: boolean;
    };
    event_helicopter: {
        name: string;
        special: boolean;
    };
    event_halloween: {
        name: string;
        special: boolean;
    };
    event_xmas: {
        name: string;
        special: boolean;
    };
    event_easter: {
        name: string;
        special: boolean;
    };
};
