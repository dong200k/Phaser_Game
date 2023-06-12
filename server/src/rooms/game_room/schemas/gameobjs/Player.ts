import { ArraySchema, type } from '@colyseus/schema';
import Entity from './Entity';
import Cooldown from './Cooldown';
import Weapon from './Weapon';
import StatTree from '../Trees/StatTree';
import WeaponData from '../Trees/Node/Data/WeaponData';
import SkillData from '../Trees/Node/Data/SkillData';
import WeaponUpgradeTree from '../Trees/WeaponUpgradeTree';
import ArtifactManager from '../../system/StateManagers/ArtifactManager';
import Node from '../Trees/Node/Node';

export default class Player extends Entity {
    @type('string') name;
    @type('string') role;
    // @type(Cooldown) attackCooldown;
    // @type(Cooldown) specialCooldown;
    @type(WeaponUpgradeTree) weaponUpgradeTree;
    @type(StatTree) skillTree;
    @type(Weapon) weapon;
    @type([WeaponUpgradeTree]) artifacts = new ArraySchema<WeaponUpgradeTree>();


    constructor(name: string, role?: string) {
        super();
        this.name = name;
        this.role = role? role: "ranger"
        // this.attackCooldown = new Cooldown(1000)
        // this.specialCooldown = new Cooldown(5000)
        this.type = "Player";
        this.weaponUpgradeTree = new WeaponUpgradeTree(this)
        this.skillTree = new StatTree<SkillData>()
        this.weapon = new Weapon()
    }
}