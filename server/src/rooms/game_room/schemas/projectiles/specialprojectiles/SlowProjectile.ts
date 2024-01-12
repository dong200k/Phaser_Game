import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import Matter from "matter-js";
import Entity from "../../gameobjs/Entity";
import { type } from '@colyseus/schema';
import EffectManager from "../../../system/StateManagers/EffectManager";
import EffectFactory from "../../effects/EffectFactory";

/** 
 * This projectile follows the player. It is also updated at the client side so beware
 */
export default class SlowProjectile extends Projectile {
    private slowFactor: number = 0
    private slowTime: number = 0
    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        this.slowFactor = projectileConfig.data.slowFactor
        this.slowTime = projectileConfig.data.slowTime
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        this.slowFactor = projectileConfig.data.slowFactor
        this.slowTime = projectileConfig.data.slowTime
    }

    public onCollide(entity: Entity): void {
        EffectManager.addEffectsTo(entity, EffectFactory.createSpeedMultiplierEffectTimed(this.slowFactor, this.slowTime));
    }
}