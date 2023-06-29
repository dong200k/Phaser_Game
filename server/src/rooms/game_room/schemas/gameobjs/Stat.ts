import { Schema, type } from '@colyseus/schema';
import GameObject from './GameObject';

export type statType = typeof Stat.defaultStatObject
type keyStat = keyof statType
export default class Stat extends Schema {
    @type('number') hp!: number;
    @type('number') maxHp!: number;
    @type('number') mana!: number;
    @type('number') maxMana!: number;

    @type('number') armor!: number;
    @type('number') magicResist!: number;

    @type('number') damagePercent!: number;

    @type('number') attack!: number;
    @type('number') attackPercent!: number;
    @type('number') armorPen!: number;


    @type('number') magicAttack!: number;
    @type('number') magicAttackPercent!: number;
    @type('number') magicPen!: number;

    @type('number') critRate!: number;
    @type('number') critDamage!: number;

    @type('number') attackRange!: number;
    @type('number') attackRangePercent!: number;

    @type('number') attackSpeed!: number;
    @type('number') attackSpeedPercent!: number;

    @type('number') speed!: number;

    @type('number') lifeSteal!: number;
    @type('number') lifeStealPercent!: number;

    @type('number') level!: number;

    static defaultStatObject = {
        maxHp: 100, maxMana: 100,
        hp: 100, mana: 100, 
        armor: 10, magicResist: 10,
        damagePercent: 0, attack: 10, armorPen: 0, attackPercent: 0.5, 
        magicAttack: 0, magicAttackPercent: 0, magicPen: 0,
        critRate: 0.5, critDamage: 1, 
        attackRange: 1, attackRangePercent: 0,
        attackSpeed: 1, attackSpeedPercent: 0, 
        speed: 1, lifeSteal: 0, lifeStealPercent: 0, level: 1
    }

    /** Creates a new stat object based on the stat config passed in. Stat properties not initialized in the config
     * for example attackSpeed will be set to zero by default.
     */
    constructor(stat: Partial<statType> = Stat.defaultStatObject) {
        super(0, 0);
        let zeroStat = Stat.getZeroStatObject()
        let zeroPaddedStat = {...zeroStat, ...stat}
        Object.entries(zeroPaddedStat).forEach(([key, val])=>{
            if(val && !isNaN(val)) this[key as keyStat] = val
            else this[key as keyStat] = 0
        })
        // this.hp = stat.hp;
        // this.maxHp = stat.maxHp;
        // this.mana = stat.mana;
        // this.maxMana = stat.maxMana;

        // this.armor = stat.armor;
        // this.magicResist = stat.magicResist;

        // this.damagePercent = stat.damagePercent

        // this.attack = stat.attack;
        // this.attackPercent = stat.attackPercent;
        // this.armorPen = stat.armorPen;


        // this.magicAttack = stat.magicAttack;
        // this.magicAttackPercent = stat.magicAttackPercent;
        // this.magicPen = stat.magicPen;

        // this.critRate = stat.critRate;
        // this.critDamage = stat.critDamage;

        // this.attackRange = stat.attackRange;
        // this.attackRangePercent = stat.attackRangePercent;

        // this.attackSpeed = stat.attackSpeed;
        // this.attackSpeedPercent = stat.attackSpeedPercent;

        // this.speed = stat.speed;

        // this.lifeSteal = stat.lifeSteal;
        // this.lifeStealPercent = stat.lifeStealPercent

        // this.level = stat.level;
    }

    /**
     * Takes in 2 stats and return a new stat with the addition of the 2 stats values
     * @param stat1 
     * @param stat2 
     */
    static add(stat1: Stat, stat2: Stat){
        let sum = Stat.getZeroStat()
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            sum[key as keyStat] += stat1[key as keyStat] + stat2[key as keyStat]
        })

        return sum
    }

    /**
     * Takes in 2 stats and return a new stat with stat1-stat2
     * @param stat1 
     * @param stat2 
     */
    static sub(stat1: Stat, stat2: statType){
        let sum = Stat.getZeroStat()
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            sum[key as keyStat] += stat1[key as keyStat] - stat2[key as keyStat]
        })

        return sum
    }

    /**
     * Takes in a stat and a scalar/integer and returns a new stat with every attribute of the stat multipied by the scalar
     * @param stat
     * @param scalar 
     */
    static mul(stat: Stat, scalar: number){
        let newStat = Stat.getZeroStat()

        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            newStat[key as keyStat] = stat[key as keyStat] * scalar
        })

        return newStat
    }

    /**
     * Multiplies stat by scalar in place
     * @param scalar number to scale/multiply stat by
     */
    public mul(scalar: number){
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] * scalar
        })
    }

    /**
     * Takes in a stat and a scalar, returns a new stat wtih stat + increment
     * @param stat
     * @param increment number to add the properties by
     */
    static addScalar(stat: Stat, increment: number){
        let newStat = Stat.getZeroStat()
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            newStat[key as keyStat] = stat[key as keyStat] + increment
        })
        return newStat
    }

    /**
     * Adds the stat by another stat in place
     */
    public add(stat: Stat){
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] + stat[key as keyStat]
        })
    }

    /**
     * subs the stat by another stat in place
     */
    public sub(stat: Stat){
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] - stat[key as keyStat]
        })
    }

    /**
     * Adds all of the stat's properties by a scalar in place
     * @param scalar number to add the properties by
     */
    public addScalar(scalar: number){
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] + scalar
        })
    }

    static getDefaultPlayerStat(){
        return new Stat()
    }

    /**
     * 
     * @returns new Stat initialized with zero
     */
    static getZeroStat(){
        let zeroStatObject = Stat.getZeroStatObject()
        
        return new Stat(zeroStatObject)
    }

    static getZeroStatObject(){
        let zeroStatObject = Object.assign({}, Stat.defaultStatObject)

        Object.keys(zeroStatObject).forEach(key=>{
            zeroStatObject[key as keyof statType] = 0
        })
        
        return zeroStatObject
    }
}