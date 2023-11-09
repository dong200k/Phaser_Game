import Matter from "matter-js";
import MathUtil from "../../../../../../../util/MathUtil";
import Entity from "../../../../../schemas/gameobjs/Entity";
import { Velocity } from "../../../../../schemas/gameobjs/GameObject";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import { CategoryType } from "../../../../Collisions/Category";
import { getFinalAttackSpeed } from "../../../../Formulas/formulas";
import GameManager from "../../../../GameManager";
import StateNode from "../../../../StateMachine/StateNode";
import { IProjectileConfig } from "../../../../interfaces";
import BerserkerBossController from "../BerserkerBossController";

export interface AttackConfig {
    /** Total attack time. Including windup(for animations) time and trigger time. */
    attackDuration?: number;

    /** A percentage of attackDuration that passes before the attack triggers. E.g. if attackDuration=1 and 
     * triggerPercent=0.7, the attack will trigger at 0.7 seconds.
     */
    triggerPercent?: number;

    targetX?: number;
    targetY?: number;

    /** Animation duration in seconds */
    animationDuration?: number;

    /** Whether to flip animation or not */
    flip?: boolean

    /** Key of animation to play when entering thi state */
    animationKey?: string
    /** List of projectiles configs to spawn projectiles when attack is triggered */
    projectileConfigs?: IProjectileConfig[]

    categoryType?: CategoryType
}

export default class Attack extends StateNode {
    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected gameManager!: GameManager;
    protected target?: Entity
    
    protected attackDuration: number = 1;
    protected triggerPercent: number = 0.3;
    protected triggered: boolean = false;
    protected timePassed: number = 0;

    protected targetX: number = 0
    protected targetY: number = 0
    protected animationDuration: number = 1
    protected flip: boolean = false
    protected animationKey: string = ""
    protected attackName: string = ""
    protected projectileConfigs: IProjectileConfig[] = []

    private projectileType: CategoryType = "DAMAGE_ALL_PROJECTILE"
    private getsugaMultiplier = 1
    /** Speed for the getsugas fired out in transformed form */
    private projectileSpeed = 2
    /**
     * Initialize this attack with some values.
     * @param config The AttackConfig.
     */
    public setConfig(config?: AttackConfig) {
        if(config) {
            this.attackDuration = config.attackDuration ?? this.attackDuration;
            this.triggerPercent = config.triggerPercent ?? this.triggerPercent;
            this.targetX = config.targetX ?? 0;
            this.targetX = config.targetY ?? 0;
            this.animationDuration = config.animationDuration ?? this.animationDuration
            this.flip = config.flip ?? this.flip
            this.animationKey = config.animationKey ?? this.animationKey
            this.projectileConfigs = config.projectileConfigs ?? this.projectileConfigs
            this.projectileType = config.categoryType ?? this.projectileType
        }
    }

    /** Sets the attack name that will determine how the config is set */
    public setAttackName(attackName: string){
        this.attackName = attackName
    }

    public onEnterHelper(){
        this.controller = this.getStateMachine<BerserkerBossController>()
        this.boss = this.controller.getBoss()
        this.gameManager = this.controller.getGameManager()
        this.target = this.controller.getTarget()
    }

    public onEnter(): void {
        this.onEnterHelper()
        
        let attackSpeed = getFinalAttackSpeed(this.boss.stat)
        if(attackSpeed > 0){
            this.attackDuration /= attackSpeed
            if(this.attackDuration < 0.7) this.attackDuration = 0.7
        }

        // Set config based on attack name
        switch(this.attackName){
            case "attack_1":
                this.setConfig(this.getAttack1Config(this.boss)); break;
            case "attack_2":
                this.setConfig(this.getAttack2Config(this.boss)); break;
            case "attack_3":
                this.setConfig(this.getAttack3Config(this.boss)); break;
            case "attack_4":
                this.setConfig(this.getAttack4Config(this.boss)); break;
            case "attack_5":
                this.setConfig(this.getAttack5Config(this.boss)); break;
            case "attack_6":
        }

        this.boss.animation.playAnimation(this.animationKey, {
            duration: this.attackDuration/= attackSpeed,
            flip: this.flip
        });

        Matter.Body.setVelocity(this.boss.getBody(), {x: 0, y: 0});
    }

    public onExit(): void {
        this.timePassed = 0;
        this.triggered = false;
    }

