import Phaser from "phaser";
import GameObject from "./GameObject";
import EntityState from "../../../server/src/rooms/game_room/schemas/gameobjs/Entity";
import { ColorStyle } from "../config";

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

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, entityState: EntityState) {
        super(scene, x, y, texture, entityState);
        this.stat = {};
    }

    public getStat() {
        return this.stat;
    }

    /** Updates the stat by copying provided values to the stat.
     *  @param stat new Stat values.
     */
    public updateStat(stat: Stat) {
        let prevHp = this.stat.hp ?? 0;
        Object.assign(this.stat, stat);
        let hpChange = (this.stat.hp ?? 0) - prevHp;

        if(hpChange < 0) {
            // Took damage.
            this.tint = ColorStyle.red.hex[900];
            setTimeout(() => {
                this.tint = 0xffffff;
            }, 100);
        }
    }
}