import Matter from "matter-js";
import GameManager from "../../system/GameManager";
import GameObject from "./GameObject";
import { Categories } from "../../system/Collisions/Category";
import MaskManager from "../../system/Collisions/MaskManager";

export default class GuildShop extends GameObject {

    constructor(gameManager: GameManager, x: number, y: number) {
        super(gameManager, x, y);
        this.type = "GuildShop";
        this.width = 48;
        this.height = 42;
        this.body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: true,
        });
        this.body.collisionFilter = {
            group: 0,
            category: Categories.OBSTACLE,
            mask: MaskManager.getManager().getMask('OBSTACLE'),
        }
    }

}
