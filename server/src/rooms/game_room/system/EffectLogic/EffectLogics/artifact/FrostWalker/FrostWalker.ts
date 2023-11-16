import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import { getFinalArea, undoCooldownReduction } from "../../../../Formulas/formulas"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig, ITriggerType } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"

interface IFrostWalkerConfig {
    effectLogicId?: string,
    /** Multiplies the base damage */
    damageMult?: number,
    amount?: number,
}

/** 
 * Artifact that spawns frost where the player steps. Scales with amount and distance traveled(movement speed)
*/
export class FrostWalker extends EffectLogic{
    effectLogicId = "FrostWalker" 
    triggerType: ITriggerType = "none"

    private AMOUNT_CAP = 3
    private sideLength = 50
    private baseDamageMult = 0.5
    private amount = 1
    private spawnArea = 0
    private timeBetweenSpawns = 200
    private duration = 2

    /** Multiplies the base damage */
    private damageMult = 1
    private durationMult = 1
    /** scales the area and spawn area */
    private areaScale = 1

    private distanceTraveled = 0
    /** Distance traveled til frost is spawned */
    private distanceThreshold = 0.5
    private timePassed = 0

    private playerState?: Player
    private gameManager?: GameManager

    constructor(config?: IFrostWalkerConfig){
        super(config)

        this.effectLogicId = config?.effectLogicId ?? this.effectLogicId
        this.damageMult = config?.damageMult ?? this.damageMult
        this.amount = config?.amount ?? this.amount
    }

    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree){
        if(!this.playerState) this.playerState = playerState
        if(!this.gameManager) this.gameManager = gameManager
    }

    public update(deltaT: number): void {
        if(!this.playerState) return
        // console.log("distance traveled: ", this.distanceTraveled)

        if(this.distanceTraveled > this.distanceThreshold){
            // console.log("distance traveled: ", this.distanceTraveled)
            // console.log("time: ", this.timePassed)
            this.distanceTraveled -= this.distanceThreshold
            this.spawnFrosts()
        }

        let speed = MathUtil.getSpeedFromVelocity(this.playerState.getBody().velocity)
        let actualDeltaT = undoCooldownReduction(this.playerState.stat, deltaT)
        this.timePassed += actualDeltaT
        this.distanceTraveled += speed * actualDeltaT
    }

    private spawnFrosts(){
        if(!this.playerState) return
        let count = Math.min(this.amount + this.playerState.stat.amount, this.AMOUNT_CAP)

        for(let i=0;i<count;i++){
            setTimeout(()=>{
                this.spawnOneFrost()
            }, this.timeBetweenSpawns * i);
        }
    }

    private spawnOneFrost(){
        if(!this.playerState) return
        if(!this.gameManager) return

        let {x: playerX, y: playerY} = this.playerState.getBody().position

        // Scale spawn area by player stat
        let count = Math.min(this.amount + this.playerState.stat.amount, this.AMOUNT_CAP)
        let area = getFinalArea(this.playerState.stat, (this.spawnArea + 10 * count) * this.areaScale)
        let areaX = area * Math.random()
        let areaY = area * Math.random()
        if(Math.random()<0.5) areaX *= -1
        if(Math.random()<0.5) areaY *= -1

        // Scale sprite length by player stat (assuming its a square)
        let length = Math.sqrt(getFinalArea(this.playerState.stat, this.sideLength**2 * this.areaScale))
        // console.log(length)
        let projectileConfig: IProjectileConfig = {
            sprite: "frost_ground",
            stat: this.playerState.stat,
            spawnX: playerX + areaX,
            spawnY: playerY + areaY,
            width: length,
            height: length,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Frost Walker",
            attackMultiplier: this.baseDamageMult * this.damageMult,
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 1000,
            repeatAnimation: false,
            spawnSound: "frost_walk",
            classType: "MeleeProjectile",
            originEntityId: this.playerState.getId(),
            data: {
                attackDuration: this.duration * this.durationMult,
                triggerPercent: 1,
                unTriggerPercent: 0.1
            }
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }

    increaseDamage(number: number){
        this.damageMult += number
    }

    increaseArea(number: number){
        this.areaScale += number
    }

    increaseAmount(number: number){
        this.amount += number
    }

    increaseDuration(number: number){
        this.durationMult += number
    }
}


