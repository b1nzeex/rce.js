import { KillPlayer, KillPlayerType } from "../types";
declare const killData: readonly [{
    readonly id: "thirst";
    readonly name: "Thirst";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "hunger";
    readonly name: "Hunger";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "guntrap.deployed";
    readonly name: "Shotgun Trap";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "pee pee 9000";
    readonly name: "Pee Pee 9000";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "barricade.wood";
    readonly name: "Wooden Barricade";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "wall.external.high.stone";
    readonly name: "High External Stone Wall";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "wall.external.high";
    readonly name: "High External Wooden Wall";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "gates.external.high.wood";
    readonly name: "High External Wooden Gate";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "gates.external.high.stone";
    readonly name: "High External Stone Gate";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "gates.external.high.wood (entity)";
    readonly name: "High External Wooden Gate";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "gates.external.high.stone (entity)";
    readonly name: "High External Stone Gate";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "bear";
    readonly name: "Bear";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "autoturret_deployed";
    readonly name: "Auto Turret";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cold";
    readonly name: "Cold";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "bleeding";
    readonly name: "Bleeding";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "boar";
    readonly name: "Boar";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "wolf";
    readonly name: "Wolf";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "fall";
    readonly name: "Fall";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "drowned";
    readonly name: "Drowned";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "radiation";
    readonly name: "Radiation";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "autoturret_deployed (entity)";
    readonly name: "Auto Turret";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "bear (bear)";
    readonly name: "Bear";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "boar (boar)";
    readonly name: "Boar";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "wolf (wolf)";
    readonly name: "Wolf";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "guntrap.deployed (entity)";
    readonly name: "Shotgun Trap";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "fall!";
    readonly name: "Fall";
    readonly type: KillPlayerType.NATURAL;
}, {
    readonly id: "lock.code (entity)";
    readonly name: "Code Lock";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "bradleyapc (entity)";
    readonly name: "Bradley APC";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "wall.external.high.stone (entity)";
    readonly name: "High External Stone Wall";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "wall.external.high (entity)";
    readonly name: "High External Wooden Wall";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "barricade.metal (entity)";
    readonly name: "Metal Barricade";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "spikes.floor (entity)";
    readonly name: "Floor Spikes";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "sentry.bandit.static (entity)";
    readonly name: "Bandit Sentry";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-1 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-2 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-3 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-4 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-5 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-6 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cactus-7 (entity)";
    readonly name: "Cactus";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "landmine (entity)";
    readonly name: "Landmine";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "sentry.scientist.static (entity)";
    readonly name: "Scientist Sentry";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "patrolhelicopter (entity)";
    readonly name: "Patrol Helicopter";
    readonly type: KillPlayerType.NPC;
}, {
    readonly id: "flameturret.deployed (entity)";
    readonly name: "Flame Turret";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "oilfireballsmall (entity)";
    readonly name: "Small Oil Fire";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "napalm (entity)";
    readonly name: "Napalm";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cargoshipdynamic2 (entity)";
    readonly name: "Cargo Ship";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "cargoshipdynamic1 (entity)";
    readonly name: "Cargo Ship";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "barricade.wood (entity)";
    readonly name: "Wooden Barricade";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "beartrap (entity)";
    readonly name: "Bear Trap";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "barricade.woodwire (entity)";
    readonly name: "Wooden Barricade";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "campfire (entity)";
    readonly name: "Campfire";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "rocket_crane_lift_trigger (entity)";
    readonly name: "Crane Lift";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "rowboat (entity)";
    readonly name: "Rowboat";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "fireball (entity)";
    readonly name: "Fireball";
    readonly type: KillPlayerType.ENTITY;
}, {
    readonly id: "teslacoil.deployed (entity)";
    readonly name: "Tesla Coil";
    readonly type: KillPlayerType.ENTITY;
}];
export type killData = (typeof killData)[number] | {
    id: number;
    name: "Scientist";
    type: KillPlayerType.NPC;
} | {
    id: string;
    name: string;
    type: KillPlayerType.PLAYER;
};
export default class Helper {
    static getKillInformation(ign: string): KillPlayer;
}
export {};
