import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import Monster from "../../gameobjs/monsters/Monster";
import MathUtil from "../../../../../util/MathUtil";
import Cooldown from "../../gameobjs/Cooldown";
import ArrowRainProjectileController from "../../../system/EffectLogic/EffectLogics/abilities/RangerAbility/ArrowRainProjectileController";

/** Projectile for the Ranger's arrow rain ability. This projectile is controlled by the ArrowRainProjectileController */
export default class ArrowRainProjectile extends Projectile{

    private arrowRainProjectileController: ArrowRainProjectileController
    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(projectileConfig, gameManager)
        this.arrowRainProjectileController = new ArrowRainProjectileController({
            ...projectileConfig.data.config,
            projectile: this
        })
    }

    public update(deltaT: number): void {
        super.update(deltaT)
        this.arrowRainProjectileController.update(deltaT)
    }

    public reset(): void {
        super.reset()
    }

    public setConfig(projectileConfig: IProjectileConfig): void {
        super.setConfig(projectileConfig)
        this.arrowRainProjectileController.resetConfig(projectileConfig.data.config)
    }
}