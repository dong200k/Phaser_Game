import { Schema, type } from '@colyseus/schema';
import GameObject from './GameObject';

export type statType = typeof Stat.defaultStatObject

export default class Stat extends Schema {
    @type('number') hp;
    @type('number') maxHp;
    @type('number') mana;
    @type('number') maxMana;

    @type('number') armor;
    @type('number') magicResist;

    @type('number') damagePercent;

    @type('number') attack;
    @type('number') attackPercent;
    @type('number') armorPen;


    @type('number') magicAttack;
    @type('number') magicAttackPercent;
    @type('number') magicPen;

    @type('number') critRate;
    @type('number') critDamage;

    @type('number') attackRange;
    @type('number') attackRangePercent;

    @type('number') attackSpeed;
    @type('number') attackSpeedPercent;

    @type('number') speed;

    @type('number') lifeSteal;
    @type('number') lifeStealPercent;

    @type('number') level;

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

    constructor(stat: statType = Stat.defaultStatObject) {
        super(0, 0);
        this.hp = stat.hp;
        this.maxHp = stat.maxHp;
        this.mana = stat.mana;
        this.maxMana = stat.maxMana;

        this.armor = stat.armor;
        this.magicResist = stat.magicResist;

        this.damagePercent = stat.damagePercent

        this.attack = stat.attack;
        this.attackPercent = stat.attackPercent;
        this.armorPen = stat.armorPen;


        this.magicAttack = stat.magicAttack;
        this.magicAttackPercent = stat.magicAttackPercent;
        this.magicPen = stat.magicPen;

        this.critRate = stat.critRate;
        this.critDamage = stat.critDamage;

        this.attackRange = stat.attackRange;
        this.attackRangePercent = stat.attackRangePercent;

        this.attackSpeed = stat.attackSpeed;
        this.attackSpeedPercent = stat.attackSpeedPercent;

        this.speed = stat.speed;

        this.lifeSteal = stat.lifeSteal;
        this.lifeStealPercent = stat.lifeStealPercent

        this.level = stat.level;
    }

    static getDefaultPlayerStat(){
        return new Stat()
    }

    static getZeroStat(){
        let zeroStatObject = Object.assign({}, Stat.defaultStatObject)

        Object.keys(zeroStatObject).forEach(key=>{
            zeroStatObject[key as keyof statType] = 0
        })
        
        return new Stat(zeroStatObject)
    }
}