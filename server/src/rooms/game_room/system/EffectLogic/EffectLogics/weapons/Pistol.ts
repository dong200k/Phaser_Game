import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class Pistol extends WeaponEffect{
    effectLogicId: string = "Pistol"
    protected weaponSprite: string = "pistol"
    protected activeRange?: number = 500
    protected activeTime?: number | undefined = 1000
    protected angleBetweenAttacks = 15
    protected projectileSpeed = 30
    protected projectileSprite: string = "pistol_projectile"
    protected attackRequired: number = 1
    protected piercing: number = 1
    protected attackMultiplier: number = 1
    protected amount: number = 1
    protected attackSound: string = "pistol"

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({critRate: 0.05})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}