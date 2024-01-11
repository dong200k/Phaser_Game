import Matter from "matter-js";
import GameManager from "../../system/GameManager";
import GameObject from "./GameObject";

export default class MissionBoard extends GameObject {

    constructor(gameManager: GameManager, x: number, y: number) {
        super(gameManager, x, y);
        this.type = "MissionBoard";
        this.body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: true,
            isSensor: false,
        });
    }

}
