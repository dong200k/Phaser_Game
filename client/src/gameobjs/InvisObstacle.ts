import GameObject from "./GameObject";

/** The invis obstacle is mainly used for matter js collisions. */
export default class InvisObstacle extends GameObject
{

    constructor(scene:Phaser.Scene, obstacleState: any) {
        super(scene, obstacleState.x, obstacleState.y, "", obstacleState);
        this.width = obstacleState.width;
        this.height = obstacleState.height;

    }

}