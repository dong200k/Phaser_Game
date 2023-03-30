import { Schema, type } from '@colyseus/schema';
import Entity from './Entity';
import Cooldown from './Cooldown';

export default class Player extends Entity {
    @type('string') name;
    @type('string') role;
    @type(Cooldown) attackCooldown;
    @type(Cooldown) specialCooldown;

    constructor(name: string, role?: string) {
        super();
        this.name = name;
        this.role = role? role: "ranger"
        this.attackCooldown = new Cooldown(1000)
        this.specialCooldown = new Cooldown(5000)
    }
}