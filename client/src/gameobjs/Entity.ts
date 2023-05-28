import Phaser from "phaser";
import GameObject from "./GameObject";

export interface Stat {
    hp?: number;
    maxHp?: number;
    mana?: number;
    maxMana?: number;

    armor?: number;
    magicResist?: number;

    damagePercent?: number;

    attack?: number;
    attackPercent?: number;
    armorPen?: number;


    magicAttack?: number;
    magicAttackPercent?: number;
    magicPen?: number;

    critRate?: number;
    critDamage?: number;

    attackRange?: number;
    attackRangePercent?: number;

    attackSpeed?: number;
    attackSpeedPercent?: number;

    speed?: number;

    lifeSteal?: number;

    level?: number;
}

export default abstract class Entity extends GameObject
{
    private stat: Stat;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string|Phaser.Textures.Texture) {
        super(scene, x, y, texture);
        this.stat = {};
    }

    public getStat() {
        return this.stat;
    }
}