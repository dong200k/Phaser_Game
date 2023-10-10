import Matter from "matter-js";
import { Cloneable } from "../../../../util/PoolUtil";
import Entity from "../gameobjs/Entity";
import { type } from '@colyseus/schema';
import { IProjectileConfig } from "../../system/interfaces";
import Stat from "../gameobjs/Stat";
import { Categories, CategoryType } from "../../system/Collisions/Category";
import MathUtil from "../../../../util/MathUtil";
import GameObject, { Velocity } from "../gameobjs/GameObject";
import GameManager from "../../system/GameManager";
import MaskManager from "../../system/Collisions/MaskManager";
import StateMachine from "../../system/StateMachine/StateMachine";
import RangedProjectileController from "../../system/StateControllers/ProjectileControllers/rangestates/RangedProjectileController";
import MeleeProjectile from "./specialprojectiles/MeleeProjectile";
import MeleeProjectileController from "../../system/StateControllers/ProjectileControllers/meleestates/MeleeProjectileController";

/**
 * Projectiles are are updated via the update() method. Call projectile.setInactive() to return the projectile to the
 * projectile pool and reset it the next time ProjectileManager.update() is called.
 * 
 * To extend this class one can pass extra params through the projectileConfig's data
 * also overwrite the setConfig and reset as needed.
 * 
 */
export default class Projectile extends GameObject implements Cloneable {

    /** Unique id of the projectile */
    @type("string") projectileId: string
    // /** Pool that the projectile is returned to when it is inactive */
    // @type("string") poolType: string
    // /** Sprite of this projectile */
    // @type("string") sprite: string
    /** Determines what this projectile collides with */
    @type("string") collisionCategory: CategoryType
    /** range projectile is active for */
    @type("number") range?: number
    /** time projectile is active for  */
    @type("number") activeTime?: number
    @type("number") spawnX: number
    @type("number") spawnY: number
    // /** Whether the projectile is active or not, inactive projectiles will be reset by the update method for reuse */
    // @type("boolean") active:boolean = true
    // /** Whether the projectile is in poolmap for reuse */
    // @type("boolean") inPoolMap:boolean = false
    /** Initial velocity of the projectile's body */
    @type(Velocity) initialVelocity: Velocity
    /** Entity that this projectile originates from */
    /*@type(Entity)*/ entity?: Entity
    /** Stats used for damage calculation */
    /* ----  WARNING ----- Adding @type(Stat) causes issues with monster's stat not updating on client side. 
    This is likly due to stat being a reference to the monster's stat causing some issues.
    */
    /*@type(Stat)*/ stat: Stat
    /** attack multiplier AD  */
    @type("number") attackMultiplier: number
    @type("number") magicMultiplier: number
    // /** GameManager this projectile belongs to */
    // private gameManager: GameManager
    @type("number") projectileSpeed: number

    @type(StateMachine) projectileController: StateMachine<unknown>;

    @type("string") projectileType: string;

    /** The audio that will play on the client side when this projectile spawns. */
    @type("string") spawnSound: string;

    /** Enemies this projectile can hit before going inactive */
    @type("number") piercing: number;

    /** The entity that created this projectile. */
    originEntityId?: string;

    /** Times the projectile has collided */
    hitCount = 0

    dontDespawnOnObstacleCollision?: boolean

    /** The knockback of this projectile. */
    knockback?: {
        distance: number,
        direction?: {x: number, y: number}
    };

    // /** The knockback of this projectile. */
    // knockback?: {
    //     distance: number,
    //     direction?: {x: number, y: number}
    // };

    private setInactiveCallback?: Function
    private onCollideCallback?: Function

    
    /** Animation to play default is "play" */
    @type("string") animationKey: string = "play"
    /** Whether to repeat animation or not default is repeat true */
    @type("boolean") repeatAnimation: boolean = true

