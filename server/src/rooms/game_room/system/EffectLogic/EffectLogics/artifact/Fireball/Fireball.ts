import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig, ITriggerType } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"

interface IFireballConfig {
    effectLogicId?: string,
    /** Multiplies the base fireball damage */
    fireballExplosionMult?: number,
    /** MUltiplies the base explosion damage */
    fireballMult?: number,
    /** Multiplies the base explosion radius */
    explosionRadiusMult?: number
}

/** 
 * Artifact that shoots out exploding fireballs on player attack occasionally
*/
export class Fireball extends EffectLogic{
    effectLogicId = "Fireball" 
    triggerType: ITriggerType = "player attack"

    /** Multiplies the base radius/damage */
    private fireballExplosionMult = 1
    private fireballMult = 1
    private explosionRadiusMult = 50

    private projectileSpeed = 5
    private fireballRadius = 50

    /** Base damage/radius */
    private baseFireballMult = 1
    private baseFireballExplosionMult = 1
    private baseExplosionRadius = 50

    constructor(config?: IFireballConfig){
        super(config)

        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.fireballExplosionMult = config?.fireballExplosionMult ?? this.fireballExplosionMult
        this.fireballMult = config?.fireballMult ?? this.fireballMult
        this.explosionRadiusMult = config?.explosionRadiusMult ?? this.explosionRadiusMult
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, {mouseX, mouseY}: {mouseX: number, mouseY: number}){
        this.spawnFireball(playerState, gameManager, mouseX, mouseY)
    }

    private spawnFireball(playerState: Player, gameManager: GameManager, mouseX: number, mouseY: number){
        let {x: playerX, y: playerY} = playerState.getBody().position
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, this.projectileSpeed)

        let projectileConfig: IProjectileConfig = {
            sprite: "Fireball",
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: this.fireballRadius,
            height: this.fireballRadius,
            initialVelocity: velocity,
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Fireball",
            attackMultiplier: this.fireballMult * this.baseFireballMult,
            magicMultiplier: 0,
            activeTime: 3000,
            spawnSound: "fireball_whoosh",
            onCollideCallback: this.getFireballOnCollide(gameManager),
            classType: "Projectile"
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }

    private getFireballOnCollide(gameManager: GameManager){
        const spawnProjectile = (projectileConfig: IProjectileConfig) => {
            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
            });
        }

        return (projectile: Projectile)=>{
            let pos = projectile.getBody().position
            let {x: spawnX, y: spawnY} = pos
    
            let projectileConfig: IProjectileConfig = {
                sprite: "Fireball",
                stat: projectile.stat,
                spawnX,
                spawnY,
                width: this.explosionRadiusMult * this.baseExplosionRadius,
                height: this.explosionRadiusMult * this.baseExplosionRadius,
                initialVelocity: {x: 0, y: 0},
                collisionCategory: "PLAYER_PROJECTILE",
                poolType: "Fireball explosion",
                attackMultiplier: this.fireballExplosionMult * this.baseFireballExplosionMult,
                magicMultiplier: 0,
                activeTime: 1000,
                animationKey: "explode",
                piercing: 20,
                // repeatAnimation: true,
                spawnSound: "explosion_1",
                dontDespawnOnObstacleCollision: true,
                classType: "Projectile"
            }
            
            spawnProjectile(projectileConfig)
        }
    } 
}

