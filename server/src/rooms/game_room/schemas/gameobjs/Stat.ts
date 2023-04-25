import { Schema, type } from '@colyseus/schema';
import GameObject from './GameObject';

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

    @type('number') level;



    constructor() {
        super(0, 0);
        this.hp = 100;
        this.maxHp = 100;
        this.mana = 100;
        this.maxMana = 100;

        this.armor = 10;
        this.magicResist = 10;

        this.damagePercent = 0

        this.attack = 10;
        this.attackPercent = 0.5;
        this.armorPen = 0;


        this.magicAttack = 0;
        this.magicAttackPercent = 0;
        this.magicPen = 0;

        this.critRate = 0.5;
        this.critDamage = 1;

        this.attackRange = 1;
        this.attackRangePercent = 0;

        this.attackSpeed = 1;
        this.attackSpeedPercent = 0

        this.speed = 1;

        this.lifeSteal = 0;

        this.level = 1;
    }
}