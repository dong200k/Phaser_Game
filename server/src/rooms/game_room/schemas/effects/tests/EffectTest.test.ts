import EffectManager from "../../../system/StateManagers/EffectManager";
import Player from "../../gameobjs/Player"
import EffectFactory from "../EffectFactory";


describe('Instant HP Effect', () => {
    test("heal 100 hp", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
    })
    test("heal 100 hp but no time passed so it should fail", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(100));
        EffectManager.updateEffectsOn(player, 0);
        expect(player.stat.hp).toBe(100);
    })
    test("take 100 damage", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createDamageEffect(100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(0);
    })
    test("take 100 damage, heal 50hp, heal 50hp", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, [
            EffectFactory.createDamageEffect(100),
            EffectFactory.createHealEffect(50),
            EffectFactory.createHealEffect(50),
        ]);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
    test("no effects", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
    test("negative heal should heal zero", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(-100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
    test("negative damage should deal no damage", () => {
        let player = new Player("Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createDamageEffect(-100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
})

describe('Continuous HP Effect', () => {
    const createPlayer = (hp: number) => {
        let player = new Player("Dummy Player", "Shoe washer");
        player.stat.hp = hp;
        return player;
    }
    test("heal 100 hp over 5 seconds, 5 total ticks", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createRegenEffect(100, 5, 5));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(120);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(140);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(160);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(180);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(200);
    })
    test("heal 100 hp over 2 second, 3 total ticks", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createRegenEffect(100, 2, 3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100 + 1 * (100/3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(200);
    })
    test("take 100 damage over 5 seconds, 5 total ticks", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 5, 5));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(80);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(60);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(40);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(20);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 2 seconds, 3 total ticks", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 2, 3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100 - 1 * (100/3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 2 seconds, 0 total ticks (will become one)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 2, 0));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 2 seconds, 0.2 total ticks (will become one)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 2, 0.2));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 2 seconds, 0.8 total ticks (will become one)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 2, 0.8));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 2 seconds, 3.3 total ticks (will become 3)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 2, 3.3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100 - 1 * (100/3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 2 seconds, 2.6 total ticks (will become 3)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 2, 2.6));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100 - 1 * (100/3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 0 seconds(will become 1), 2.6 total ticks (will become 3)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 0, 2.6));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over -2 seconds(will become 1), 2.6 total ticks (will become 3)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, -2, 2.6));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 100 damage over 1.8 seconds(will become 2), 2.6 total ticks (will become 3)", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffect(100, 1.8, 2.6));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(100 - 1 * (100/3));
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(0);
    })
    test("take 10 damage per second", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffectUntimed(1, 10));
        EffectManager.updateEffectsOn(player, 20);
        expect(player.stat.hp).toBeCloseTo(-100);
    })
    test("take 10 damage per half a second", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffectUntimed(0.5, 10));
        EffectManager.updateEffectsOn(player, 20);
        expect(player.stat.hp).toBeCloseTo(-300);
    })
    test("take 10 damage per second, updates effect every 0.2 seconds", () => {
        let player = createPlayer(100);
        EffectManager.addEffectsTo(player, EffectFactory.createDamageOverTimeEffectUntimed(1, 10));
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2);
        EffectManager.updateEffectsOn(player, 0.2001); //adjust for rounded error.
        expect(player.stat.hp).toBeCloseTo(80);
    })
    test("take 10 damage per second stopping after 2 seconds.", () => {
        let player = createPlayer(100);
        let effect = EffectFactory.createDamageOverTimeEffectUntimed(1, 10);
        EffectManager.addEffectsTo(player, effect);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(90);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(80);
        effect.setAsCompleted();
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(80);
        EffectManager.updateEffectsOn(player, 1);
        expect(player.stat.hp).toBeCloseTo(80);
    })
})

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