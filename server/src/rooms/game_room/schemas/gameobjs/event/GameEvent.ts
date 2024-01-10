import GameManager from "../../../system/GameManager";
import { TpZone } from "../../../system/interfaces";
import Entity from "../Entity";
import GameObject from "../GameObject";

export default class GameEvent extends GameObject {


    constructor(gameManager: GameManager) {
        super(gameManager, 0, 0);
    }

    public handleEvent(entity: Entity) {
        // should be overridden by child classes.
        console.log("Event triggered!");
    }

}
