import { Schema, type } from '@colyseus/schema';
import MathUtil from '../../../../util/MathUtil';
import { Cloneable } from '../../../../util/PoolUtil';

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
    @type('string') ownerId;
    @type('string') type;

    // -- physics --
    private body: Matter.Body | null = null;
    @type('number') x;
    @type('number') y;

    constructor(x: number, y: number, ownerId?: string) {
        super();
        this.id = MathUtil.uid()
        this.x = x;
        this.y = y;
        this.ownerId = ownerId;
        this.type = 'GameObject';
        this.visible = true;
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

    /** Sets the visiblity of this GameObject. Note: This is used to make 
     * the GameObject disappear on the client side when this GameObject is 
     * not in use (returned to ObjectPool).
     */
    public setVisible(value: boolean) {
        this.visible = value;
    }

    /** Checks if this game object is visible. */
    public getVisible() {
        return this.visible;
    }
}