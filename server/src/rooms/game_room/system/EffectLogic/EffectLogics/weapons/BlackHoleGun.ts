import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class BlackHoleGun extends WeaponEffect{
    effectLogicId: string = "BlackHoleGun"
    protected weaponSprite: string = "blackholegun"
    protected activeTime = 1000
    protected angleBetweenAttacks = 30
    protected projectileSpeed = 0.1
    protected projectileSprite: string = "blackholegun_projectile"
    protected attackRequired: number = 100
    protected piercing: number = -1
    protected attackMultiplier: number = 100
    protected amount: number = 1
    protected spawnOffset: number = 150
    protected width: number = 100
    protected height: number = 100

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({armor: -0.25 * playerState.stat.armor})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}