import MathUtil from "../../../../../../../util/MathUtil";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../../schemas/gameobjs/Player";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import GameManager from "../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import AttackTriggeredUpgrade from "../AttackTriggeredGodUpgrade";
import CooldownGodUpgrade from "../CooldownGodUpgrade";
import MovementTriggeredUpgrade from "../MovementTriggeredUpgrade";

export default class LightningMovement extends MovementTriggeredUpgrade{
    effectLogicId: string = "LightningMovement"
    protected spawnOffset = 0
    protected attackPoolType = "Lightning_bolt_attack"
    protected projectileSprite = "Lightning"
    protected attackSound = "lightningrod"
    protected activeTime?: number = 1000
    protected activeRange?: number = undefined
    protected timeBetweenProjectiles = 100
    protected angleBetweenAttacks = 30
    protected projectileSpeed = 0
    protected attackMultiplier: number = 1
    protected piercing: number = -1
    protected maxHealthDamageMult = 0.1
    protected attackRequired: number = 5
    protected distanceThreshold: number = 300

    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade2, this.upgrade3, this.upgrade4, this.upgrade5])
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let playerBody = playerState.getBody()

        const spawnProjectile = (velocity: {x: number, y: number}) => {
            let target = this.getTarget(playerState, gameManager)
            if(!target) return
            // console.log(`spawn projectile spawn offset: ${offsetX}, ${offsetY}`)
            let projectileConfig: IProjectileConfig = {
                sprite: this.projectileSprite,
                stat: playerState.stat,
                spawnX: target.x,
                spawnY: target.y,
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
        
        let velocity = {x: 0, y: 0}

        spawnProjectilesRotated(spawnProjectile, this.angleBetweenAttacks, this.getAmount(playerState.stat), velocity.x, velocity.y, this.projectileSpeed, this.timeBetweenProjectiles)
    }

    private upgrade1(){
        this.distanceTraveled *= 0.90
    }

    private upgrade2(){
        this.amount += 1
    }

    private upgrade3(){
        this.distanceTraveled *= 0.90
    }

    private upgrade4(){
        this.amount += 2
    }

    private upgrade5(){
        this.distanceTraveled *= 0.90
    }
    
    public getAttackMult(playerState?: Player): number {
        if(!playerState) return this.attackMultiplier * this.bonusAttackMultiplier
        else return this.attackMultiplier * this.bonusAttackMultiplier
    }

    protected getTarget(player: Player, gameManager: GameManager): Player | Monster {
        let monsters: Monster[] = []
        gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Monster && obj.isActive()){
                monsters.push(obj)
            }
        })

        let choice = Math.floor(Math.random() * monsters.length)
        return monsters[choice]
    }
}