    protected attack(){
        this.projectileConfigs.forEach(projectileConfig => {
            this.controller.spawnProjectile(projectileConfig)
        });
        if(this.controller.transformed){
            if(this.attackName === "attack_4" || this.attackName === "attack_2"){
                this.fireSlashProjectile(!this.flip)
            }
            this.fireSlashProjectile(this.flip)

            if(this.attackName === "attack_2"){
                this.fireSlashProjectile(!this.flip, false)
                this.fireSlashProjectile(this.flip, false)
            }
        }
    }

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        if(this.timePassed >= this.attackDuration){
            this.controller.changeState("Follow")
        }

        // Trigger an attack if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            this.attack()
        }
    }

    getAttack1Config(entity: Entity): AttackConfig{
        let attackDuration = 1
        let triggerPercent = 0.3
        let attackMultiplier = 1
        let magicMultiplier = 0
        let activeTime =  1000 * attackDuration * (1-triggerPercent)
        let animationKey = "1_atk"
        let poolType = "Berserker Boss Combo 1"
        let offsetX = 25
        let offsetY = -20

        let entityX = entity.getBody().position.x
        let entityY = entity.getBody().position.y
        let flip = false

        // Target is behind so flip attack
        if(this.target && this.target.getBody().position.x < entity.getBody().position.x){
            offsetX *= -1
            flip = true
        }

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: entity.stat,
            spawnX: entityX + offsetX,
            spawnY: entityY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileType,
            poolType,
            activeTime,
            attackMultiplier,
            magicMultiplier,
            originEntityId: entity.getId(),
            // spawnSound: this.spawnSound,
            width: 90,
            height: 80,
            visible: false,
            classType: "MeleeProjectile",
            spawnSound: "clean_fast_slash"
        }
    
        return {
            attackDuration,
            triggerPercent,
            animationKey,
            flip,
            projectileConfigs: [projectileConfig]
        }
    }

    getAttack2Config(entity: Entity): AttackConfig{
        let attackDuration = 1
        let triggerPercent = 0.3
        let attackMultiplier = 1
        let magicMultiplier = 0
        let activeTime =  1000 * attackDuration * (1-triggerPercent)
        let animationKey = "Spin_Attack"
        let poolType = "Berserker Boss Combo 2"
        let offsetX = 10
        let offsetY = -5

        let entityX = entity.getBody().position.x
        let entityY = entity.getBody().position.y
        let flip = false

        // Target is behind so flip attack
        if(this.target && this.target.getBody().position.x < entity.getBody().position.x){
            offsetX *= -1
            flip = true
        }

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: entity.stat,
            spawnX: entityX + offsetX,
            spawnY: entityY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileType,
            poolType,
            activeTime,
            attackMultiplier,
            magicMultiplier,
            originEntityId: entity.getId(),
            // spawnSound: this.spawnSound,
            width: 140,
            height: 55,
            visible: false,
            classType: "FollowingMeleeProjectile",
            data: {
                owner: entity,
                offsetX,
                offsetY
            },
            spawnSound: "clean_fast_slash"
        }
    
        return {
            attackDuration,
            triggerPercent,
            animationKey,
            flip,
            projectileConfigs: [projectileConfig]
        }
    }
    
    getAttack3Config(entity: Entity): AttackConfig{
        let attackDuration = 1
        let triggerPercent = 0.3
        let attackMultiplier = 2
        let magicMultiplier = 0
        let activeTime = 1000 * attackDuration * (1-triggerPercent)
        let animationKey = "3_atk_new"
        let offsetX = 50
        let offsetY = -Math.abs(90 - entity.width)/2 - 2

        let entityX = entity.getBody().position.x
        let entityY = entity.getBody().position.y
        let flip = false

        // Target is behind so flip attack
        if(this.target && this.target.getBody().position.x < entity.getBody().position.x){
            offsetX *= -1
            flip = true
        }

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: entity.stat,
            spawnX: entityX,
            spawnY: entityY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileType,
            poolType: "Berserker Boss Combo 3-1",
            activeTime,
            attackMultiplier: 1,
            magicMultiplier,
            originEntityId: entity.getId(),
            // spawnSound: this.spawnSound,
            width: entity.width,
            height: entity.height,
            visible: false,
            classType: "MeleeProjectile",
        }
    
        let projectileConfig2: IProjectileConfig = {
            sprite: "invisible",
            stat: entity.stat,
            spawnX: entityX + offsetX,
            spawnY: entityY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileType,
            poolType: "Berserker Boss Combo 3-2",
            activeTime,
            attackMultiplier,
            magicMultiplier,
            originEntityId: entity.getId(),
            spawnSound: "small_explosion",
            width: 105,
            height: 90,
            visible: false,
            classType: "MeleeProjectile",
        }
    

        return {
            attackDuration,
            triggerPercent,
            animationKey,
            flip,
            projectileConfigs: [projectileConfig, projectileConfig2]
        }
    }

    getAttack4Config(entity: Entity): AttackConfig{
        let attackDuration = 1
        let triggerPercent = 0.3
        let attackMultiplier = 1
        let magicMultiplier = 0
        let activeTime =  1000 * attackDuration * (1-triggerPercent)
        let animationKey = "Double_Slash"
        let poolType = "Berserker Boss Combo 4"
        let offsetX = 8
        let offsetY = -25

        let entityX = entity.getBody().position.x
        let entityY = entity.getBody().position.y
        let flip = false

        // Target is behind so flip attack
        if(this.target && this.target.getBody().position.x < entity.getBody().position.x){
            offsetX *= -1
            flip = true
        }

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: entity.stat,
            spawnX: entityX + offsetX,
            spawnY: entityY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileType,
            poolType,
            activeTime,
            attackMultiplier,
            magicMultiplier,
            originEntityId: entity.getId(),
            // spawnSound: this.spawnSound,
            width: 210,
            height: 50,
            visible: false,
            classType: "MeleeProjectile",
            spawnSound: "sword_swish"
        }
    
        return {
            attackDuration,
            triggerPercent,
            animationKey,
            flip,
            projectileConfigs: [projectileConfig]
        }
    }

    getAttack5Config(entity: Entity): AttackConfig{
        let attackDuration = 1
        let triggerPercent = 0.3
        let attackMultiplier = 2
        let magicMultiplier = 0
        let activeTime =  1000 * attackDuration * (1-triggerPercent)
        let animationKey = "sp_atk"
        let poolType = "Berserker Boss Combo 5"
        let offsetX = 50
        let offsetY = -10

        let entityX = entity.getBody().position.x
        let entityY = entity.getBody().position.y
        let flip = false

        // Target is behind so flip attack
        if(this.target && this.target.getBody().position.x < entity.getBody().position.x){
            offsetX *= -1
            flip = true
        }

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: entity.stat,
            spawnX: entityX + offsetX,
            spawnY: entityY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: this.projectileType,
            poolType,
            activeTime,
            attackMultiplier,
            magicMultiplier,
            originEntityId: entity.getId(),
            // spawnSound: this.spawnSound,
            width: 100,
            height: 100,
            visible: false,
            classType: "MeleeProjectile",
            spawnSound: "flame_slash"
        }
    
        return {
            attackDuration,
            triggerPercent,
            animationKey,
            flip,
            projectileConfigs: [projectileConfig]
        }
    }

    private fireSlashProjectile(flip: boolean, horizontal: boolean = true){
        let velocity: {x: number, y: number}
        if(horizontal) {
            velocity = {x: 1, y: 0}
            if(flip) velocity = {x:-1, y:0}
        }else{
            velocity = {x: 0, y: 1}
            if(flip) velocity = {x:0, y:-1}
        }

        velocity = MathUtil.getNormalizedSpeed(velocity.x, velocity.y, this.projectileSpeed)

        let projectileConfig: IProjectileConfig
        let bossPos = this.boss.getBody().position
        projectileConfig = {
            sprite: "GetsugaTenshou",
            stat: this.boss.stat,
            spawnX: bossPos.x,
            spawnY: bossPos.y,
            collisionCategory: this.projectileType,
            poolType: "Boss Getsuga Tenshou Attack",
            // activeTime: 10000,
            attackMultiplier: this.getsugaMultiplier,
            magicMultiplier: 0,
            originEntityId: this.boss.getId(),
            width: 50,
            height: 50,
            dontDespawnOnObstacleCollision: true,
            classType: "MeleeProjectile",
            spawnSound: "clean_slash_attack",
            initialVelocity: velocity,
            setInactiveCallback: this.controller.getGetsugaExplosionCallback(),
            onCollideCallback: this.controller.getGetsugaExplosionCallback(),
        }

        this.controller.spawnProjectile(projectileConfig)
    }
}