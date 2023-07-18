import { Schema, type } from '@colyseus/schema';
import MathUtil from '../../../../util/MathUtil';
import { Cloneable } from '../../../../util/PoolUtil';
import Matter from 'matter-js';
import GameManager from '../../system/GameManager';

export class Velocity extends Schema {
    @type('number') x = 0;
    @type('number') y = 0;

    constructor(x: number = 0, y: number = 0){
        super()
        this.x = x
        this.y = y
    }
}

export default class GameObject extends Schema implements Cloneable {
    @type('string') id: string;
    @type('boolean') visible: boolean;
    @type('boolean') active: boolean;
    @type('string') ownerId;
    @type('string') type;

    /** Sprite of this projectile */
    @type("string") sprite: string

    // -- physics --
    protected body: Matter.Body;
    @type('number') x;
    @type('number') y;
    @type('number') width;
    @type('number') height;
    @type(Velocity) velocity;

    // -- Object Pools --
    inPoolMap: boolean;
    poolType: string;

    // -- Reference to the GameManager --
    gameManager: GameManager;

    constructor(gameManager: GameManager, x: number, y: number, ownerId?: string) {
        super();
        this.id = MathUtil.uid();
        this.gameManager = gameManager;
        this.x = x;
        this.y = y;
        this.width = 1;
        this.height = 1;
        this.velocity = new Velocity();
        this.ownerId = ownerId;
        this.type = 'GameObject';
        this.sprite = "";
        this.visible = true;
        this.active = true;
        this.inPoolMap = false;
        this.poolType = "";
        this.body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: false,
        });
    }

    /** 
     * Sets the Matter.Body for this GameObject.
     * @param body The matter body.
     */
    public setBody(body: Matter.Body) {
        this.body = body;
    }

    /** Gets the Matter.Body associated with this GameObject. */
    public getBody() {
        return this.body;
    }

    /** Returns an uuid of this gameObject that's been assigned on construction.*/
    public getId() {
        return this.id;
    }

    /** Give this gameObject an new ID. You should only call this if you want to assign your own ID. */
    public setId(id: string) {
        this.id = id;
    }

    /** Sets the visiblity of this GameObject. */
    public setVisible(value: boolean) {
        this.visible = value;
    }

    /** Checks if this game object is visible. */
    public isVisible() {
        return this.visible;
    }

    /** Sets the active state of this GameObject. Note: This is used to make 
     * the GameObject disappear on the client side when this GameObject is 
     * not in use (returned to ObjectPool).
     */
    public setActive(value: boolean) {
        this.active = value;
    } 

    /** Checks if this game object is active. */
    public isActive() {
        return this.active;
    }

    /** Checks if this GameObject is in a pool. */
    public isInPoolMap() {
        return this.inPoolMap;
    }

    /**
     * Sets the inPoolMap value of this GameObject. inPoolMap is used to check 
     * whether this GameObject should be put in the pool or not.
     * @param value True or False.
     */
    public setInPoolMap(value: boolean) {
        this.inPoolMap = value;
    }

    /**
     * Gets the pool type of this object.
     * @returns The Pool type.
     */
    public getPoolType() {
        return this.poolType;
    }

    /**
     * Sets the pooltype of this GameObject. This is used so that the object is stored 
     * properly inside an ObjectPool.
     * @param value The poolType.
     */
    public setPoolType(value: string) {
        this.poolType = value;
    }
}