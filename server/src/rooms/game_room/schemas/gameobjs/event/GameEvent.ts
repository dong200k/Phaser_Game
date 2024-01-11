import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { AABB, TpZone } from "../../../system/interfaces";
import Entity from "../Entity";
import GameObject from "../GameObject";
import { Categories } from "../../../system/Collisions/Category";
import MaskManager from "../../../system/Collisions/MaskManager";

export default class GameEvent extends GameObject {


    /**
     * Create a GameEvent. Pass in a bounds AABB object if you want 
     * this event to trigger on player collision using the AABB.
     * @param gameManager The GameManager.
     * @param bounds The bounds AABB object. Note that x and y values of the AABB refer to the center point.
     */
    constructor(gameManager: GameManager, bounds?: AABB) {
        super(gameManager, 0, 0);
        if(bounds) {
            this.x = bounds.x;
            this.y = bounds.y;
            this.width = bounds.width;
            this.height = bounds.height;
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
    }

    public handleEvent(entity: Entity) {
        // should be overridden by child classes.
        console.log("Event triggered!");
    }

}
