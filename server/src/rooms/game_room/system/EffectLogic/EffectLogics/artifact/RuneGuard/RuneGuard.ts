import MathUtil from "../../../../../../../util/MathUtil"
import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import { getFinalArea } from "../../../../Formulas/formulas"
import GameManager from "../../../../GameManager"
import { GameEvents, IProjectileConfig, ITriggerType } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"
import RuneGuardController from "./RuneGuardController"

/** 
 * Artifact that summons crystal runes around player that shoots lasers.
*/
export class RuneGuard extends EffectLogic{
    effectLogicId = "RuneGuard" 
    triggerType: ITriggerType = "none"

    private AMOUNT_CAP = 6
    private firstTime = true
    private width = 30
    private height = 50
    /** x distance at which the rune crystals spawn/are away from player */
    private distanceX = 50
    /** y distance at which the vertically placed runes are from each other*/
    private distanceY = 50
    private laserDamage = 1
    private amount = 1

    /** Multiplies the laser damage */
    private damageMult = 1
    private cooldownReduction = 1
    private timeSoFar = 0
    private timeTilUpdateAmount = 1

    private runeCount = 0
    private playerState?: Player
    private gameManager?: GameManager

    private spawned = false
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree){
        if(this.firstTime) {
            this.firstTime = false
            this.playerState = playerState
            this.gameManager = gameManager
            this.spawnRunes()
        }
    }

    public update(deltaT: number): void {
        this.timeSoFar += deltaT
        if(this.timeSoFar === this.timeTilUpdateAmount){
            this.spawnRunes()
        }
    }

    private spawnRunes(){
        if(!this.playerState) return

        let count = Math.min(this.amount + this.playerState.stat.amount, this.AMOUNT_CAP)
        for(let i=this.runeCount;i<count;i++){
            // console.log(`runeCount: ${this.runeCount}, i: ${i}, count: ${count}, rune guard amount: ${this.amount}`)
            this.spawnRune(i)
            this.runeCount++
        }
    }   

    private spawnRune(runeNumber: number){
        if(!this.playerState) return
        if(!this.gameManager) return

        let {x: playerX, y: playerY} = this.playerState.getBody().position

        let offsetX = runeNumber%2 === 0? this.distanceX : -this.distanceX
        let group = Math.floor(runeNumber/2)
        let offsetY = 0
        if(group !== 0) {
            let temp = Math.floor((group - 1) / 2)
            let verticalGap = (temp + 1) * this.distanceY
            // console.log(`rune number: ${runeNumber}, verticalGap: ${verticalGap}`)
            offsetY = (group - 1)%2 === 0? -verticalGap : verticalGap
        }

        let projectileConfig: IProjectileConfig = {
            sprite: "crystal",
            stat: this.playerState.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            width: this.width,
            height: this.height,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "NONE",
            poolType: "Rune Guard",
            attackMultiplier: this.laserDamage * this.damageMult,
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: 5000,
            // repeatAnimation: true,
            // spawnSound: "lightningrod",
            classType: "FollowingMeleeProjectile",
            originEntityId: this.playerState.getId(),
            data: {
                owner: this.playerState,
                offsetX,
                offsetY,
                config: {
                    gameManager: this.gameManager,
                    runeGuardEffectLogic: this
                }
            },
            projectileControllerCtor: RuneGuardController
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }

    /**
     * Returns attack multiplier of the laser
     */
    public getAttackMultiplier(){
        return this.damageMult * this.laserDamage
    }

    public getCooldownReduction(){
        return this.cooldownReduction
    }

    public increaseDamage(number: number){
        this.damageMult += number
    }

    public increaseAmount(number: number){
        this.amount += number
        this.spawnRunes()
    }

    public applyCooldownReduction(cooldownReduction: number){
        this.cooldownReduction *= (1 - cooldownReduction)
    }
}

