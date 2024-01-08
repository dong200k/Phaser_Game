import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import Projectile from "../../../../../schemas/projectiles/Projectile";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import CooldownGodUpgrade from "../CooldownGodUpgrade";

export default class LifeDrain extends CooldownGodUpgrade{
    effectLogicId: string = "LifeDrain"
    protected cooldownTime = 10
    protected cooldown?: Cooldown | undefined = new Cooldown(this.cooldownTime)
    protected spawnOffset = 0
    protected attackPoolType = "life_drain"
    protected projectileSprite = "life_drain"
    protected activeRange?: number = undefined
    protected attackSound = ""
    protected activeTime?: number = 1000
    protected timeBetweenProjectiles = 0
    protected projectileSpeed = 0
    protected attackMultiplier: number = 1
    protected piercing: number = -1
    protected duration: number = 2
    protected healthGainPerTargetHit = 0.5

    public initUpgradeFunctions(): void {
        this.upgradeFunctions.concat([this.upgrade1, this.upgrade2, this.upgrade3, this.upgrade4, this.upgrade5])
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let playerBody = playerState.getBody()
        // console.log(`spawn projectile spawn offset: ${offsetX}, ${offsetY}`)
        for(let offsetX of [50, -50]){
            let projectileConfig: IProjectileConfig = {
                sprite: this.projectileSprite,
                stat: playerState.stat,
                spawnX: playerBody.position.x + offsetX,
                spawnY: playerBody.position.y,
                width: this.getFinalWidth(),
                height: this.getFinalHeight(),
                initialVelocity: {x: 0, y: 0},
                collisionCategory: "PLAYER_PROJECTILE",
                poolType: this.attackPoolType === ""? this.projectileSprite : this.attackPoolType,
                attackMultiplier: this.getAttackMult(playerState),
                magicMultiplier: this.getMagicMult(playerState),
                dontDespawnOnObstacleCollision: true,
                range: this.activeRange,
                activeTime: this.getDuration() * 1000,
                repeatAnimation: true,
                spawnSound: this.attackSound,
                piercing: this.getPiercing(),
                classType: "FollowingMeleeProjectile",
                originEntityId: playerState.getId(),
                data: {
                    owner: playerState
                },
                onCollideCallback: (projectile: Projectile, entity: Entity) => {
                    let healEffect = EffectFactory.createHealEffect(this.healthGainPerTargetHit)
                    EffectManager.addEffectsTo(playerState, healEffect)
                }
                // dontRotate: true,
            }
    
            gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
                ...projectileConfig,
            });
        }
    }

    private upgrade1(){
        this.cooldownTime -= 1
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade2(){
        this.healthGainPerTargetHit += 0.5
    }

    private upgrade3(){
        this.bonusDurationMultiplier += 0.5
    }

    private upgrade4(){
        this.cooldownTime -= 2
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade5(){
        this.healthGainPerTargetHit += 1
    }
    
    public getAttackMult(playerState?: Player): number {
        if(!playerState) return this.attackMultiplier * this.bonusAttackMultiplier
        else return this.attackMultiplier * this.bonusAttackMultiplier + playerState.stat.critRate/1
    }
}