import { DataChange, Schema, type } from '@colyseus/schema';
import GameObject from './GameObject';

export type statType = typeof Stat.defaultStatObject
export type keyStat = keyof statType
type IChanges = {
    [key in keyof statType]: boolean
}
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
    @type('number') chargeAttackSpeed!: number;
    @type('number') chargeAttackSpeedPercent!: number;

    @type('number') speed!: number;

    @type('number') lifeSteal!: number;
    @type('number') lifeStealPercent!: number;

    @type('number') healthRegen!: number;
    @type('number') shieldHp!: number;
    @type('number') shieldMaxHp!: number;

    /** Affects the final damage player should take. */
    @type('number') extraDamageTakenPercent!: number;

    /** Affects cooldown of most effects except player attack.
     * 
     * Note: cooldownReduction of 1 reduces attacks infinitely
     * cooldownReduction of 0.9 makes the cooldown 10 times faster
    */
    @type('number') cooldownReduction!: number;

    /** Area of effect, affects some effects area. 
     * 
     * Note: area of 1 doubles the area, area of 2 triples
    */
    @type('number') area!: number;

    /** Affects the amount of projectiles/things in some effects */
    @type('number') amount!: number;

    /** Affects the experience the player. 1 means 100% extra experience */
    @type('number') expRate!: number;

    /** chance to dodge an attack capped at 0.6 or 60% chance to dodge */
    @type('number') dodge!: number;
    /** Increases damage dealt to enemies when they are at full health. 1 means 100% extra damage  */
    @type('number') firstHitDamage!: number;
    /** Extra crit rate applied to attacks that hit targets with full health */
    @type('number') firstHitCritRateBonus!: number
    /** Extra crit damage applied to critical hits that hit targets with full health */
    @type('number') firstHitCritDamageBonus!: number

    @type('number') level!: number;

    private listeners: Map<string, {listener: Function, statsToListen: Set<keyStat>}> = new Map()
    private changes: IChanges = this.getInitialChanges()
    
    /** 
     * Calls listeners when corresponding stat changes. For example when attack speed changes, all listeners listening for attack speed gets called.
     * Called when stat is modified by add mul etc., even if it remains the same after modification. */
    onChangeStat(){
        // For each listener if any of the stat it is listening for changed call the listener
        this.listeners.forEach((val, key)=>{
            let {listener, statsToListen} = val
            Object.entries(this.changes).forEach(([key, val]) => {
                if(val && statsToListen.has(key as keyStat)) listener(this)
            });
        })

        // Set stats to not changed
        Object.entries(this.changes).forEach(([key, val]) => {
            this.changes[key as keyStat] = false
        });
    }

    /**
     * Adds a listener to listen for changes of different attributes of a Stat class.
     * @param key unique key to track the listener
     * @param listener function that gets called when correct stats changes.
     * @param statsToListen determines which stat to listen for. E.g. ["attackSpeed", "maxMana"] means when those stat changes listener will be called.
     */
    addListener(key: string, listener: Function, statsToListen: Set<keyStat>){
        this.listeners.set(key, {listener, statsToListen})
    }

    /**
     * Removes listener with the corresponding key. 
     * 
     * Note: Be sure to remove listeners after finishing using them.
     * @param key unique key to track the listener
     */
    removeListener(key: string){
        this.listeners.delete(key)
    }

    static defaultStatObject = {
        maxHp: 0, maxMana: 0, hp: 0, mana: 0, armor: 0, magicResist: 0, damagePercent: 0, attack: 0, armorPen: 0, attackPercent: 0, 
        magicAttack: 0, magicAttackPercent: 0, magicPen: 0, critRate: 0, critDamage: 0, attackRange: 0, attackRangePercent: 0,
        attackSpeed: 0, attackSpeedPercent: 0, speed: 0, lifeSteal: 0, lifeStealPercent: 0, level: 0, chargeAttackSpeed: 0, 
        chargeAttackSpeedPercent: 0, healthRegen: 0, shieldHp: 0, shieldMaxHp: 0, extraDamageTakenPercent: 0, 
        area: 0, amount: 0, cooldownReduction: 0, expRate: 0, dodge: 0, firstHitDamage: 0, firstHitCritRateBonus: 0, firstHitCritDamageBonus: 0
    }

    /** Creates a new stat object based on the stat config passed in. Stat properties not initialized in the config
     * for example attackSpeed will be set to zero by default.
     */
    constructor(stat: Partial<statType> = Stat.defaultStatObject) {
        super(0, 0);
        // let zeroStat = Stat.getZeroStatObject()
        // let zeroPaddedStat = {...zeroStat, ...stat}
        // Object.entries(zeroPaddedStat).forEach(([key, val])=>{
        //     if(val && !isNaN(val)) this[key as keyStat] = Number(val)
        //     else this[key as keyStat] = 0
        // })

        Object.entries(Stat.defaultStatObject).forEach(([key, ])=>{
            let val = stat[key as keyStat]
            if(val && !isNaN(val)) this[key as keyStat] = Number(val)
            else this[key as keyStat] = 0
        })
    }

    getInitialChanges(){
        let changes: IChanges = {
            maxHp: false,
            maxMana: false,
            hp: false,
            mana: false,
            armor: false,
            magicResist: false,
            damagePercent: false,
            attack: false,
            armorPen: false,
            attackPercent: false,
            magicAttack: false,
            magicAttackPercent: false,
            magicPen: false,
            critRate: false,
            critDamage: false,
            attackRange: false,
            attackRangePercent: false,
            attackSpeed: false,
            attackSpeedPercent: false,
            speed: false,
            lifeSteal: false,
            lifeStealPercent: false,
            level: false,
            chargeAttackSpeed: false,
            chargeAttackSpeedPercent: false,
            healthRegen: false,
            shieldHp: false,
            shieldMaxHp: false,
            extraDamageTakenPercent: false,
            area: false,
            amount: false,
            cooldownReduction: false,
            expRate: false,
            dodge: false,
            firstHitDamage: false,
            firstHitCritRateBonus: false,
            firstHitCritDamageBonus: false
        }
        return changes
    }

    setAttributeChanged(attribute: keyStat){
        this.changes[attribute] = true
    }

    setAllAttributeChanged(){
        Object.entries(this.changes).forEach(([key, val])=>{
            this.changes[key as keyStat] = true
        })
    }
    /**
     * Copy the values provided into this Stat.
     * @param stat The stat.
     */
    public setStats(stat: Partial<statType>) {
        // Object.assign(this, stat);

        Object.entries(Stat.defaultStatObject).forEach(([key, ])=>{
            let val = stat[key as keyStat]
            if(val && !isNaN(val)) this[key as keyStat] = Number(val)
            else this[key as keyStat] = 0
        })

        this.setAllAttributeChanged()
        this.onChangeStat()
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
            this.setAttributeChanged(key as keyStat)
        })
        this.onChangeStat()
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
        if(stat.maxHp !== undefined)
            this.hp += stat.maxHp;
        if(stat.maxMana !== undefined)
            this.mana += stat.maxMana;
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] + stat[key as keyStat]
            this.setAttributeChanged(key as keyStat)
        })

        this.fixOverflow();
        this.onChangeStat()
    }

    /**
     * subs the stat by another stat in place
     */
    public sub(stat: Stat){
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] - stat[key as keyStat]
            this.setAttributeChanged(key as keyStat)
        })

        this.fixOverflow();
        this.onChangeStat()
    }

    /**
     * Adds all of the stat's properties by a scalar in place
     * @param scalar number to add the properties by
     */
    public addScalar(scalar: number){
        Object.entries(Stat.defaultStatObject).forEach(([key, val])=>{
            this[key as keyStat] = this[key as keyStat] + scalar
            this.setAttributeChanged(key as keyStat)
        })
        this.onChangeStat()
    }

    /** Fixes overflow problem when hp is greater than maxHp, and 
     * when mana is greater then maxMana. Also when shieldHp is greater than shieldMaxHp
     */
    public fixOverflow() {
        if(this.hp > this.maxHp) this.hp = this.maxHp;
        if(this.mana > this.maxMana) this.mana = this.maxMana;
        if(this.shieldHp > this.shieldMaxHp) this.shieldHp = this.shieldMaxHp
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