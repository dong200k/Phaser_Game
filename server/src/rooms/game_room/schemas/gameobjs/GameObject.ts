import { Schema, type } from '@colyseus/schema';
import MathUtil from '../../../../util/MathUtil';
import { Cloneable } from '../../../../util/PoolUtil';

export default class GameObject extends Schema implements Cloneable {
    @type('number') x;
    @type('number') y;
    @type('string') private id: string;
    @type('string') ownerId;
    @type('string') type;
    private body: Matter.Body | null = null;

    constructor(x: number, y: number, ownerId?: string) {
        super();
        this.id = MathUtil.uid()
        this.x = x;
        this.y = y;
        this.ownerId = ownerId;
        this.type = 'GameObject';
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
}