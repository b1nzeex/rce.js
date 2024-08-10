import { KillPlayer } from "../types";

interface KillData {
  id: string;
  name: string;
  type: "player" | "npc" | "entity" | "natural";
}

const killData: KillData[] = [
  {
    id: "thirst",
    name: "Thirst",
    type: "natural",
  },
  {
    id: "hunger",
    name: "Hunger",
    type: "natural",
  },
  {
    id: "guntrap.deployed",
    name: "Shotgun Trap",
    type: "entity",
  },
  {
    id: "pee pee 9000",
    name: "Pee Pee 9000",
    type: "natural",
  },
  {
    id: "barricade.wood",
    name: "Wooden Barricade",
    type: "entity",
  },
  {
    id: "wall.external.high.stone",
    name: "High External Stone Wall",
    type: "entity",
  },
  {
    id: "wall.external.high",
    name: "High External Wooden Wall",
    type: "entity",
  },
  {
    id: "gates.external.high.wood",
    name: "High External Wooden Gate",
    type: "entity",
  },
  {
    id: "gates.external.high.stone",
    name: "High External Stone Gate",
    type: "entity",
  },
  {
    id: "gates.external.high.wood (entity)",
    name: "High External Wooden Gate",
    type: "entity",
  },
  {
    id: "gates.external.high.stone (entity)",
    name: "High External Stone Gate",
    type: "entity",
  },
  {
    id: "bear",
    name: "Bear",
    type: "npc",
  },
  {
    id: "autoturret_deployed",
    name: "Auto Turret",
    type: "entity",
  },
  {
    id: "cold",
    name: "Cold",
    type: "natural",
  },
  {
    id: "bleeding",
    name: "Bleeding",
    type: "natural",
  },
  {
    id: "boar",
    name: "Boar",
    type: "npc",
  },
  {
    id: "wolf",
    name: "Wolf",
    type: "npc",
  },
  {
    id: "fall",
    name: "Fall",
    type: "natural",
  },
  {
    id: "drowned",
    name: "Drowned",
    type: "natural",
  },
  {
    id: "radiation",
    name: "Radiation",
    type: "natural",
  },
  {
    id: "autoturret_deployed (entity)",
    name: "Auto Turret",
    type: "entity",
  },
  {
    id: "bear (bear)",
    name: "Bear",
    type: "npc",
  },
  {
    id: "boar (boar)",
    name: "Boar",
    type: "npc",
  },
  {
    id: "wolf (wolf)",
    name: "Wolf",
    type: "npc",
  },
  {
    id: "guntrap.deployed (entity)",
    name: "Shotgun Trap",
    type: "entity",
  },
  {
    id: "fall!",
    name: "Fall",
    type: "natural",
  },
  {
    id: "lock.code (entity)",
    name: "Code Lock",
    type: "entity",
  },
  {
    id: "bradleyapc (entity)",
    name: "Bradley APC",
    type: "npc",
  },
  {
    id: "wall.external.high.stone (entity)",
    name: "High External Stone Wall",
    type: "entity",
  },
  {
    id: "wall.external.high (entity)",
    name: "High External Wooden Wall",
    type: "entity",
  },
  {
    id: "barricade.metal (entity)",
    name: "Metal Barricade",
    type: "entity",
  },
  {
    id: "spikes.floor (entity)",
    name: "Floor Spikes",
    type: "entity",
  },
  {
    id: "sentry.bandit.static (entity)",
    name: "Bandit Sentry",
    type: "entity",
  },
  {
    id: "cactus-1 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "cactus-2 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "cactus-3 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "cactus-4 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "cactus-5 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "cactus-6 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "cactus-7 (entity)",
    name: "Cactus",
    type: "entity",
  },
  {
    id: "landmine (entity)",
    name: "Landmine",
    type: "entity",
  },
  {
    id: "sentry.scientist.static (entity)",
    name: "Scientist Sentry",
    type: "entity",
  },
  {
    id: "patrolhelicopter (entity)",
    name: "Patrol Helicopter",
    type: "npc",
  },
  {
    id: "flameturret.deployed (entity)",
    name: "Flame Turret",
    type: "entity",
  },
  {
    id: "oilfireballsmall (entity)",
    name: "Small Oil Fire",
    type: "entity",
  },
  {
    id: "napalm (entity)",
    name: "Napalm",
    type: "entity",
  },
  {
    id: "cargoshipdynamic2 (entity)",
    name: "Cargo Ship",
    type: "entity",
  },
  {
    id: "cargoshipdynamic1 (entity)",
    name: "Cargo Ship",
    type: "entity",
  },
  {
    id: "barricade.wood (entity)",
    name: "Wooden Barricade",
    type: "entity",
  },
  {
    id: "beartrap (entity)",
    name: "Bear Trap",
    type: "entity",
  },
  {
    id: "barricade.woodwire (entity)",
    name: "Wooden Barricade",
    type: "entity",
  },
  {
    id: "campfire (entity)",
    name: "Campfire",
    type: "entity",
  },
  {
    id: "rocket_crane_lift_trigger (entity)",
    name: "Crane Lift",
    type: "entity",
  },
  {
    id: "rowboat (entity)",
    name: "Rowboat",
    type: "entity",
  },
  {
    id: "fireball (entity)",
    name: "Fireball",
    type: "entity",
  },
  {
    id: "teslacoil.deployed (entity)",
    name: "Tesla Coil",
    type: "entity",
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
        type: "npc",
        name: "Scientist",
      };
    }

    return {
      id: ign,
      type: "player",
      name: ign,
    };
  }
}
