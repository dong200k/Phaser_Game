import GameManager from "../../../system/GameManager";
import { IProjectileConfig } from "../../../system/interfaces";
import Projectile from "../Projectile";
import MeleeProjectileController from "../projectilestates/meleestates/MeleeProjectileController";

/** A melee projectile has the MeleeProjectileController. This controller
 * lets the projectile have a windup time and a trigger. This is used so that it will seem like
 * the projectile hits the target when the projectile animation hits the target.
 */
export default class MeleeProjectile extends Projectile {

    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager) {
        super(projectileConfig, gameManager);
        this.projectileController = new MeleeProjectileController({projectile: this});
    }

}