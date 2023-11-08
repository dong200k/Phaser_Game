import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig, ITriggerType } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"

interface ILightningConfig {
    effectLogicId?: string,
    /** Multiplies the base lightning damage */
    damageMult?: number,
    /** Number of lightning bolts to fire */
    lightningCount?: number,
    /** If lightningCount >= 2 this will be the time in milliseconds between the lightning bolts */
    timeBetweenLightning?: number
}

/** 
 * Artifact that drops down lightning on player occasionally
*/
export class LightningRod extends EffectLogic{
    effectLogicId = "LightningRod" 
    triggerType: ITriggerType = "none"

    private width = 50
    private height = 100
    private baseDamageMult = 5
    private timeBetweenLightning = 300
    private lightningCount = 1

    /** Multiplies the base lightning damage */
    private damageMult = 1

    constructor(config?: ILightningConfig){
        super(config)

        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.damageMult = config?.damageMult ?? this.damageMult
        this.lightningCount = config?.lightningCount ?? this.lightningCount
        this.timeBetweenLightning = config?.timeBetweenLightning ?? this.timeBetweenLightning
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree){
        // console.log("spawning lightning")
        for(let i=0;i<this.lightningCount;i++){
            if(i==0) this.spawnLightning(playerState, gameManager)
            else{
                setTimeout(()=>{
                    this.spawnLightning(playerState, gameManager)
                }, this.timeBetweenLightning);
            }
        }
    }

    private spawnLightning(playerState: Player, gameManager: GameManager){
        let {x: playerX, y: playerY} = playerState.getBody().position

        let projectileConfig: IProjectileConfig = {
            sprite: "Lightning",
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            width: this.width,
            height: this.height,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "LightningRod",
            attackMultiplier: this.baseDamageMult * this.damageMult,
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "lightningrod",
            classType: "MeleeProjectile"
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }
}

