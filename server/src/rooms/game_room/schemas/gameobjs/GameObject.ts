import { Schema, type } from '@colyseus/schema';
import MathUtil from '../../../../util/MathUtil';

export default class GameObject extends Schema {
    @type('number') x;
    @type('number') y;
    @type('string') id;
    @type('string') ownerId

    constructor(x: number, y: number, ownerId?: string) {
        super();
        this.id = MathUtil.uid()
        this.x = x;
        this.y = y;
        this.ownerId = ownerId
    }
}