import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class MachineGun extends WeaponEffect{
    effectLogicId: string = "MachineGun"
    protected weaponSprite: string = "machinegun"
    protected activeRange?: number = 700
    protected activeTime?: number | undefined = 1000
    protected attackSound: string = ""
    protected angleBetweenAttacks = 10
    protected projectileSpeed = 30
    protected projectileSprite: string = "machinegun_projectile"
    protected attackRequired: number = 0.3
    protected piercing: number = 1
    protected attackMultiplier: number = 0.3
    protected amount: number = 3
    protected timeBetweenProjectiles: number = 100
    protected timeBetweenAttacks: number = 100

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({speed: -0.05 * playerState.stat.speed})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}