    /**s
     * Creates a new projectile GameObject and a corresponding Matter.Body with the projectileConfig
     * @param projectileConfig 
     * @param gameManager
     */
    constructor(projectileConfig: IProjectileConfig, gameManager: GameManager){
        super(gameManager, projectileConfig.spawnX, projectileConfig.spawnY)
        this.projectileId = MathUtil.uid()
        this.poolType = projectileConfig.poolType
        this.sprite = projectileConfig.sprite
        this.stat = projectileConfig.stat
        this.initialVelocity = new Velocity(projectileConfig.initialVelocity.x, projectileConfig.initialVelocity.y)
        this.collisionCategory = projectileConfig.collisionCategory
        this.activeTime = projectileConfig.activeTime
        this.range = projectileConfig.range
        this.spawnX = projectileConfig.spawnX
        this.spawnY = projectileConfig.spawnY
        this.gameManager = gameManager
        this.entity = projectileConfig.entity
        this.type = "Projectile"
        this.projectileType = "Ranged";
        this.originEntityId = projectileConfig.originEntityId;
        this.attackMultiplier = projectileConfig.attackMultiplier
        this.magicMultiplier = projectileConfig.magicMultiplier
        this.projectileSpeed = projectileConfig.projectileSpeed? projectileConfig.projectileSpeed : 1
        this.spawnSound = projectileConfig.spawnSound ?? "";
        
        this.width = projectileConfig.width ?? Math.abs(this.body.bounds.max.x - this.body.bounds.min.x);
        this.height = projectileConfig.height ?? Math.abs(this.body.bounds.max.y - this.body.bounds.min.y);
        this.projectileController = new RangedProjectileController({projectile: this});

        this.piercing = projectileConfig.piercing? projectileConfig.piercing : 1
        this.knockback = projectileConfig.knockback;
        this.createBody()

        let velocity = {x: this.initialVelocity.x, y:this.initialVelocity.y}
        Matter.Body.setVelocity(this.getBody(), velocity);

        if(projectileConfig.visible === false) this.setVisible(false)
        this.dontDespawnOnObstacleCollision = projectileConfig.dontDespawnOnObstacleCollision
    
        this.setInactiveCallback = projectileConfig.setInactiveCallback
        this.repeatAnimation = projectileConfig.repeatAnimation ?? this.repeatAnimation
        this.animationKey = projectileConfig.animationKey ?? this.animationKey
        this.onCollideCallback = projectileConfig.onCollideCallback ?? this.onCollideCallback
    }
    
    /**
     * Updates this projectile by deltaT. If the projectile has an activeTime and this.outOfTime() is true then projetile will be made inactive.
     * If projectile has a range and this.outOfRange() is true then projectile will be made inactive.
     * @param deltaT The time that passed since the last update in milliseconds.
     */
    public update(deltaT: number){
        // Update time projectile is active
        if(this.activeTime !== undefined){
            this.activeTime -= deltaT
        }

        // Make projectile inactive it is out of time or range
        if(this.outOfTime() || this.outOfRange()) this.setInactive()

        // Updates this projectile's ai.
        this.projectileController.update(deltaT / 1000);
    }

    /**
     * Note: to be called by update method
     * @returns true if the projectile is out of time. If the projectile still has time or it is untimed return false.
     */
    protected outOfTime(){
        return this.activeTime !== undefined && this.activeTime <= 0
    }

    /**
     * Note: to be called by update method
     * @returns true if the projectile is too far from its spawn location. If the projectile still has range to travel or range is not tracked return false.
     */
    protected outOfRange(){
        let travelRange = MathUtil.distance(this.spawnX, this.spawnY, this.x, this.y)
        return this.range !== undefined && this.range < travelRange
    }

