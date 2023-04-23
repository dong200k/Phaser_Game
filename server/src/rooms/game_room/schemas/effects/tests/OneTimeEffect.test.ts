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

