import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import CooldownGodUpgrade from "../CooldownGodUpgrade";

export default class BloodBullet extends CooldownGodUpgrade{
    effectLogicId: string = "BloodBullet"
    protected cooldownTime = 3
    protected cooldown?: Cooldown | undefined = new Cooldown(this.cooldownTime)
    protected spawnOffset = 0
    protected attackPoolType = "blood_bullet"
    protected projectileSprite = "blood_bullet"
    protected activeRange?: number = 1000
    protected attackSound = "water_drop"
    protected activeTime?: number = 2000
    protected timeBetweenProjectiles = 0
    protected angleBetweenAttacks = 15
    protected projectileSpeed = 5
    protected attackMultiplier: number = 2
    protected piercing: number = 1
    private healthCost = 1
    protected amount: number = 3

    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade2.bind(this), this.upgrade3.bind(this), this.upgrade4.bind(this), this.upgrade5.bind(this)]
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let playerBody = playerState.getBody()
        if(playerState.stat.hp <= playerState.stat.maxHp * 0.1 || playerState.stat.hp <= this.getAmount(playerState.stat) * this.healthCost) return
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

            let damageEffect = EffectFactory.createDamageEffect(this.healthCost)
            EffectManager.addEffectsTo(playerState, damageEffect)
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
        // console.log("blood bullet upgrade 1")
        this.piercing+=2
        this.amount++
    }

    private upgrade2(){
        this.bonusAttackMultiplier += 1
        this.healthCost += 1
    }

    private upgrade3(){
        this.piercing+=2
        this.amount++
    }

    private upgrade4(){
        this.bonusAttackMultiplier += 1
        this.healthCost += 1
    }

    private upgrade5(){
        this.amount+=3
    }
    
    public getAttackMult(playerState?: Player): number {
        if(!playerState) return this.attackMultiplier * this.bonusAttackMultiplier
        else return this.attackMultiplier * this.bonusAttackMultiplier + playerState.stat.critRate/1
    }
}