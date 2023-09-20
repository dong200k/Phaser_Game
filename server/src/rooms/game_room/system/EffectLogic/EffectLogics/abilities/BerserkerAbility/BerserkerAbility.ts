import EffectFactory from "../../../../../schemas/effects/EffectFactory"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import FollowingMeleeProjectile from "../../../../../schemas/projectiles/specialprojectiles/FollowingMeleeProjectile"
import GameManager from "../../../../GameManager"
import StateMachine from "../../../../StateMachine/StateMachine"
import EffectManager from "../../../../StateManagers/EffectManager"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"

export default class BerserkerAbilityLogic extends EffectLogic{
    effectLogicId = "berserker-ability"

    flameAura!: Projectile
    currentlyUsingAbility = false

    private playerState?: Player
    private gameManager?: GameManager
    private damageTime = 1000
    private timeSoFar = 0
    private damagePercent = 5
    private id?: string

    private statMultiplier = 0.5
    private flameAuraDamageMultiplier = 1   
    private boostWhenUnder10Percent = false
    private chargeAttackSpeedBoost = false

    private duration = 7000
    private timeInAbility = 0
    public useEffect(playerState: Player, gameManager: GameManager, ){
        console.log("berserker ability logic use effect")
        this.playerState = playerState
        this.gameManager = gameManager

        if(this.currentlyUsingAbility){
            this.turnOffAbility()
        }else{
            this.turnOnAbility()
        }
    }

    turnOnAbility(){
        if(!this.playerState || !this.gameManager) return
        this.initFlameAura(this.playerState, this.gameManager)
        this.activateStatBoost()
        this.currentlyUsingAbility = true
        this.flameAura.sound.playBackgroundMusic("ultra_instinct")
    }

    turnOffAbility(){
        this.flameAura.setActive(false)
        this.timeSoFar = 0
        this.removeStatBoost()
        this.currentlyUsingAbility = false
        this.flameAura.sound.stopMusic("ultra_instinct")
    }

    public update(deltaT: number){        
        if(!this.playerState) return

        if(this.currentlyUsingAbility){
            this.timeInAbility += deltaT
            if(this.timeInAbility >= this.duration){
                this.turnOffAbility()
                this.timeInAbility = 0
            }
        }

        if(this.currentlyUsingAbility && this.playerState){
            if(this.playerState.stat.hp <= 0){
                this.turnOffAbility()
            }

            // Less equal 10 percent health double stat multiplier
            if(this.playerState.stat.hp <= this.playerState.stat.maxHp * 0.1 && this.statMultiplier != 1 && this.boostWhenUnder10Percent){
                this.statMultiplier = 1
                this.removeStatBoost()
                this.activateStatBoost()
            }else if(this.playerState.stat.hp > this.playerState?.stat.maxHp * 0.1 && this.statMultiplier != 0.5){
                this.statMultiplier = 0.5
                this.removeStatBoost()
                this.activateStatBoost()
            }

            this.timeSoFar += deltaT

            // Deal damage to player for keeping ability on
            if(this.timeSoFar >= this.damageTime && this.playerState){
                let damage = Math.max(1, Math.floor(this.playerState.stat.hp * this.damagePercent/100))
                if(this.playerState.stat.hp !== 1){
                    let damageEffect = EffectFactory.createDamageEffect(damage)
                    EffectManager.addEffectsTo(this.playerState, damageEffect)
                }
                this.timeSoFar = 0
            }
        }else{
            // Less equal 10 percent health double stat multiplier
            if(this.playerState.stat.hp <= this.playerState.stat.maxHp * 0.1 && this.statMultiplier != 1 && this.boostWhenUnder10Percent){
                this.statMultiplier = 1
            }else if(this.playerState.stat.hp > this.playerState?.stat.maxHp * 0.1 && this.statMultiplier != 0.5){
                this.statMultiplier = 0.5
            }
        }
        
    }

    private activateStatBoost(){
        if(this.playerState){
            let statEffect = EffectFactory.createStatEffect({
                speed: this.playerState.stat.speed * this.statMultiplier,
                attackSpeed: this.playerState.stat.attackSpeed * this.statMultiplier,
                attack: this.playerState.stat.attack * this.statMultiplier,
                armor: this.playerState.stat.armor * this.statMultiplier,
                chargeAttackSpeed: this.chargeAttackSpeedBoost ? this.playerState.stat.chargeAttackSpeed + 4 : 0
            })

            this.id = EffectManager.addStatEffectsTo(this.playerState, statEffect)
        }
    }

    private removeStatBoost(){
        if(this.id && this.playerState){
            EffectManager.removeStatEffectFrom(this.playerState, this.id)
            this.id = undefined
        }
    }

    /** Turns on stat boost when using ability and health is <= 10 percent */
    public toggleStatBoostWhenUnder10Percent(){
        console.log("toggle stat bost when udner 10 percent")
        this.boostWhenUnder10Percent = true
    }

    /** Turns on charge attack speed boost when special is active */
    public toggleChargeAttackSpeedBoost(){
        console.log("toggle charge attack speed boosta")
        this.chargeAttackSpeedBoost = true
        if(this.currentlyUsingAbility) {
            this.removeStatBoost()
            this.activateStatBoost()
        }
        this.damagePercent += 10
    }

    /** Turns on double flame aura damage when special is active */
    public toggleDoubleFlameAuraDamage(){
        console.log("toggle double flame aura damage")
        this.flameAuraDamageMultiplier *= 2
        this.flameAura.attackMultiplier *= this.flameAuraDamageMultiplier
        this.damagePercent += 5
    }

    private initFlameAura(playerState: Player, gameManager: GameManager){
        let body = playerState.getBody()
        let playerX = body.position.x
        let playerY = body.position.y

        let projectileConfig: IProjectileConfig = {
            sprite: "FlameAura",
            stat: playerState.stat,
            spawnX: playerX,
            spawnY: playerY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "FlameAura",
            attackMultiplier: this.flameAuraDamageMultiplier,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            classType: "FollowingMeleeProjectile",
            width: 90,
            height: 100,
            piercing: -1,
            data:{
                owner: playerState
            }
        }
        
        // gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig)
        this.flameAura = gameManager.getProjectileManager().spawnProjectile(projectileConfig, projectileConfig.classType).projectile
    }
}