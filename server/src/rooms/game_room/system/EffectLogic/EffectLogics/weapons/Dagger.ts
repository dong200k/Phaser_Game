import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class Dagger extends WeaponEffect{
    effectLogicId: string = "dagger"
    protected weaponSprite: string = "dagger"
    protected angleBetweenAttacks = 20
    protected activeTime = 2000
    protected projectileSpeed = 1
    protected projectileSprite: string = "dagger_projectile"
    protected attackRequired: number = 1
    protected piercing: number = -1
    protected attackMultiplier: number = 1
    protected amount: number = 1
    protected spawnOffset: number = 50

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({attackSpeedPercent: 0.15})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}