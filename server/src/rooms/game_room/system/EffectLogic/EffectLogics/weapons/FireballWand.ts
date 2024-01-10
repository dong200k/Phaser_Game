import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import WeaponEffect from "./WeaponEffect";

export default class FireballWand extends WeaponEffect{
    effectLogicId: string = "FireballWand"
    protected weaponSprite: string = "fire_wand"
    protected activeRange?: number = 2000
    protected activeTime?: number | undefined = 1000
    protected angleBetweenAttacks = 30
    protected projectileSpeed = 10
    protected projectileSprite: string = "Fireball"
    protected attackRequired: number = 2
    protected piercing: number = 1
    protected attackMultiplier: number = 1
    protected amount: number = 1
    protected attackPoolType: string = "Fireball_wand_attack"
    protected attackSound: string = "fireball_whoosh"

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({armor: -0.25 * playerState.stat.armor})
        EffectManager.addEffectsTo(playerState, statEffect)
    }

    protected getAttackMult(): number {
        return 0
    }

    protected getMagicMult(): number {
        return this.getMult()
    }
}