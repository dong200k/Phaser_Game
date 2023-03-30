import { type } from '@colyseus/schema';
import Entity from './Entity';
import GameObject from './GameObject';
import MathUtil from '../../../../util/MathUtil';

export default class Projectile extends GameObject {
    @type(Entity) origin
    @type('string') sprite
    @type('number') x
    @type('number') y
    @type('string') id
    

    constructor(sprite: string, x: number, y: number, origin: Entity) {
        super(0, 0);
        this.sprite = sprite
        this.x = x
        this.y = y
        this.origin = origin
        this.id = MathUtil.uid()
    }
}