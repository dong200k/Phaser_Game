import Entity from "./Entity";

export default class Projectile extends Entity
{
    private projectileState: any;

    constructor(scene:Phaser.Scene,projectileState:any) {
        super(scene, projectileState.x, projectileState.y, projectileState.sprite);
        this.projectileState = projectileState;
    }

}