"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const killData = [
    {
        id: "thirst",
        name: "Thirst",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "hunger",
        name: "Hunger",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "guntrap.deployed",
        name: "Shotgun Trap",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "pee pee 9000",
        name: "Pee Pee 9000",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "barricade.wood",
        name: "Wooden Barricade",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "wall.external.high.stone",
        name: "High External Stone Wall",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "wall.external.high",
        name: "High External Wooden Wall",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "gates.external.high.wood",
        name: "High External Wooden Gate",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "gates.external.high.stone",
        name: "High External Stone Gate",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "gates.external.high.wood (entity)",
        name: "High External Wooden Gate",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "gates.external.high.stone (entity)",
        name: "High External Stone Gate",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "bear",
        name: "Bear",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "autoturret_deployed",
        name: "Auto Turret",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cold",
        name: "Cold",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "bleeding",
        name: "Bleeding",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "boar",
        name: "Boar",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "wolf",
        name: "Wolf",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "fall",
        name: "Fall",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "drowned",
        name: "Drowned",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "radiation",
        name: "Radiation",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "autoturret_deployed (entity)",
        name: "Auto Turret",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "bear (bear)",
        name: "Bear",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "boar (boar)",
        name: "Boar",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "wolf (wolf)",
        name: "Wolf",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "guntrap.deployed (entity)",
        name: "Shotgun Trap",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "fall!",
        name: "Fall",
        type: types_1.KillPlayerType.Natural,
    },
    {
        id: "lock.code (entity)",
        name: "Code Lock",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "bradleyapc (entity)",
        name: "Bradley APC",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "wall.external.high.stone (entity)",
        name: "High External Stone Wall",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "wall.external.high (entity)",
        name: "High External Wooden Wall",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "barricade.metal (entity)",
        name: "Metal Barricade",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "spikes.floor (entity)",
        name: "Floor Spikes",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "sentry.bandit.static (entity)",
        name: "Bandit Sentry",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-1 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-2 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-3 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-4 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-5 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-6 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cactus-7 (entity)",
        name: "Cactus",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "landmine (entity)",
        name: "Landmine",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "sentry.scientist.static (entity)",
        name: "Scientist Sentry",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "patrolhelicopter (entity)",
        name: "Patrol Helicopter",
        type: types_1.KillPlayerType.Npc,
    },
    {
        id: "flameturret.deployed (entity)",
        name: "Flame Turret",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "oilfireballsmall (entity)",
        name: "Small Oil Fire",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "napalm (entity)",
        name: "Napalm",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cargoshipdynamic2 (entity)",
        name: "Cargo Ship",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "cargoshipdynamic1 (entity)",
        name: "Cargo Ship",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "barricade.wood (entity)",
        name: "Wooden Barricade",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "beartrap (entity)",
        name: "Bear Trap",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "barricade.woodwire (entity)",
        name: "Wooden Barricade",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "campfire (entity)",
        name: "Campfire",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "rocket_crane_lift_trigger (entity)",
        name: "Crane Lift",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "rowboat (entity)",
        name: "Rowboat",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "fireball (entity)",
        name: "Fireball",
        type: types_1.KillPlayerType.Entity,
    },
    {
        id: "teslacoil.deployed (entity)",
        name: "Tesla Coil",
        type: types_1.KillPlayerType.Entity,
    },
];
class Helper {
    static getKillInformation(ign) {
        const data = killData.find((e) => e.id === ign.toLowerCase());
        if (data) {
            return {
                id: ign,
                type: data.type,
                name: data.name,
            };
        }
        if (Number(ign)) {
            return {
                id: ign,
                type: types_1.KillPlayerType.Npc,
                name: "Scientist",
            };
        }
        return {
            id: ign,
            type: types_1.KillPlayerType.Player,
            name: ign,
        };
    }
}
exports.default = Helper;
//# sourceMappingURL=Helper.js.map