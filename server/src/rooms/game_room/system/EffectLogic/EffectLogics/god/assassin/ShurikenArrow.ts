import MathUtil from "../../../../../../../util/MathUtil";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import CooldownGodUpgrade from "../CooldownGodUpgrade";

export default class ShurikenArrow extends CooldownGodUpgrade{
    effectLogicId: string = "ShurikenArrow"
    protected cooldownTime = 5
    protected cooldown?: Cooldown | undefined = new Cooldown(this.cooldownTime)
    protected spawnOffset = 0
    protected attackPoolType = "shuriken_arrow_projectile"
    protected projectileSprite = "shuriken_arrow"
    protected activeRange?: number = 2500
    protected attackSound = ""
    protected activeTime?: number = undefined
    protected timeBetweenProjectiles = 0
    protected angleBetweenAttacks = 20
    protected projectileSpeed = 25
    protected attackMultiplier: number = 1
    protected piercing: number = -1

    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade2, this.upgrade3, this.upgrade4, this.upgrade5])
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let playerBody = playerState.getBody()
        const spawnProjectile = (velocity: {x: number, y: number}) => {
            let unitDir = MathUtil.getNormalizedSpeed(velocity.x, velocity.y, 1)
            let offsetX = this.spawnOffset * unitDir.x
            let offsetY = this.spawnOffset * unitDir.y
            // console.log(`spawn projectile spawn offset: ${offsetX}, ${offsetY}`)
            let projectileConfig: IProjectileConfig = {
                sprite: this.projectileSprite,
                stat: playerState.stat,
                spawnX: playerBody.position.x + offsetX,
                spawnY: playerBody.position.y + offsetY,
                width: this.getFinalWidth(),
                height: this.getFinalHeight(),
                initialVelocity: velocity,
                collisionCategory: "PLAYER_PROJECTILE",
                poolType: this.attackPoolType === ""? this.projectileSprite : this.attackPoolType,
                attackMultiplier: this.getAttackMult(playerState),
                magicMultiplier: this.getMagicMult(playerState),
                dontDespawnOnObstacleCollision: true,
                range: this.activeRange,
                activeTime: this.activeTime,
                repeatAnimation: false,
                spawnSound: this.attackSound,
                piercing: this.getPiercing(),
                classType: "Projectile",
                originEntityId: playerState.getId(),
                // dontRotate: true,
            }

            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
            });
        }
        
        let target = this.getTarget(playerState, gameManager)
        if(target){
            // console.log(`attempting attack stage 3: ${this.effectLogicId}`)
            let velocity = {x: target.x - playerBody.position.x, y: target.y - playerBody.position.y}

            // let velocity = {x: target.getBody().position.x - weaponBody.position.x, y: target.getBody().position.y - weaponBody.position.y}
            spawnProjectilesRotated(spawnProjectile, this.angleBetweenAttacks, this.getAmount(playerState.stat), velocity.x, velocity.y, this.projectileSpeed, this.timeBetweenProjectiles)
        }
    }

    private upgrade1(){
        this.cooldownTime -= 1
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade2(){
        this.bonusAttackMultiplier += 0.25
    }

    private upgrade3(){
        this.amount += 1
    }

    private upgrade4(){
        this.cooldownTime -= 1
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade5(){
        this.amount += 1
    }
    
    public getAttackMult(playerState?: Player): number {
        if(!playerState) return this.attackMultiplier * this.bonusAttackMultiplier
        else return this.attackMultiplier * this.bonusAttackMultiplier + playerState.stat.critRate/1
    }
}