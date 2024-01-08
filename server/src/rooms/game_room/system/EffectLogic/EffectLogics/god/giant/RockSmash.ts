import MathUtil from "../../../../../../../util/MathUtil";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import AttackTriggeredUpgrade from "../AttackTriggeredGodUpgrade";
import CooldownGodUpgrade from "../CooldownGodUpgrade";

export default class RockSmash extends AttackTriggeredUpgrade{
    effectLogicId: string = "RockSmash"
    protected spawnOffset = 0
    protected attackPoolType = "rock_smash"
    protected projectileSprite = "rock_smash"
    protected attackSound = ""
    protected activeTime?: number = 1000
    protected activeRange?: number = undefined
    protected timeBetweenProjectiles = 100
    protected angleBetweenAttacks = 30
    protected projectileSpeed = 0
    protected attackMultiplier: number = 1
    protected attackRequired: number = 3
    protected triggerChance: number = 1
    protected piercing: number = -1
    protected maxHealthDamageMult = 0.1

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
                extraDamage: this.getExtraDamage(playerState)
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
        this.maxHealthDamageMult += 0.05
    }

    private upgrade2(){
        this.maxHealthDamageMult += 0.1
    }

    private upgrade3(){
        this.amount += 1
    }

    private upgrade4(){
        this.attackRequired -= 1
    }

    private upgrade5(){
        this.amount += 1
    }
    
    public getAttackMult(playerState?: Player): number {
        if(!playerState) return this.attackMultiplier * this.bonusAttackMultiplier
        else return this.attackMultiplier * this.bonusAttackMultiplier
    }

    public getExtraDamage(playerState: Player) {
        return playerState.stat.maxHp * this.maxHealthDamageMult
    }
}