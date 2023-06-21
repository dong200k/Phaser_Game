import WeaponData from "../schemas/Trees/Node/Data/WeaponData";
import Node from "../schemas/Trees/Node/Node";
import SkillData from "../schemas/Trees/Node/Data/SkillData";
import ContinuousUpgradeEffect from "../schemas/effects/continuous/ContinuousUpgradeEffect";
import OneTimeUpgradeEffect from "../schemas/effects/onetime/OneTimeUpgradeEffect";
import TriggerUpgradeEffect from "../schemas/effects/trigger/TriggerUpgradeEffect";
import Stat, { statType } from "../schemas/gameobjs/Stat";
import { CategoryType } from "./Collisions/Category";
import { Velocity } from "../schemas/gameobjs/GameObject";
import Entity from "../schemas/gameobjs/Entity";

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

// export type dbUpgradeEffect = {
//     effectLogicId: string,
//     cooldown: number,
//     doesStack: boolean,
//     collisionGroup: number,
//     type: "player attack" | "none"
// }

// ------------ interfaces for Upgrade Effects -------------- //
export type IUpgradeEffect = TriggerUpgradeEffect | ContinuousUpgradeEffect | OneTimeUpgradeEffect
export type ITriggerType = "player skill" | "player attack" | "none"

// ------------ interfaces for Projectiles -------------- //
export type IProjectileConfig = {
    sprite: string,
    stat: Stat,
    spawnX: number,
    spawnY: number,
    width: number,
    height: number,
    initialVelocity: {x: number, y: number},
    collisionCategory: CategoryType,
    entity?: Entity,
    poolType: string,
    activeTime?: number,
    range?: number,
    /** data is used to pass extra parameters to subclasses of projectile */
    data?: any
}
