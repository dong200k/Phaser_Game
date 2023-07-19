import GameObject from "./GameObject";
import ProjectileState from "../../../server/src/rooms/game_room/schemas/projectiles/Projectile";

export default class Projectile extends GameObject
{
    private projectileState: ProjectileState;

    constructor(scene:Phaser.Scene,projectileState:ProjectileState) {
        super(scene, projectileState.x, projectileState.y, projectileState.sprite, projectileState);
        this.projectileState = projectileState;
    }

}