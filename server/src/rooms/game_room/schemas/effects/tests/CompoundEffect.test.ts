
import MathUtil from "../../../../../util/MathUtil";
import EffectManager from "../../../system/StateManagers/EffectManager";
import Player from "../../gameobjs/Player"
import EffectFactory from "../EffectFactory";


describe('CompoundEffect tests', () => {
    const createPlayer = (hp: number) => {
        let player = new Player("Dummy Player", "Shoe washer");
        player.stat.hp = hp;
        return player;
    }
    test("Adding heal 100 to CompoundEffect and adding CompoundEffect to player", () => {
        let player = createPlayer(100);
        let healEffect = EffectFactory.createHealEffect(100);
        let compoundEffect = EffectFactory.createCompoundEffect("Test heal compound");
        compoundEffect.addEffect(MathUtil.uid(), healEffect);
        // Player's hp should be 100. 
        expect(player.stat.hp).toBe(100);
        EffectManager.addEffectsTo(player, compoundEffect);
        // Player's hp should still be 100. 
        expect(player.stat.hp).toBe(100);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
    })
    test("Adding stat effect to CompoundEffect and again.", () => {
        let player = createPlayer(100);
        player.stat.armor = 0;
        let clothArmor = EffectFactory.createStatEffect({
            armor: 10,
        });
        
        let clothArmorId1 = MathUtil.uid();
        let clothArmorId2 = MathUtil.uid();
        let clothArmor2 = EffectFactory.createStatEffect({
            armor: 10,
        })
        let compoundEffect = EffectFactory.createCompoundEffect("Armor");
        compoundEffect.addEffect(clothArmorId1, clothArmor);
        EffectManager.addEffectsTo(player, compoundEffect);
        // Added first armor to compoundeffect, not updated yet.
        expect(player.stat.armor).toBe(0);
        EffectManager.updateEffectsOn(player, 0.1);
        // Added first armor to compoundeffect, updated.
        expect(player.stat.armor).toBe(10);
        compoundEffect.addEffect(clothArmorId2, clothArmor2);
        // Added second armor to compoundeffect, not updated yet.
        expect(player.stat.armor).toBe(10);
        EffectManager.updateEffectsOn(player, 0.1);
        // Added second armor to compoundeffect, updated.
        expect(player.stat.armor).toBe(20);
        EffectManager.removeEffectFrom(player, compoundEffect);
        // Removed the compound effect, which also removes the 2 armor.
        expect(player.stat.armor).toBe(0);
    })
    test("EffectManager that uses CompoundEffect", () => {
        let player = createPlayer(100);
        player.stat.attack = 10;
        let bfSword = EffectFactory.createStatEffect({
            attack: 30,
        });
        let bfid = EffectManager.addStatEffectsTo(player, bfSword);
        // Added bfSword to player, not updated.
        expect(player.stat.attack).toBe(10);
        EffectManager.updateEffectsOn(player, 0.1);
        // Added bfSword to player, updated.
        expect(player.stat.attack).toBe(40);
        EffectManager.removeStatEffectFrom(player, bfid);
        expect(player.stat.attack).toBe(10);
    })
    test("EffectManager that uses CompoundEffect, more effects", () => {
        let player = createPlayer(100);
        player.stat.attack = 10;
        let bfSword = EffectFactory.createStatEffect({
            attack: 30,
        });
        let bfid = EffectManager.addStatEffectsTo(player, bfSword);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.attack).toBe(40);

        let longSword = EffectFactory.createStatEffect({
            attack: 10,
        })
        let lsid = EffectManager.addStatEffectsTo(player, longSword);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.attack).toBe(50);

        EffectManager.removeStatEffectFrom(player, bfid);
        expect(player.stat.attack).toBe(20);

        EffectManager.removeStatEffectFrom(player, lsid);
        expect(player.stat.attack).toBe(10);

        EffectManager.addStatEffectsTo(player, bfSword);
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.attack).toBe(40);
    })
})

