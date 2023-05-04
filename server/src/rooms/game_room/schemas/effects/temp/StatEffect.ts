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
        this.stat = new Stat();
        this.clearStat(this.stat);
        if(statConfig) {
            if(statConfig.name !== undefined) this.setName(statConfig.name);
            if(statConfig.description !== undefined) this.setDescription(statConfig.description);
            if(statConfig.maxHp !== undefined) this.stat.maxHp = statConfig.maxHp;
            if(statConfig.maxMana !== undefined) this.stat.maxMana = statConfig.maxMana;
            if(statConfig.armor !== undefined) this.stat.armor = statConfig.armor;
            if(statConfig.magicResist !== undefined) this.stat.magicResist = statConfig.magicResist;
            if(statConfig.damagePercent !== undefined) this.stat.damagePercent = statConfig.damagePercent;
            if(statConfig.attack !== undefined) this.stat.attack = statConfig.attack;
            if(statConfig.attackPercent !== undefined) this.stat.attackPercent = statConfig.attackPercent;
            if(statConfig.armorPen !== undefined) this.stat.armorPen = statConfig.armorPen;
            if(statConfig.magicAttack !== undefined) this.stat.magicAttack = statConfig.magicAttack;
            if(statConfig.magicAttackPercent !== undefined) this.stat.magicAttackPercent = statConfig.magicAttackPercent;
            if(statConfig.magicPen !== undefined) this.stat.magicPen = statConfig.magicPen;
            if(statConfig.critRate !== undefined) this.stat.critRate = statConfig.critRate;
            if(statConfig.critDamage !== undefined) this.stat.critDamage = statConfig.critDamage;
            if(statConfig.attackRange !== undefined) this.stat.attackRange = statConfig.attackRange;
            if(statConfig.attackRangePercent !== undefined) this.stat.attackRangePercent = statConfig.attackRangePercent;
            if(statConfig.attackSpeed !== undefined) this.stat.attackSpeed = statConfig.attackSpeed;
            if(statConfig.attackSpeedPercent !== undefined) this.stat.attackSpeedPercent = statConfig.attackSpeedPercent;
            if(statConfig.speed !== undefined) this.stat.speed = statConfig.speed;
            if(statConfig.lifeSteal !== undefined) this.stat.lifeSteal = statConfig.lifeSteal;
            //if(statConfig.level !== undefined) this.stat.level = statConfig.level;
        }
    }

    public applyEffect(entity: Entity): boolean {
        this.applyStatToEntity(entity, this.stat, 1);
        return true;
    }

    protected unapplyEffect(entity: Entity): boolean {
        this.applyStatToEntity(entity, this.stat, -1);
        return true;
    }

    private applyStatToEntity(entity: Entity, stat: Stat, multiplier: number) {
        entity.stat.maxHp += stat.maxHp * multiplier;
        entity.stat.maxMana += stat.maxMana * multiplier;
        entity.stat.armor += stat.armor * multiplier;
        entity.stat.magicResist += stat.magicResist * multiplier;
        entity.stat.damagePercent += stat.damagePercent * multiplier;
        entity.stat.attack += stat.attack * multiplier;
        entity.stat.attackPercent += stat.attackPercent * multiplier;
        entity.stat.armorPen += stat.armorPen * multiplier;
        entity.stat.magicAttack += stat.magicAttack * multiplier;
        entity.stat.magicAttackPercent += stat.magicAttackPercent * multiplier;
        entity.stat.magicPen += stat.magicPen * multiplier;
        entity.stat.critRate += stat.critRate * multiplier;
        entity.stat.critDamage += stat.critDamage * multiplier;
        entity.stat.attackRange += stat.attackRange * multiplier;
        entity.stat.attackRangePercent += stat.attackRangePercent * multiplier;
        entity.stat.attackSpeed += stat.attackSpeed * multiplier;
        entity.stat.attackSpeedPercent += stat.attackSpeedPercent * multiplier;
        entity.stat.speed += stat.speed * multiplier;
        entity.stat.lifeSteal += stat.lifeSteal * multiplier;
    }

    /**
     * Clear the stat to zeros.
     * @param stat The stat object.
     */
    private clearStat(stat: Stat) {
        stat.hp = 0;
        stat.mana = 0;
        
        stat.armor = 0;
        stat.magicResist = 0;

        stat.damagePercent = 0;

        stat.attack = 0;
        stat.attackPercent = 0;
        stat.armorPen = 0;
        
        stat.magicAttack = 0;
        stat.magicAttackPercent = 0;
        stat.magicPen = 0;
        
        stat.critRate = 0;
        stat.critDamage = 0;

        stat.attackRange = 0;
        stat.attackRangePercent = 0;

        stat.attackSpeed = 0;
        stat.attackSpeedPercent = 0;
        
        stat.speed = 0;

        stat.lifeSteal = 0;

        stat.level = 0;
    }

    public getStat() {
        return this.stat;
    }
}