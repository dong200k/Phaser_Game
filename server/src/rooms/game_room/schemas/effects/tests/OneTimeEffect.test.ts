import GameManager from "../../../system/GameManager";
import EffectManager from "../../../system/StateManagers/EffectManager";
import State from "../../State";
import Player from "../../gameobjs/Player"
import EffectFactory from "../EffectFactory";


describe('Instant HP Effect', () => {

    let gameManager: GameManager

    beforeEach(async ()=>{
        gameManager = new GameManager(new State())
        await gameManager.preload()
    })

    test("heal 100 hp", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        player.stat.maxHp = 200;
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
    })
    test("heal 100 hp, then reset and heal another 100", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        player.stat.maxHp = 300;
        let healEffect = EffectFactory.createHealEffect(100);
        EffectManager.addEffectsTo(player, healEffect);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
        EffectManager.removeEffectFrom(player, healEffect);
        healEffect.reset();
        expect(player.stat.hp).toBe(200);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
        EffectManager.addEffectsTo(player, healEffect);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(300);
    })
    test("heal 100 hp but no time passed so it should fail", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        player.stat.maxHp = 200;
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(100));
        EffectManager.updateEffectsOn(player, 0);
        expect(player.stat.hp).toBe(100);
    })
    test("take 100 damage", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createDamageEffect(100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(0);
    })
    test("take 100 damage, heal 50hp, heal 50hp", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        player.stat.maxHp = 200;
        EffectManager.addEffectsTo(player, [
            EffectFactory.createDamageEffect(100),
            EffectFactory.createHealEffect(50),
            EffectFactory.createHealEffect(50),
        ]);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
    test("no effects", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
    test("negative heal should heal zero", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(-100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
    test("negative damage should deal no damage", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        EffectManager.addEffectsTo(player, EffectFactory.createDamageEffect(-100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(100);
    })
})

describe("General Effect tests", () => {

    let gameManager: GameManager

    beforeEach(async ()=>{
        // gameManager = new GameManager(new State())
        // await gameManager.preload()
        gameManager = new GameManager(new State());
    })

    test("Effect can only reset if it is not assigned to an entity", () => {
        let player = new Player(gameManager, "Dummy Player", "Rocket Scientist");
        player.stat.hp = 100;
        player.stat.maxHp = 200;
        let healEffect = EffectFactory.createHealEffect(100);
        EffectManager.addEffectsTo(player, healEffect);
        //Try to reset effect, should fail.
        let bool = healEffect.reset();
        expect(bool).toBe(false);
        expect(player.effects.length).toBe(1);

        EffectManager.updateEffectsOn(player, 0.1);
        //Effect has been applied and automatically removed. Now we can reset.
        expect(player.stat.hp).toBe(200);
        expect(player.effects.length).toBe(0);
        let entity = healEffect.getEntity();
        expect(entity).toBeNull();
        bool = healEffect.reset();
        expect(bool).toBe(true);
    })
    
})

