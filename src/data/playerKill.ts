import type { IKillPlayer } from "../types";

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
  {
    id: "hotairballoon (entity)",
    name: "Hot Air Balloon",
    type: PlayerKillType.Entity,
  },
  {
    id: "minicopter.entity (entity)",
    name: "Minicopter",
    type: PlayerKillType.Entity,
  },
  {
    id: "attackhelicopter.entity (entity)",
    name: "Attack Helicopter",
    type: PlayerKillType.Entity,
  },
  {
    id: "scraptransporthelicopter (entity)",
    name: "Scrap Transport Helicopter",
    type: PlayerKillType.Entity,
  },
  {
    id: "sam_site_turret_deployed (entity)",
    name: "Sam Site",
    type: PlayerKillType.Entity,
  },
  {
    id: "sam_static (entity)",
    name: "Sam Site",
    type: PlayerKillType.Entity,
  },
  {
    id: "wall.external.high.wood (entity)",
    name: "High External Wooden Wall",
    type: PlayerKillType.Entity,
  },
  {
    id: "icewall (entity)",
    name: "Ice Wall",
    type: PlayerKillType.Entity,
  },
  {
    id: "wall.external.high.ice (entity)",
    name: "High External Ice Wall",
    type: PlayerKillType.Entity,
  },
  {
    id: "wall.external.high.adobe (entity)",
    name: "High External Adobe Wall",
    type: PlayerKillType.Entity,
  },
  {
    id: "flameturret_fireball (entity)",
    name: "Flame Turret",
    type: PlayerKillType.Entity,
  },
  {
    id: "ch47scientists.entity (entity)",
    name: "Chinook Scientist",
    type: PlayerKillType.Entity,
  },
  {
    id: "submarinesolo.entity (entity)",
    name: "Submarine",
    type: PlayerKillType.Entity,
  },
  {
    id: "submarineduo.entity (entity)",
    name: "Submarine",
    type: PlayerKillType.Entity,
  },
  {
    id: "gates.external.high.adobe (entity)",
    name: "High External Adobe Gate",
    type: PlayerKillType.Entity,
  },
  {
    id: "graveyardfence (entity)",
    name: "Graveyard Fence",
    type: PlayerKillType.Entity,
  },
  {
    id: "fireball_small (entity)",
    name: "Fireball",
    type: PlayerKillType.Entity,
  },
  {
    id: "fireball_small (entity)",
    name: "Fireball",
    type: PlayerKillType.Entity,
  },
];

export function getKill(ign: string): IKillPlayer {
  const data = playerKillData.find((e) => e.id === ign.toLowerCase());
  if (data) {
    return {
      id: ign,
      name: data.name,
      type: data.type,
    };
  }

  if (Number(ign)) {
    return {
      id: ign,
      name: "Scientist",
      type: PlayerKillType.Npc,
    };
  }

  return {
    id: ign,
    name: ign,
    type: PlayerKillType.Player,
  };
}
