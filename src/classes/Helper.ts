import { KillPlayer, KillPlayerType } from "../types";

interface KillData {
  id: string;
  name: string;
  type: KillPlayerType;
}

const killData: KillData[] = [
  {
    id: "thirst",
    name: "Thirst",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "hunger",
    name: "Hunger",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "guntrap.deployed",
    name: "Shotgun Trap",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "pee pee 9000",
    name: "Pee Pee 9000",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "barricade.wood",
    name: "Wooden Barricade",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "wall.external.high.stone",
    name: "High External Stone Wall",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "wall.external.high",
    name: "High External Wooden Wall",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "gates.external.high.wood",
    name: "High External Wooden Gate",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "gates.external.high.stone",
    name: "High External Stone Gate",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "gates.external.high.wood (entity)",
    name: "High External Wooden Gate",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "gates.external.high.stone (entity)",
    name: "High External Stone Gate",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "bear",
    name: "Bear",
    type: KillPlayerType.NPC,
  },
  {
    id: "autoturret_deployed",
    name: "Auto Turret",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cold",
    name: "Cold",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "bleeding",
    name: "Bleeding",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "boar",
    name: "Boar",
    type: KillPlayerType.NPC,
  },
  {
    id: "wolf",
    name: "Wolf",
    type: KillPlayerType.NPC,
  },
  {
    id: "fall",
    name: "Fall",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "drowned",
    name: "Drowned",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "radiation",
    name: "Radiation",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "autoturret_deployed (entity)",
    name: "Auto Turret",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "bear (bear)",
    name: "Bear",
    type: KillPlayerType.NPC,
  },
  {
    id: "boar (boar)",
    name: "Boar",
    type: KillPlayerType.NPC,
  },
  {
    id: "wolf (wolf)",
    name: "Wolf",
    type: KillPlayerType.NPC,
  },
  {
    id: "guntrap.deployed (entity)",
    name: "Shotgun Trap",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "fall!",
    name: "Fall",
    type: KillPlayerType.NATURAL,
  },
  {
    id: "lock.code (entity)",
    name: "Code Lock",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "bradleyapc (entity)",
    name: "Bradley APC",
    type: KillPlayerType.NPC,
  },
  {
    id: "wall.external.high.stone (entity)",
    name: "High External Stone Wall",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "wall.external.high (entity)",
    name: "High External Wooden Wall",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "barricade.metal (entity)",
    name: "Metal Barricade",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "spikes.floor (entity)",
    name: "Floor Spikes",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "sentry.bandit.static (entity)",
    name: "Bandit Sentry",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-1 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-2 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-3 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-4 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-5 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-6 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cactus-7 (entity)",
    name: "Cactus",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "landmine (entity)",
    name: "Landmine",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "sentry.scientist.static (entity)",
    name: "Scientist Sentry",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "patrolhelicopter (entity)",
    name: "Patrol Helicopter",
    type: KillPlayerType.NPC,
  },
  {
    id: "flameturret.deployed (entity)",
    name: "Flame Turret",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "oilfireballsmall (entity)",
    name: "Small Oil Fire",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "napalm (entity)",
    name: "Napalm",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cargoshipdynamic2 (entity)",
    name: "Cargo Ship",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "cargoshipdynamic1 (entity)",
    name: "Cargo Ship",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "barricade.wood (entity)",
    name: "Wooden Barricade",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "beartrap (entity)",
    name: "Bear Trap",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "barricade.woodwire (entity)",
    name: "Wooden Barricade",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "campfire (entity)",
    name: "Campfire",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "rocket_crane_lift_trigger (entity)",
    name: "Crane Lift",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "rowboat (entity)",
    name: "Rowboat",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "fireball (entity)",
    name: "Fireball",
    type: KillPlayerType.ENTITY,
  },
  {
    id: "teslacoil.deployed (entity)",
    name: "Tesla Coil",
    type: KillPlayerType.ENTITY,
  },
];

export default class Helper {
  public static getKillInformation(ign: string): KillPlayer {
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
        type: KillPlayerType.NPC,
        name: "Scientist",
      };
    }

    return {
      id: ign,
      type: KillPlayerType.PLAYER,
      name: ign,
    };
  }
}
