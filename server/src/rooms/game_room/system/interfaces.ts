import WeaponData from "../schemas/Trees/Node/Data/WeaponData";
import Node from "../schemas/Trees/Node/Node";
import SkillData from "../schemas/Trees/Node/Data/SkillData";
import ContinuousUpgradeEffect from "../schemas/effects/continuous/ContinuousUpgradeEffect";
import TriggerUpgradeEffect from "../schemas/effects/trigger/TriggerUpgradeEffect";
import Stat, { statType } from "../schemas/gameobjs/Stat";
import { CategoryType } from "./Collisions/Category";
import GameObject, { Velocity } from "../schemas/gameobjs/GameObject";
import Entity from "../schemas/gameobjs/Entity";
import MonsterController from "./AI/MonsterAI/simplemonster/MonsterController";
import { IClasses } from "../schemas/projectiles/projectileClasses";
import OneTimeUpgradeEffect from "../schemas/effects/onetime/OneTimeUpgradeEffect";
import StateMachine from "./StateMachine/StateMachine";

// ------------ Math -------------

export interface Vector2 {
    x: number;
    y: number;
}

// ------------ interfaces for the Tiled json file -------------- //
interface TiledObjectJSON {
    height: number;
    id: number;
    name: string;
    point: boolean;
    rotation: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

interface TiledLayerJSON {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
    draworder: boolean;
    objects: TiledObjectJSON[];
}

export interface TiledJSON {
    compressionLevel: number;
    editorsettings: any;
    height: number;
    infinite: boolean;
    layers: TiledLayerJSON[];
    nextlayerid: number;
    nextobjectid: number;
    orientation: string;
    renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilesets: any;
    tilewidth: number;
    type: string;
    version: number;
    width: number;
}

// ------------ interfaces for the Database Manager -------------- //
export type upgrade = {
    id: string,
    upgradeName: string,
    root: Node<WeaponData>,
    type: "artifact" | "weapon"
}

export type skillTree = {
    id: string,
    upgradeName: string,
    root: Node<SkillData>
}

export type weapon = {
    name: string, 
    description: string, 
    sprite: string, 
    projectile: string
}

export interface IMonster {

}

// Dungeon Interface
interface IWaveMonster {
    name: string;
    count: number;
    monsterId: string;
}

interface IDungeonWave {
    type: string;
    difficulty: number;
    monsters: IWaveMonster[];
}

export type IAbility = {
    id: string,
    name: string,
    description: string,
    effectLogicId: string,
    displaySprite: string,
    cooldown: number
}

export type IRole = {
    id: string,
    name: string,
    description: string,
    displaySprite: string,
    spriteKey: string,
    coinCost: number,
    weaponUpgradeId: string,
    abilityId: string,
    stat: statType
}

export interface IDungeon { 
    id: string,
    name: string,
    tilesetName: string,
    serverJsonLocation: string,
    clientTilesetLocation: string,
    waves: IDungeonWave[],
}


// export type dbUpgradeEffect = {
//     effectLogicId: string,
//     cooldown: number,
//     doesStack: boolean,
//     collisionGroup: number,
//     type: "player attack" | "none"
// }

// ------------ interfaces for Upgrade Effects -------------- //
export type IUpgradeEffect = TriggerUpgradeEffect | ContinuousUpgradeEffect | OneTimeUpgradeEffect
export type ITriggerType = "player skill" | "player attack" | "none" | "one time"

// ------------ interfaces for Projectiles -------------- //
export type IProjectileConfig = {
    sprite: string,
    stat: Stat,
    spawnX: number,
    spawnY: number,
    width?: number,
    height?: number,
    initialVelocity: {x: number, y: number},
    collisionCategory: CategoryType,
    entity?: Entity,
    poolType: string,
    activeTime?: number,
    range?: number,
    attackMultiplier: number,
    magicMultiplier: number,
    classType?: IClasses,
    originEntityId?: string,
    spawnSound?: string,
    projectileSpeed?: number,
    /** How many targets a PLAYER_PROJECTILE, MONSTER_PROJECTILE etc. can hit before going inactive. Set to -1 to hit infinite targets */
    piercing?: number,
    visible?: boolean,
    /** Set this value to to true if projectile should not despawn on colliding with an obstacle. By default it is set to false. */
    dontDespawnOnObstacleCollision?: boolean,
    /** Knockback information for this projectile. */
    knockback?: {
        /** The distance of the knockback. */
        distance: number,
        /** The direction of the knockback (optional). */
        direction?: {
            x: number,
            y: number,
        }
    }
    /** data is used to pass extra parameters to subclasses of projectile */
    data?: any
}

// ------------ interfaces for Monsters -------------- //
export type IMonsterConfig = {
    id: string;
    name: string;
    imageKey: string;
    stats: statType;
    poolType?: string;
    controllerKey?: string;
    bounds: Bounds;
}

interface Bounds {
    type: string;
    width: number;
    height: number;
}

// ------------ interfaces for Aura -------------- //
export interface IAuraConfig {
    radius?: number;
    timed?: boolean;
    timeoutTime?: number;
    color?: number;
    x?: number;
    y?: number;
    name: string;
    controller?: string;
}

// ------------ interfaces for Collision Manager -------------- //
export type ICollisionRule = {
    typeA: CategoryType, typeB: CategoryType, resolve: (gameObjectA: any, gameObjectB: any, bodyA: Matter.Body, bodyB: Matter.Body)=> void
}

export type ICollisionEndRule = {
    typeA: CategoryType, typeB: CategoryType, resolve: (gameObjectA: any, gameObjectB: any, bodyA: Matter.Body, bodyB: Matter.Body)=> void
}


// ------------ Events ------------ //
export enum GameEvents {
    /** 
     * Event to spawn a projectile.
     * @param projectileConfig - The projectile configuation object. IProjectileConfig.
     * */
    SPAWN_PROJECTILE = "SPAWN_PROJECTILE",
}