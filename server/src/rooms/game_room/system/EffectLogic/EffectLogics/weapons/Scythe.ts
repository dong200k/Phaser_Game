import MathUtil from "../../../../../../util/MathUtil";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import Player from "../../../../schemas/gameobjs/Player";
import { CategoryType } from "../../../Collisions/Category";
import GameManager from "../../../GameManager";
import EffectManager from "../../../StateManagers/EffectManager";
import { IProjectileConfig } from "../../../interfaces";
import WeaponEffect from "./WeaponEffect";

export default class Scythe extends WeaponEffect{
    effectLogicId: string = "Scythe"
    protected weaponSprite: string = "dagger"
    protected attackMultiplier: number = 1
    protected amount: number = 1
    protected radius: number = 100
    protected projectileSpeed = 1000

    protected summonWeapon(playerState: Player, gameManager: GameManager){
        let width = this.getFinalWidth()
        let height = this.getFinalHeight()
        let {x, y} = playerState.getBody().position

        let angle = 360 * this.weaponNumber/this.maxWeaponNumber 
        let {x: offsetX, y: offsetY} = MathUtil.getRotatedSpeed(0, 0, this.radius, angle)
        
        let projectileConfig: IProjectileConfig = {
            sprite: this.weaponSprite,
            stat: playerState.stat,
            spawnX: x + offsetX,
            spawnY: y + offsetY,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: this.weaponSprite,
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "CircularFollowProjectile",
            originEntityId: playerState.getId(),
            projectileSpeed: this.projectileSpeed,
            dontRotate: true,
            repeatAnimation: true,
            piercing: -1,
            data: {
                startAngle: angle,
                radius: this.radius
            }
        }
        
        this.weapon = gameManager.getProjectileManager().spawnProjectile(projectileConfig, projectileConfig.classType).projectile
    }

    protected applyStatChange(playerState: Player, gameManager: GameManager): void {
        let statEffect = EffectFactory.createStatEffect({lifeSteal: 0.1})
        EffectManager.addEffectsTo(playerState, statEffect)
    }
}