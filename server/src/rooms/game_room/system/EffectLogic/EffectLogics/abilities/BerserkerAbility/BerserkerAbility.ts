import EffectFactory from "../../../../../schemas/effects/EffectFactory"
import Entity from "../../../../../schemas/gameobjs/Entity"
import Player from "../../../../../schemas/gameobjs/Player"
import Projectile from "../../../../../schemas/projectiles/Projectile"
import FollowingMeleeProjectile from "../../../../../schemas/projectiles/specialprojectiles/FollowingMeleeProjectile"
import { CategoryType } from "../../../../Collisions/Category"
import GameManager from "../../../../GameManager"
import StateMachine from "../../../../StateMachine/StateMachine"
import EffectManager from "../../../../StateManagers/EffectManager"
import { GameEvents, IProjectileConfig } from "../../../../interfaces"
import EffectLogic from "../../../EffectLogic"

export type BerserkerAbilityConfig = {
    maxBoost?: number,
    minBoost?: number,
    maxBoostPercent?: number,
    categoryType?: CategoryType,
    flameAuraDamageMultiplier?: number,
    /** Music to play when abilit is turned on */
    soundKey?: string,
    statToBuff?: {
        speed: boolean,
        attackSpeed: boolean,
        attack: boolean,
        armor: boolean,
        chargeAttackSpeed: boolean
    },
    shouldGoOnCooldown?: boolean
}

export default class BerserkerAbilityLogic extends EffectLogic{
    effectLogicId = "berserker-ability"

    flameAura!: Projectile
    currentlyUsingAbility = false

    private playerState?: Entity
    private gameManager?: GameManager
    private timeSoFar = 0
    // private damagePercent = 5
    private id?: string

    private flameAuraDamageMultiplier = 1   
    private toggleStatBoostAtLowerHealth = false

    private duration = 7000
    private timeInAbility = 0
    private categoryType: CategoryType = "PLAYER_PROJECTILE"

    /** Time to wait before checking for stat boost */
    private statBonusTime = 1000
    private timeSinceCheck = 0
    private healthAtLastCheck = 0

    private maxBoost = 1.5 // Maximum stat bonus
    private minBoost = 0.5 // Minimum stat bonus
    private maxBoostPercent = 0.1 // Health percent where max boost occurs

    /** Whether or not the ability should go on cooldown when duration is over */
    private shouldGoOnCooldown = true

    /** Should music be turned on with ability */
    private withMusic = true
    private soundKey = "ultra_instinct"

    /** Stats to be buffed */
    private statToBuff = {
        speed: true,
        attackSpeed: true,
        attack: true,
        armor: true,
        chargeAttackSpeed: false,
    }

    public useEffect(playerState: Entity, gameManager: GameManager, ){
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
        if(this.withMusic) this.flameAura.sound.playBackgroundMusic(this.soundKey)
    }

    turnOffAbility(){
        this.flameAura.setActive(false)
        this.timeSoFar = 0
        this.removeStatBoost()
        this.currentlyUsingAbility = false
        if(this.withMusic) this.flameAura.sound.stopMusic(this.soundKey)
    }

    public update(deltaT: number){        
        if(!this.playerState) return

        if(this.currentlyUsingAbility && this.shouldGoOnCooldown){
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

            
            if(this.toggleStatBoostAtLowerHealth && this.timeSinceCheck >= this.statBonusTime && this.playerState.stat.hp != this.healthAtLastCheck){
                this.removeStatBoost()
                this.activateStatBoost()
                this.timeSinceCheck = 0
                this.healthAtLastCheck = this.playerState.stat.hp
            }

            this.timeSoFar += deltaT

            // Deal damage to player for keeping ability on
            // if(this.timeSoFar >= this.damageTime && this.playerState){
            //     let damage = Math.max(1, Math.floor(this.playerState.stat.hp * this.damagePercent/100))
            //     if(this.playerState.stat.hp !== 1){
            //         let damageEffect = EffectFactory.createDamageEffect(damage)
            //         EffectManager.addEffectsTo(this.playerState, damageEffect)
            //     }
            //     this.timeSoFar = 0
            // }
        }
    }

