import { KillPlayer, KillPlayerType } from "../types";

const killData = [
  {
    id: "thirst",
    name: "Thirst",
    type: KillPlayerType.Natural,
  },
  {
    id: "hunger",
    name: "Hunger",
    type: KillPlayerType.Natural,
  },
  {
    id: "guntrap.deployed",
    name: "Shotgun Trap",
    type: KillPlayerType.Entity,
  },
  {
    id: "pee pee 9000",
    name: "Pee Pee 9000",
    type: KillPlayerType.Natural,
  },
  {
    id: "barricade.wood",
    name: "Wooden Barricade",
    type: KillPlayerType.Entity,
  },
  {
    id: "wall.external.high.stone",
    name: "High External Stone Wall",
    type: KillPlayerType.Entity,
  },
  {
    id: "wall.external.high",
    name: "High External Wooden Wall",
    type: KillPlayerType.Entity,
  },
  {
    id: "gates.external.high.wood",
    name: "High External Wooden Gate",
    type: KillPlayerType.Entity,
  },
  {
    id: "gates.external.high.stone",
    name: "High External Stone Gate",
    type: KillPlayerType.Entity,
  },
  {
    id: "gates.external.high.wood (entity)",
    name: "High External Wooden Gate",
    type: KillPlayerType.Entity,
  },
  {
    id: "gates.external.high.stone (entity)",
    name: "High External Stone Gate",
    type: KillPlayerType.Entity,
  },
  {
    id: "bear",
    name: "Bear",
    type: KillPlayerType.Npc,
  },
  {
    id: "autoturret_deployed",
    name: "Auto Turret",
    type: KillPlayerType.Entity,
  },
  {
    id: "cold",
    name: "Cold",
    type: KillPlayerType.Natural,
  },
  {
    id: "bleeding",
    name: "Bleeding",
    type: KillPlayerType.Natural,
  },
  {
    id: "boar",
    name: "Boar",
    type: KillPlayerType.Npc,
  },
  {
    id: "wolf",
    name: "Wolf",
    type: KillPlayerType.Npc,
  },
  {
    id: "fall",
    name: "Fall",
    type: KillPlayerType.Natural,
  },
  {
    id: "drowned",
    name: "Drowned",
    type: KillPlayerType.Natural,
  },
  {
    id: "radiation",
    name: "Radiation",
    type: KillPlayerType.Natural,
  },
  {
    id: "autoturret_deployed (entity)",
    name: "Auto Turret",
    type: KillPlayerType.Entity,
  },
  {
    id: "bear (bear)",
    name: "Bear",
    type: KillPlayerType.Npc,
  },
  {
    id: "boar (boar)",
    name: "Boar",
    type: KillPlayerType.Npc,
  },
  {
    id: "wolf (wolf)",
    name: "Wolf",
    type: KillPlayerType.Npc,
  },
  {
    id: "guntrap.deployed (entity)",
    name: "Shotgun Trap",
    type: KillPlayerType.Entity,
  },
  {
    id: "fall!",
    name: "Fall",
    type: KillPlayerType.Natural,
  },
  {
    id: "lock.code (entity)",
    name: "Code Lock",
    type: KillPlayerType.Entity,
  },
  {
    id: "bradleyapc (entity)",
    name: "Bradley APC",
    type: KillPlayerType.Npc,
  },
  {
    id: "wall.external.high.stone (entity)",
    name: "High External Stone Wall",
    type: KillPlayerType.Entity,
  },
  {
    id: "wall.external.high (entity)",
    name: "High External Wooden Wall",
    type: KillPlayerType.Entity,
  },
  {
    id: "barricade.metal (entity)",
    name: "Metal Barricade",
    type: KillPlayerType.Entity,
  },
  {
    id: "spikes.floor (entity)",
    name: "Floor Spikes",
    type: KillPlayerType.Entity,
  },
  {
    id: "sentry.bandit.static (entity)",
    name: "Bandit Sentry",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-1 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-2 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-3 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-4 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-5 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-6 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "cactus-7 (entity)",
    name: "Cactus",
    type: KillPlayerType.Entity,
  },
  {
    id: "landmine (entity)",
    name: "Landmine",
    type: KillPlayerType.Entity,
  },
  {
    id: "sentry.scientist.static (entity)",
    name: "Scientist Sentry",
    type: KillPlayerType.Entity,
  },
  {
    id: "patrolhelicopter (entity)",
    name: "Patrol Helicopter",
    type: KillPlayerType.Npc,
  },
  {
    id: "flameturret.deployed (entity)",
    name: "Flame Turret",
    type: KillPlayerType.Entity,
  },
  {
    id: "oilfireballsmall (entity)",
    name: "Small Oil Fire",
    type: KillPlayerType.Entity,
  },
  {
    id: "napalm (entity)",
    name: "Napalm",
    type: KillPlayerType.Entity,
  },
  {
    id: "cargoshipdynamic2 (entity)",
    name: "Cargo Ship",
    type: KillPlayerType.Entity,
  },
  {
    id: "cargoshipdynamic1 (entity)",
    name: "Cargo Ship",
    type: KillPlayerType.Entity,
  },
  {
    id: "barricade.wood (entity)",
    name: "Wooden Barricade",
    type: KillPlayerType.Entity,
  },
  {
    id: "beartrap (entity)",
    name: "Bear Trap",
    type: KillPlayerType.Entity,
  },
  {
    id: "barricade.woodwire (entity)",
    name: "Wooden Barricade",
    type: KillPlayerType.Entity,
  },
  {
    id: "campfire (entity)",
    name: "Campfire",
    type: KillPlayerType.Entity,
  },
  {
    id: "rocket_crane_lift_trigger (entity)",
    name: "Crane Lift",
    type: KillPlayerType.Entity,
  },
  {
    id: "rowboat (entity)",
    name: "Rowboat",
    type: KillPlayerType.Entity,
  },
  {
    id: "fireball (entity)",
    name: "Fireball",
    type: KillPlayerType.Entity,
  },
  {
    id: "teslacoil.deployed (entity)",
    name: "Tesla Coil",
    type: KillPlayerType.Entity,
  },
] as const;

export type killData =
  | (typeof killData)[number]
  | {
      id: number;
      name: "Scientist";
      type: KillPlayerType.Npc;
    }
  | {
      id: string;
      name: string;
      type: KillPlayerType.Player;
    };

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
        type: KillPlayerType.Npc,
        name: "Scientist",
      };
    }

    return {
      id: ign,
      type: KillPlayerType.Player,
      name: ign,
    };
  }
}
