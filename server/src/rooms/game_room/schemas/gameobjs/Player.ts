import { Schema, type } from '@colyseus/schema';
import Entity from './Entity';
import Cooldown from './Cooldown';
import WeaponUpgradeTree from '../Trees/WeaponUpgradeTree';
import Weapon from './Weapon';

export default class Player extends Entity {
    @type('string') name;
    @type('string') role;
    @type(Cooldown) attackCooldown;
    @type(Cooldown) specialCooldown;
    @type(WeaponUpgradeTree) weaponUpgradeTree;
    @type(Weapon) weapon;


    constructor(name: string, role?: string) {
        super();
        this.name = name;
        this.role = role? role: "ranger"
        this.attackCooldown = new Cooldown(1000)
        this.specialCooldown = new Cooldown(5000)
        this.type = "Player";
        this.weaponUpgradeTree = new WeaponUpgradeTree()
        this.weapon = new Weapon()
    }
}