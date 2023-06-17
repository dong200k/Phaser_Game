import Effect from "../Effect";
import { type } from "@colyseus/schema";
import TempEffect from "./TempEffect";
import Stat from "../../gameobjs/Stat";
import Entity from "../../gameobjs/Entity";


export interface StatConfig {
    name?: string;
    description?: string;
    maxHp?: number;
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
    //level?:number;
}

export default class StatEffect extends TempEffect {
    /** The stat of this stat effect. This value should not be changed. It is needed to revert the stat of an entity. */
    @type(Stat) private stat: Stat;

    /**
     * Creates a stat object that will be used to change 
     * the stats of an entity by a flat amount.
     * @param statConfig The stats to change.
     */
    constructor(statConfig?: StatConfig) {
        super(false);
        if(statConfig) {
            if(statConfig.name !== undefined) this.setName(statConfig.name);
            if(statConfig.description !== undefined) this.setDescription(statConfig.description);
            this.stat = new Stat(statConfig)
        }else{
            this.stat = Stat.getZeroStat()
        }
    }

    public applyEffect(entity: Entity): boolean {
        // this.applyStatToEntity(entity, this.stat, 1);
        entity.stat.add(this.stat)
        return true;
    }

    protected unapplyEffect(entity: Entity): boolean {
        // this.applyStatToEntity(entity, this.stat, -1);
        entity.stat.sub(this.stat)
        return true;
    }

    private applyStatToEntity(entity: Entity, stat: Stat, multiplier: number) {
        entity.stat.add(Stat.mul(stat, multiplier))
    }

    /**
     * Clear the stat to zeros.
     * @param stat The stat object.
     */
    private clearStat(stat: Stat) {
       stat.mul(0)
    }

    public getStat() {
        return this.stat;
    }
}