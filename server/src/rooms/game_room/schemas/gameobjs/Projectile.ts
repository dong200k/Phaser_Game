import { type } from '@colyseus/schema';
import Entity from './Entity';
import GameObject from './GameObject';
import MathUtil from '../../../../util/MathUtil';

export default class Projectile extends GameObject {
    @type(Entity) origin
    @type('string') sprite
    @type('string') projectileId
    
    @type('boolean') isHidden
    @type('boolean') isActive

    @type('number') spawnX
    @type('number') spawnY
    @type('number') width
    @type('number') height

    constructor(sprite: string, origin: Entity, spawnX: number, spawnY: number, width: number, height: number) {
        super(0, 0);
        this.sprite = sprite

        // projectile location and spawn
        this.x = spawnX
        this.y = spawnY
        this.spawnX = spawnX
        this.spawnY = spawnY

        // projectile shape
        this.width = width
        this.height = height

        this.origin = origin
        this.projectileId = MathUtil.uid()

        // for projectile reuse
        this.isHidden = false
        this.isActive = true

        this.type = "Projectile";
    }
}