import { type } from "os";
import WeaponData from "../schemas/Trees/Node/Data/WeaponData";
import Node from "../schemas/Trees/Node/Node";
import SkillData from "../schemas/Trees/Node/Data/SkillData";
import GameManager from "./GameManager";
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

// ------------ interfaces for the EffectLogic Manager -------------- //
