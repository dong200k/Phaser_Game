import { Schema, type, ArraySchema } from "@colyseus/schema";
import Tilemap from "./tilemap/Tilemap";
import { AABB, TpZone, Vector2 } from "../../system/interfaces";
import GameManager from "../../system/GameManager";
import Dungeon from "./Dungeon";

export default class City extends Dungeon {
    private tpZones: TpZone[]; //Tp zones allow players to travel from a tilemap area to another area.

    constructor(gameManager: GameManager) {
        super(gameManager, "City");
        this.tpZones = [];
    }

    public getTpZones() {
        return this.tpZones;
    }

    /**
     * Updates the tutorial dungeon.
     * @param deltaT The time passed in seconds.
     */
    public update(deltaT: number) {
        // console.log('Updating the city!!!');
    }

    /**
     * The city cannot be conquered.
     * This will always return false.
     */
    public isConquered(): boolean {
        return false;
    }
}