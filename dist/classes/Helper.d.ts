import { KillPlayer, KillPlayerType } from "../types";
declare const killData: readonly [{
    readonly id: "thirst";
    readonly name: "Thirst";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "hunger";
    readonly name: "Hunger";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "guntrap.deployed";
    readonly name: "Shotgun Trap";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "pee pee 9000";
    readonly name: "Pee Pee 9000";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "barricade.wood";
    readonly name: "Wooden Barricade";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "wall.external.high.stone";
    readonly name: "High External Stone Wall";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "wall.external.high";
    readonly name: "High External Wooden Wall";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "gates.external.high.wood";
    readonly name: "High External Wooden Gate";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "gates.external.high.stone";
    readonly name: "High External Stone Gate";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "gates.external.high.wood (entity)";
    readonly name: "High External Wooden Gate";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "gates.external.high.stone (entity)";
    readonly name: "High External Stone Gate";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "bear";
    readonly name: "Bear";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "autoturret_deployed";
    readonly name: "Auto Turret";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cold";
    readonly name: "Cold";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "bleeding";
    readonly name: "Bleeding";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "boar";
    readonly name: "Boar";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "wolf";
    readonly name: "Wolf";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "fall";
    readonly name: "Fall";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "drowned";
    readonly name: "Drowned";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "radiation";
    readonly name: "Radiation";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "autoturret_deployed (entity)";
    readonly name: "Auto Turret";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "bear (bear)";
    readonly name: "Bear";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "boar (boar)";
    readonly name: "Boar";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "wolf (wolf)";
    readonly name: "Wolf";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "guntrap.deployed (entity)";
    readonly name: "Shotgun Trap";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "fall!";
    readonly name: "Fall";
    readonly type: KillPlayerType.Natural;
}, {
    readonly id: "lock.code (entity)";
    readonly name: "Code Lock";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "bradleyapc (entity)";
    readonly name: "Bradley APC";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "wall.external.high.stone (entity)";
    readonly name: "High External Stone Wall";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "wall.external.high (entity)";
    readonly name: "High External Wooden Wall";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "barricade.metal (entity)";
    readonly name: "Metal Barricade";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "spikes.floor (entity)";
    readonly name: "Floor Spikes";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "sentry.bandit.static (entity)";
    readonly name: "Bandit Sentry";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-1 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-2 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-3 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-4 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-5 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-6 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cactus-7 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "landmine (entity)";
    readonly name: "Landmine";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "sentry.scientist.static (entity)";
    readonly name: "Scientist Sentry";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "patrolhelicopter (entity)";
    readonly name: "Patrol Helicopter";
    readonly type: KillPlayerType.Npc;
}, {
    readonly id: "flameturret.deployed (entity)";
    readonly name: "Flame Turret";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "oilfireballsmall (entity)";
    readonly name: "Small Oil Fire";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "napalm (entity)";
    readonly name: "Napalm";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cargoshipdynamic2 (entity)";
    readonly name: "Cargo Ship";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "cargoshipdynamic1 (entity)";
    readonly name: "Cargo Ship";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "barricade.wood (entity)";
    readonly name: "Wooden Barricade";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "beartrap (entity)";
    readonly name: "Bear Trap";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "barricade.woodwire (entity)";
    readonly name: "Wooden Barricade";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "campfire (entity)";
    readonly name: "Campfire";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "rocket_crane_lift_trigger (entity)";
    readonly name: "Crane Lift";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "rowboat (entity)";
    readonly name: "Rowboat";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "fireball (entity)";
    readonly name: "Fireball";
    readonly type: KillPlayerType.Entity;
}, {
    readonly id: "teslacoil.deployed (entity)";
    readonly name: "Tesla Coil";
    readonly type: KillPlayerType.Entity;
}];
export type killData = (typeof killData)[number] | {
    id: number;
    name: "Scientist";
    type: KillPlayerType.Npc;
} | {
    id: string;
    name: string;
    type: KillPlayerType.Player;
};
export default class Helper {
    static getKillInformation(ign: string): KillPlayer;
}
export {};
