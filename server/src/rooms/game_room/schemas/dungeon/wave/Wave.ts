import { Schema, type } from "@colyseus/schema";
import DungeonEvent from "../DungeonEvent";

// A wave will continue to spawn monsters at its own pace. 
// A wave can spawn monsters at random locations on the map. Or at fixed locations.
// A wave can choose how many monsters it wants to spawn. 
// Methods can be called on the wave to increase its agressiveness or decrease it.
// Methods can be called on the wave to pause it. 
// Methods can be called on the wave to add monsters to the wave's queue.

export default class Wave {
    private monsterQueue: string[];

    constructor() {
        this.monsterQueue = [];
    }

    /**
     * Updates this wave, this will spawn the next wave when necessary.
     * @param deltaT The time passed in seconds.
     * @returns True if this wave is completed, false otherwise.
     */
    public update(deltaT: number): boolean {
        let monsterId = this.monsterQueue.shift();
        if(monsterId === undefined) return true;
        DungeonEvent.getInstance().emit("SPAWN_MONSTER", monsterId);
        return false;
    }

    /** Adds a monster's id to this wave's queue. */
    public addMonsterId(monsterId: string | string[]) {
        if(Array.isArray(monsterId)) monsterId.forEach((id) => this.monsterQueue.push(id));
        else this.monsterQueue.push(monsterId);
    }
}