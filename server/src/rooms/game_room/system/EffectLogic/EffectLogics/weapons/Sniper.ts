import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class Sniper extends WeaponEffect{
    effectLogicId: string = "Sniper"
    protected weaponSprite: string = "sniper"
    protected activeRange?: number = 2000
    protected attackSound: string = ""
    protected angleBetweenAttacks = 15
    protected projectileSpeed = 50
    protected projectileSprite: string = "sniper_projectile"
    protected attackRequired: number = 5
    protected piercing: number = 10
    protected attackMultiplier: number = 3
    protected amount: number = 1

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({critRate: 0.05})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}