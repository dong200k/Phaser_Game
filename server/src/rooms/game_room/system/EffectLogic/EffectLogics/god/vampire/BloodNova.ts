import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import CooldownGodUpgrade from "../CooldownGodUpgrade";

export default class BloodNova extends CooldownGodUpgrade{
    effectLogicId: string = "BloodNova"
    protected cooldownTime = 10
    protected cooldown?: Cooldown | undefined = new Cooldown(this.cooldownTime)
    protected spawnOffset = 0
    protected attackPoolType = "blood_nova"
    protected projectileSprite = "blood_nova"
    protected activeRange?: number = undefined
    protected attackSound = "blood_nova"
    protected activeTime?: number = undefined
    protected timeBetweenProjectiles = 0
    protected angleBetweenAttacks = 15
    protected projectileSpeed = 0
    protected attackMultiplier: number = 1
    protected piercing: number = -1
    protected duration: number = 2
    protected lifeSteal = 0.1
    protected width: number = 220
    protected height: number = 200

    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade2.bind(this), this.upgrade3.bind(this), this.upgrade4.bind(this), this.upgrade5.bind(this)]
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        let playerBody = playerState.getBody()
        // console.log(`spawn projectile spawn offset: ${offsetX}, ${offsetY}`)
        let projectileConfig: IProjectileConfig = {
            sprite: this.projectileSprite,
            stat: playerState.stat,
            spawnX: playerBody.position.x,
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
            }
            // dontRotate: true,
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });

        // Grant player life steal
        let lifeStealEffect = EffectFactory.createStatEffect({lifeSteal: this.lifeSteal})
        EffectManager.addEffectsTo(playerState, lifeStealEffect)

        // Remove after duration is over
        setTimeout(()=>{
            EffectManager.removeEffectFrom(playerState, lifeStealEffect)
        }, this.getDuration() * 980)
    }

    private upgrade1(){
        this.cooldownTime -= 2
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade2(){
        this.lifeSteal += 0.2
    }

    private upgrade3(){
        this.bonusDurationMultiplier += 1
    }

    private upgrade4(){
        this.cooldownTime -= 2
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade5(){
        this.lifeSteal += 0.3
    }
    
    public getAttackMult(playerState?: Player): number {
        if(!playerState) return this.attackMultiplier * this.bonusAttackMultiplier
        else return this.attackMultiplier * this.bonusAttackMultiplier + playerState.stat.critRate/1
    }
}