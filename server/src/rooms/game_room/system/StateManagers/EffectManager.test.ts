import Player from "../../schemas/gameobjs/Player";
import EffectManager from "./EffectManager";

describe("EffectManager tests", () => {
    const createPlayer = (hp: number) => {
        let player = new Player("Dummy Player", "Shoe washer");
        player.stat.hp = hp;
        return player;
    }
    test("getStatCompoundEffectFrom() works as expected", () => {
        let player = createPlayer(100);
        let effect = EffectManager.getStatCompoundEffectFrom(player);
        let effect2 = EffectManager.getStatCompoundEffectFrom(player);
        expect(effect === effect2).toBeTruthy();
    })  
})