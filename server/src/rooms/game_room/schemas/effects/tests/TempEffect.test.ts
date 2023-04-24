import EffectManager from "../../../system/StateManagers/EffectManager";
import Player from "../../gameobjs/Player"
import EffectFactory from "../EffectFactory";

describe("Speed Multiplier Effect, Temp", () => {
    const createPlayer = (initialSpeed: number) => {
        let player = new Player("Dummy Player", "Shoe washer");
        player.stat.speed = initialSpeed;
        return player;
    }
    test("Boost speed by 2 times for 2 seconds", () => {
        let player = createPlayer(1);
        EffectManager.addEffectsTo(player, EffectFactory.createSpeedMultiplierEffectTimed(2, 2));
        EffectManager.updateEffectsOn(player, 0.99);
        expect(player.stat.speed).toBeCloseTo(2);
        EffectManager.updateEffectsOn(player, 0.99);
        expect(player.stat.speed).toBeCloseTo(2);
        EffectManager.updateEffectsOn(player, 0.03);
        expect(player.stat.speed).toBeCloseTo(1);
    })
    test("Slow speed to 0.5 for 2 seconds", () => {
        let player = createPlayer(1);
        EffectManager.addEffectsTo(player, EffectFactory.createSpeedMultiplierEffectTimed(0.5, 2));
        EffectManager.updateEffectsOn(player, 0.99);
        expect(player.stat.speed).toBeCloseTo(0.5);
        EffectManager.updateEffectsOn(player, 0.99);
        expect(player.stat.speed).toBeCloseTo(0.5);
        EffectManager.updateEffectsOn(player, 0.03);
        expect(player.stat.speed).toBeCloseTo(1);
    })
    test("Creating a speed multiplier effect of 0 should throw an error", () => {
        expect(() => EffectFactory.createSpeedMultiplierEffectTimed(0, 2)).toThrowError();
    })
    test("Creating a speed multiplier effect of -1 should throw an error", () => {
        expect(() => EffectFactory.createSpeedMultiplierEffectTimed(-1, 2)).toThrowError();
    })
    test("Untimed speed boost by 2. Manually stopped after 2 seconds", () => {
        let player = createPlayer(1);
        let speedEffect = EffectFactory.createSpeedMultiplierEffectUntimed(2)
        EffectManager.addEffectsTo(player, speedEffect);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.speed).toBeCloseTo(2);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.speed).toBeCloseTo(2);
        // set speed boost as completed.
        speedEffect.setAsCompleted();
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.speed).toBeCloseTo(1);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.speed).toBeCloseTo(1);
    })
    test("Untimed speed boost by 2. Manually stopped after 2 seconds multiple times. Should not revert effect multiple times.", () => {
        let player = createPlayer(1);
        let speedEffect = EffectFactory.createSpeedMultiplierEffectUntimed(2)
        EffectManager.addEffectsTo(player, speedEffect);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.speed).toBeCloseTo(2);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.speed).toBeCloseTo(2);
        // set speed boost as completed.
        speedEffect.setAsCompleted();
        speedEffect.setAsCompleted();
        speedEffect.setAsCompleted();
        speedEffect.setAsCompleted();
        speedEffect.setAsCompleted();
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.speed).toBeCloseTo(1);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.speed).toBeCloseTo(1);
    })
})


describe("Stat Effects", () => {
    const createPlayer = () => {
        let player = new Player("Average Person", "Road Constructor");
        player.stat.hp = 100;
        player.stat.maxHp = 100;
        player.stat.mana = 100;
        player.stat.maxMana = 100;
        player.stat.armor = 0;
        player.stat.magicResist = 0;
        player.stat.damagePercent = 1;
        player.stat.attack = 10;
        player.stat.attackPercent = 1;
        player.stat.armorPen = 0;
        player.stat.magicAttack = 0;
        player.stat.magicAttackPercent = 1;
        player.stat.magicPen = 0;
        player.stat.critRate = 0;
        player.stat.critDamage = 1;
        player.stat.attackRange = 1;
        player.stat.attackRangePercent = 1;
        player.stat.speed = 1;
        player.stat.lifeSteal = 0;
        player.stat.level = 1;
        return player;
    }
    test("Long Sword Stats", () => {
        let player = createPlayer();
        let basicSwordEffect = EffectFactory.createStatEffect({
            name: 'long sword',
            description: 'A sword that ADCs like to build',
            attack: 15,
        });
        EffectManager.addEffectsTo(player, basicSwordEffect);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.attack).toBe(25);
    })
    test("General stats test", () => {
        let player = createPlayer();
        let darkGodRing = EffectFactory.createStatEffect({
            name: "Dark God's ring",
            description: 'A ring that extrudes an immense power. Any weilders will get a significant boost to their stats.',
            maxHp: 10000,
            maxMana: 1000,
            armor: 500,
            magicResist: 500,
            damagePercent: .2,
            attack: 1000,
            attackPercent: .2,
            armorPen: 100,
            magicAttack: 1000,
            magicAttackPercent: .2,
            magicPen: 100,
            critRate: .2,
            critDamage: .2,
            attackRange: 2,
            attackRangePercent: .2,
            speed: 10,
            lifeSteal: 0.2,
        });
        EffectManager.addEffectsTo(player, darkGodRing);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.maxHp).toBe(10100);
        expect(player.stat.maxMana).toBe(1100);
        expect(player.stat.armor).toBe(500);
        expect(player.stat.magicResist).toBe(500);
        expect(player.stat.damagePercent).toBeCloseTo(1.2);
        expect(player.stat.attack).toBe(1010);
        expect(player.stat.attackPercent).toBeCloseTo(1.2);
        expect(player.stat.armorPen).toBe(100);
        expect(player.stat.magicAttack).toBe(1000);
        expect(player.stat.magicAttackPercent).toBeCloseTo(1.2);
        expect(player.stat.magicPen).toBe(100);
        expect(player.stat.critRate).toBeCloseTo(0.2);
        expect(player.stat.critDamage).toBeCloseTo(1.2);
        expect(player.stat.attackRange).toBe(3);
        expect(player.stat.attackRangePercent).toBeCloseTo(1.2);
        expect(player.stat.speed).toBe(11);
        expect(player.stat.lifeSteal).toBeCloseTo(0.2);
        EffectManager.removeEffectFrom(player, darkGodRing);
        expect(player.stat.maxHp).toBe(100);
        expect(player.stat.maxMana).toBe(100);
        expect(player.stat.armor).toBe(0);
        expect(player.stat.magicResist).toBe(0);
        expect(player.stat.damagePercent).toBeCloseTo(1);
        expect(player.stat.attack).toBe(10);
        expect(player.stat.attackPercent).toBeCloseTo(1);
        expect(player.stat.armorPen).toBe(0);
        expect(player.stat.magicAttack).toBe(0);
        expect(player.stat.magicAttackPercent).toBeCloseTo(1);
        expect(player.stat.magicPen).toBe(0);
        expect(player.stat.critRate).toBeCloseTo(0);
        expect(player.stat.critDamage).toBeCloseTo(1);
        expect(player.stat.attackRange).toBe(1);
        expect(player.stat.attackRangePercent).toBeCloseTo(1);
        expect(player.stat.speed).toBe(1);
        expect(player.stat.lifeSteal).toBeCloseTo(0);
    })
})

