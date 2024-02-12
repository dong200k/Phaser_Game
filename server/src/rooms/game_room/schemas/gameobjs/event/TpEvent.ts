import Matter from "matter-js";
import GameManager from "../../../system/GameManager";
import { TpZone } from "../../../system/interfaces";
import Entity from "../Entity";
import GameEvent from "./GameEvent";
import { Categories } from "../../../system/Collisions/Category";
import MaskManager from "../../../system/Collisions/MaskManager";
import Player from "../Player";

export default class TpEvent extends GameEvent {

    private tpZone: TpZone;

    constructor(gameManager: GameManager, tpZone: TpZone) {
        super(gameManager, 
            {
                x: tpZone.tp_start.x, 
                y: tpZone.tp_start.y, 
                width: tpZone.tp_start.width, 
                height: tpZone.tp_start.height
            });
        this.tpZone = tpZone;
    }

    public handleEvent(entity: Entity): void {
        let position = {x: this.tpZone.tp_end.x, y: this.tpZone.tp_end.y};
        Matter.Body.setPosition(entity.getBody(), position);
        if(entity instanceof Player) {
            entity.snapCameraToPlayer();
        }
    }

}
