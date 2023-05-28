import Entity from "./Entity";
import GameObject from "./GameObject";

export default class Projectile extends GameObject
{
    private projectileState: any;

    constructor(scene:Phaser.Scene,projectileState:any) {
        super(scene, projectileState.x, projectileState.y, projectileState.sprite);
        this.projectileState = projectileState;
    }

}