import { ArraySchema, type } from '@colyseus/schema';
import Entity from './Entity';
import StatTree from '../Trees/StatTree';
import SkillData from '../Trees/Node/Data/SkillData';
import WeaponUpgradeTree from '../Trees/WeaponUpgradeTree';
import Cooldown from './Cooldown';
import GameManager from '../../system/GameManager';

export default class Player extends Entity {
    @type('string') name;
    @type('string') role;
    // @type(Cooldown) attackCooldown;
    @type(Cooldown) specialCooldown;
    @type(WeaponUpgradeTree) weaponUpgradeTree;
    @type(StatTree) skillTree;
    @type([WeaponUpgradeTree]) artifacts = new ArraySchema<WeaponUpgradeTree>();


    constructor(name: string, role?: string, gameManager?: GameManager, ) {
        super();
        this.name = name;
        this.role = role? role: "ranger"
        // this.attackCooldown = new Cooldown(1000)
        this.specialCooldown = new Cooldown(5000)
        this.type = "Player";
        this.weaponUpgradeTree = new WeaponUpgradeTree(gameManager, this)
        this.skillTree = new StatTree<SkillData>(gameManager)
    }
}