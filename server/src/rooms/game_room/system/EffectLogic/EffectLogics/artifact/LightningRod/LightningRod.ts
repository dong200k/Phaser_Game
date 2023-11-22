import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import Stat from "../../../../../schemas/gameobjs/Stat"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import { getFinalArea } from "../../../../Formulas/formulas"
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
    private baseDamageMult = 2.5
    private timeBetweenLightning = 175
    private lightningCount = 1
    private spawnArea = 25

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
        let count = this.getAmount(playerState.stat)

        for(let i=0;i<count;i++){
            setTimeout(()=>{
                this.spawnLightning(playerState, gameManager)
            }, this.timeBetweenLightning * i);
        }
    }

    private spawnLightning(playerState: Player, gameManager: GameManager){
        let {x: playerX, y: playerY} = playerState.getBody().position
        let area = getFinalArea(playerState.stat, this.spawnArea)
        let areaX = area
        let areaY = area
        if(Math.random()<0.5) areaX *= -1
        if(Math.random()<0.5) areaY *= -1

        let projectileConfig: IProjectileConfig = {
            sprite: "Lightning",
            stat: playerState.stat,
            spawnX: playerX + Math.random()*areaX,
            spawnY: playerY + Math.random()*areaY,
            width: this.width,
            height: this.height,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "LightningRod",
            attackMultiplier: this.getMult(),
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "lightningrod",
            classType: "MeleeProjectile",
            originEntityId: playerState.getId(),
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }

    
    /**
     * 
     * @returns The total damage multiplier
     */
    public getMult(){
        return this.baseDamageMult * this.damageMult
    }

    /**
     * 
     * @returns The amount of projectiles fired each time taking into account player stat
     */
    public getAmount({amount}: Stat){
        return this.lightningCount + amount
    }
}

