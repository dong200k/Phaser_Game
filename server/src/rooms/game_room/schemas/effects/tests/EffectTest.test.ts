import EffectManager from "../../../system/StateManagers/EffectManager";
import Player from "../../gameobjs/Player"
import EffectFactory from "../EffectFactory";


describe('Instant HP Effect', () => {
    let player = new Player("Bob", "Moose");
    player.stat.hp = 100;
    test("heal 100 hp", () => {
        EffectManager.addEffectsTo(player, EffectFactory.createHealEffect(100));
        EffectManager.updateEffectsOn(player, 0.1);
        expect(player.stat.hp).toBe(200);
    })
})