    private activateStatBoost(){
        if(this.playerState){
            let statMultiplier = this.minBoost

            if(this.toggleStatBoostAtLowerHealth){
                this.healthAtLastCheck = this.playerState.stat.hp
                let missingHealthPercent = (this.playerState.stat.maxHp - this.playerState.stat.hp)/this.playerState.stat.maxHp
                // console.log(`missinghelthpercent ${missingHealthPercent}, maxhp ${this.playerState.stat.maxHp}, hp: ${this.playerState.stat.hp}`)
                // console.log(`max boost - min boost ${this.maxBoost - this.minBoost}, `)
                let boostPercent = (missingHealthPercent + this.maxBoostPercent) 
                if(boostPercent > 1) boostPercent = 1
                statMultiplier = (this.maxBoost - this.minBoost) * boostPercent
            }
            
            let playerStat = this.playerState.stat
            let statEffect = EffectFactory.createStatEffect({
                speed: this.statToBuff.speed? playerStat.speed * statMultiplier : 0,
                attackSpeed: this.statToBuff.attackSpeed? playerStat.attackSpeed * statMultiplier: 0,
                attack: this.statToBuff.attack? playerStat.attack * statMultiplier: 0,
                armor: this.statToBuff.armor? playerStat.armor * statMultiplier : 0,
                chargeAttackSpeed: this.statToBuff.chargeAttackSpeed ? playerStat.chargeAttackSpeed + 4 : 0
            })

            // console.log("stat boost multiplier: ", statMultiplier)
            this.id = EffectManager.addStatEffectsTo(this.playerState, statEffect)
        }
    }

    private removeStatBoost(){
        if(this.id && this.playerState){
            EffectManager.removeStatEffectFrom(this.playerState, this.id)
            this.id = undefined
        }
    }

    /** Allows  on extra stat boost */
    public toggleStatBoostWhenAtLowerHealth(){
        this.toggleStatBoostAtLowerHealth = true
    }

    /** Turns on charge attack speed boost when special is active */
    public toggleChargeAttackSpeedBoost(){
        this.statToBuff.chargeAttackSpeed = true
        if(this.currentlyUsingAbility) {
            this.removeStatBoost()
            this.activateStatBoost()
        }
    }

    /** Turns on double flame aura damage when special is active */
    public toggleDoubleFlameAuraDamage(){
        this.flameAuraDamageMultiplier *= 2
        if(this.flameAura) this.flameAura.attackMultiplier = this.flameAuraDamageMultiplier
    }

    private initFlameAura(entity: Entity, gameManager: GameManager){
        let body = entity.getBody()
        let entityX = body.position.x
        let entityY = body.position.y

        let projectileConfig: IProjectileConfig = {
            sprite: "FlameAura",
            stat: entity.stat,
            spawnX: entityX,
            spawnY: entityY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.categoryType,
            poolType: "FlameAura",
            attackMultiplier: this.flameAuraDamageMultiplier,
            magicMultiplier: 0,
            originEntityId: entity.getId(),
            classType: "FollowingMeleeProjectile",
            width: 90,
            height: 100,
            piercing: -1,
            data:{
                owner: entity
            }
        }
        
        // gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig)
        this.flameAura = gameManager.getProjectileManager().spawnProjectile(projectileConfig, projectileConfig.classType).projectile
    }

    setConfig(config?: BerserkerAbilityConfig){
        // this.toggleDoubleFlameAuraDamage()
        this.toggleStatBoostWhenAtLowerHealth()
        this.shouldGoOnCooldown = config?.shouldGoOnCooldown ?? this.shouldGoOnCooldown
        this.categoryType = config?.categoryType ?? this.categoryType
        this.maxBoostPercent = config?.maxBoost ?? this.maxBoost
        this.maxBoost = config?.maxBoost ?? this.maxBoost
        this.minBoost = config?.minBoost ?? this.minBoost
        this.flameAuraDamageMultiplier = config?.flameAuraDamageMultiplier ?? this.flameAuraDamageMultiplier
        // this.withMusic = false
        this.soundKey = config?.soundKey ?? this.soundKey
        this.statToBuff = config?.statToBuff ?? this.statToBuff
    }
}