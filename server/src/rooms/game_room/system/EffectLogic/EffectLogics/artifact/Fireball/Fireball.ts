import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import Stat from "../../../../../schemas/gameobjs/Stat"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import { getFinalArea } from "../../../../Formulas/formulas"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig, ITriggerType } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"
import { spawnProjectilesRotated } from "../../helper"

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
    private explosionRadiusMult = 1

    private projectileSpeed = 5
    private fireballRadius = 50

    /** Amount of fireball fired each time */
    private amount = 1

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
        let amount = this.amount + playerState.stat.amount
        let increment = 10
        let x = mouseX - playerState.getBody().position.x
        let y = mouseY - playerState.getBody().position.y
        
        spawnProjectilesRotated(this.spawnFireball(playerState, gameManager), increment, amount, x, y, this.projectileSpeed)
    }

    private spawnFireball(playerState: Player, gameManager: GameManager){
        return (velocity: {x: number, y: number})=>{
            let {x: playerX, y: playerY} = playerState.getBody().position
            // let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, this.projectileSpeed)
            // let velocity = MathUtil.getRotatedSpeed(mouseX - playerX, mouseY - playerY, this.projectileSpeed, angle)
    
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
                onCollideCallback: this.getFireballOnCollide(gameManager, playerState),
                classType: "Projectile",
                originEntityId: playerState.getId(),
            }
    
            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
            });
        }
    }

    private getFireballOnCollide(gameManager: GameManager, playerState: Player){
        const spawnProjectile = (projectileConfig: IProjectileConfig) => {
            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
            });
        }

        return (projectile: Projectile)=>{
            let pos = projectile.getBody().position
            let {x: spawnX, y: spawnY} = pos
    
            let area = getFinalArea(playerState.stat, this.explosionRadiusMult * this.baseExplosionRadius)
            let projectileConfig: IProjectileConfig = {
                sprite: "Fireball",
                stat: projectile.stat,
                spawnX,
                spawnY,
                width: area,
                height: area,
                initialVelocity: {x: 0, y: 0},
                collisionCategory: "PLAYER_PROJECTILE",
                poolType: "Fireball explosion",
                attackMultiplier: this.fireballExplosionMult * this.baseFireballExplosionMult,
                magicMultiplier: 0,
                activeTime: 1000,
                animationKey: "explode",
                piercing: 20,
                repeatAnimation: false,
                spawnSound: "explosion_1",
                dontDespawnOnObstacleCollision: true,
                classType: "Projectile",
                originEntityId: playerState.getId(),
            }
            
            spawnProjectile(projectileConfig)
        }
    } 

    public increaseFireballDamage(damage: number){
        this.fireballMult += damage
        this.fireballExplosionMult += damage
    }

    public increaseFireballArea(number: number){
        this.explosionRadiusMult += number
    }

    public increaseFireballAmount(number: number){
        this.amount += number
    }

    /**
     * 
     * @returns The total damage multiplier for the fireball explosion + fireball itself
     */
    public getMult(){
        return this.fireballExplosionMult * this.baseFireballExplosionMult + this.fireballMult + this.baseFireballMult
    }

    /**
     * 
     * @returns The amount of fireballs fired each time taking into account player stat
     */
    public getAmount({amount}: Stat){
        return this.amount + amount
    }
}


