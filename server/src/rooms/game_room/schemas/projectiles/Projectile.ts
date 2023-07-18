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
    @type(Entity) entity?: Entity
    /** Stats used for damage calculation */
    @type(Stat) stat: Stat
    /** attack multiplier AD  */
    @type("number") attackMultiplier: number
    @type("number") magicMultiplier: number
    // /** GameManager this projectile belongs to */
    // private gameManager: GameManager

    @type(StateMachine) projectileController: StateMachine<unknown>;

    @type("string") projectileType: string;

    /**
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
        this.attackMultiplier = projectileConfig.attackMultiplier
        this.magicMultiplier = projectileConfig.magicMultiplier
        this.createBody()

        this.width = Math.abs(this.body.bounds.max.x - this.body.bounds.min.x);
        this.height = Math.abs(this.body.bounds.max.y - this.body.bounds.min.y);
        this.projectileController = new RangedProjectileController({projectile: this});
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
        let width = 10
        let height = 10

        let body = Matter.Bodies.rectangle(this.x, this.y, width, height, {
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
        
        let velocity = {x: this.initialVelocity.x, y:this.initialVelocity.y}
        Matter.Body.setVelocity(body, velocity);
        this.setBody(body)
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
        this.reset()
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
        this.type = "Projectile"

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
    }
}