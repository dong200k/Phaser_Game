import { Schema, type } from '@colyseus/schema';
import Stat from '../Stat';
import Player from '../Player';
import BaseWeapon from './BaseWeapon';

export default class UpgradeableWeapon extends Schema {
    @type(Stat) stat

    private upgradePath?: UpgradePath
    private upgradeHistory?: Number[]
    private owner?: Player
    private bonusStats?: Stat
    private base?: BaseWeapon

    constructor(base?: BaseWeapon, bonusStats?: Stat, upgradePath?: UpgradePath, upgradeHistory?: Number[], owner?: Player) {
        super(0, 0);
        this.stat = new Stat();
        this.base = base;
        this.bonusStats = bonusStats;
        this.upgradePath = upgradePath;
        this.upgradeHistory = upgradeHistory;
        this.owner = owner;
    }
}

class UpgradePath {
    private upgrades?: Array<Array<BaseWeapon | Stat>>
    private name?: string
    private type?: "Artifact" | "Main"

    constructor(upgrades: Array<Array<BaseWeapon | Stat>>, name: string, type: "Artifact" | "Main"){
        this.upgrades = upgrades;
        this.name = name;
        this.type = type;
    }
}