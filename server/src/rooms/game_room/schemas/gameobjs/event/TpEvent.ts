import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { TpZone } from "../../../system/interfaces";
import Entity from "../Entity";
import GameEvent from "./GameEvent";
import { Categories } from "../../../system/Collisions/Category";
import MaskManager from "../../../system/Collisions/MaskManager";

export default class TpEvent extends GameEvent {

    private tpZone: TpZone;

    constructor(gameManager: GameManager, tpZone: TpZone) {
        super(gameManager);
        this.tpZone = tpZone;
        this.x = tpZone.tp_start.x;
        this.y = tpZone.tp_start.y;
        this.width = tpZone.tp_start.width;
        this.height = tpZone.tp_start.height;

        // Create Matter Body
        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: true,
            isSensor: true,
        });
        body.collisionFilter = {
            group: 0,
            category: Categories.EVENT,
            mask: MaskManager.getManager().getMask('EVENT'),
        }
        this.setBody(body);
    }

    public handleEvent(entity: Entity): void {
        let position = {x: this.tpZone.tp_end.x, y: this.tpZone.tp_end.y};
        Matter.Body.setPosition(entity.getBody(), position);
    }

}