    /** Used to create the Matter body of this projectile. Override this to create projectiles with different bodies. */
    protected createBody(){
        // let width = 10
        // let height = 10

        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: false,
            isSensor: true,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        })

        body.collisionFilter = {
            ...body.collisionFilter,
            group: 0,
            category: Categories[this.collisionCategory],
            mask: MaskManager.getManager().getMask(this.collisionCategory) 
        };

        body.label = this.collisionCategory
        this.setBody(body)
    }

    /**
     * Changes the collision category and mask of this projectile
     * @param category of projectile such as PLAYER_PROJECTILE etc.
     */
    setCollision(category: CategoryType){
        let body = this.getBody()

        this.collisionCategory = category
        body.collisionFilter = {
            ...body.collisionFilter,
            group: 0,
            category: Categories[this.collisionCategory],
            mask: MaskManager.getManager().getMask(this.collisionCategory) 
        };

        body.label = this.collisionCategory
    }

    /**
     * Called by setInactive to reset a projectile for reuse.
     * 
     * Resets this projectile to its original state.
     */
    public reset() {
        // Make body non collideable
        this.disableCollisions();
    }

    /** Disable collision on the Matter body associated with this object. */
    public disableCollisions() {
        this.body.collisionFilter = {
            ...this.body.collisionFilter,
            group: -1,
            mask: 0,
        }
    }

    /** Enable collision on the Matter body associated with this object. */
    public enableCollisions() {
        this.body.collisionFilter = {
            ...this.body.collisionFilter,
            group: 0,
            category: Categories[this.collisionCategory],
            mask: MaskManager.getManager().getMask(this.collisionCategory) 
        }
    }

    // /** Marks this projectile as active so it's update method goes through and the client knows that it is active. */
    // public setActive(){
    //     this.active = true
    // }

    /** Marks this projectile as inactive and resets it. On the next update of ProjectileManager this projectile will be
     * returned to the projectilePool
    */
    public setInactive(){
        this.active = false
        this.onInactive()
        this.reset()
    }

    public getOriginEntity(): Entity | undefined{
        let originEntity = undefined
        this.gameManager.gameObjects.forEach(gameObject=>{
            if(gameObject.id === this.originEntityId) {
                originEntity = gameObject
            }
        })
        return originEntity
    }

    /**
     * This method is called when the projectile is set to inactive.
     */
    public onInactive(){
        if(this.setInactiveCallback) this.setInactiveCallback(this)
    }

    /**
     * Called by the collision manager when projectile collides with something it can collide with.
     */
    public onCollide(){
        if(this.onCollideCallback){
            this.onCollideCallback(this)
            console.log("projectile on collide")
        } 
    }

    /**
     * Sets config of the projectile. To be called when a projectile instance is being reused and needs to be initialized
     * with a new projectile's config.
     * @param projectileConfig 
     */
    public setConfig(projectileConfig: IProjectileConfig){
        this.x = projectileConfig.spawnX
        this.y = projectileConfig.spawnY
        this.projectileId = MathUtil.uid()
        this.poolType = projectileConfig.poolType
        this.sprite = projectileConfig.sprite
        this.stat = projectileConfig.stat
        this.initialVelocity = new Velocity(projectileConfig.initialVelocity.x, projectileConfig.initialVelocity.y)
        this.collisionCategory = projectileConfig.collisionCategory
        this.activeTime = projectileConfig.activeTime
        this.range = projectileConfig.range
        this.spawnX = projectileConfig.spawnX
        this.spawnY = projectileConfig.spawnY
        this.entity = projectileConfig.entity
        this.attackMultiplier = projectileConfig.attackMultiplier
        this.magicMultiplier = projectileConfig.magicMultiplier
        this.spawnSound = projectileConfig.spawnSound ?? "";
        this.type = "Projectile"
        this.originEntityId = projectileConfig.originEntityId;
        this.knockback = projectileConfig.knockback ?? this.knockback;

        // Make body collideable again
        let body = this.getBody()
        if(body){
            body.collisionFilter = {
                ...body.collisionFilter,
                group: 0,
                category: Categories[this.collisionCategory],
                mask: MaskManager.getManager().getMask(this.collisionCategory) 
            };
            Matter.Body.setPosition(body, {x: this.x, y: this.y})
            Matter.Body.setVelocity(body, this.initialVelocity)
        }

        this.setActive(true)    
        this.inPoolMap = false

        this.piercing = projectileConfig.piercing? projectileConfig.piercing : 1
        this.hitCount = 0

        if(projectileConfig.visible === false) this.setVisible(false)
        this.repeatAnimation = projectileConfig.repeatAnimation ?? this.repeatAnimation
        this.animationKey = projectileConfig.animationKey ?? this.animationKey
        this.onCollideCallback = projectileConfig.onCollideCallback ?? this.onCollideCallback
    }
}