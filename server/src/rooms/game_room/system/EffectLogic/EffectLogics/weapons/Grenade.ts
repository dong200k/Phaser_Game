import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class Grenade extends WeaponEffect{
    effectLogicId: string = "Grenade"
    protected weaponSprite: string = "grenade"
    protected angleBetweenAttacks = 45
    protected activeTime = 1000
    protected projectileSpeed = 1
    protected projectileSprite: string = "grenade_projectile"
    protected attackRequired: number = 5
    protected piercing: number = 10
    protected attackMultiplier: number = 2
    protected amount: number = 1
    protected spawnOffset: number = 50

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({armor: -0.25 * playerState.stat.armor})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}