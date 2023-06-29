import { Schema, type } from "@colyseus/schema";
import DungeonEvent from "../DungeonEvent";

// A wave will continue to spawn monsters at its own pace. 
// A wave can spawn monsters at random locations on the map. Or at fixed locations.
// A wave can choose how many monsters it wants to spawn. 
// Methods can be called on the wave to increase its agressiveness or decrease it.
// Methods can be called on the wave to pause it. 
// Methods can be called on the wave to add monsters to the wave's queue.

interface MonsterQueueItem {
    count: number;
    monsterId: string;
}

type AggressionLevelType = 1|2|3|4|5;

export default class Wave {
    private monsterQueue: MonsterQueueItem[];
    private aggressionLevel: AggressionLevelType;
    private timeUntilNextSpawn: number;
    private defaultTimeUntilNextSpawn: number;
    private spawnsQueued: number;
    private spawnMonsterCallback: (monsterId: string) => void;

    constructor(spawnMonsterCallback: (monsterId: string) => void) {
        this.monsterQueue = [];
        this.aggressionLevel = 3;
        this.timeUntilNextSpawn = 1;
        this.defaultTimeUntilNextSpawn = 1;
        this.spawnsQueued = 0;
        this.spawnMonsterCallback = spawnMonsterCallback;
    }

    /**
     * Updates this wave, this will spawn the next wave when necessary.
     * @param deltaT The time passed in seconds.
     * @returns True if this wave is completed, false otherwise.
     */
    public update(deltaT: number): boolean {
        // updates this wave's spawn timing.
        this.timeUntilNextSpawn -= deltaT;
        if(this.timeUntilNextSpawn <= 0) {
            this.spawnsQueued++;
            this.timeUntilNextSpawn += this.defaultTimeUntilNextSpawn;
        }

        // Sends out an event to spawn a monster.
        while(this.spawnsQueued > 0) {
            let monsterId = this.getNextMonsterId();
            if(monsterId === undefined) return true;
            this.spawnMonsterCallback(monsterId);
            this.spawnsQueued--; 
        }
        return false;
    }

    /** Adds a monster to this wave's queue.
     * @param monsterId The id of the monster.
     * @param count The count of monster (defaults to 1).
     */
    public addMonster(monsterId: string, count: number = 1) {
        if(Array.isArray(monsterId)) monsterId.forEach((id) => this.monsterQueue.push(id));
        else this.monsterQueue.push({monsterId: monsterId, count: count});
    }

    /**
     * Sets this wave's aggression level, which will determine how agressive the wave is at spawning monsters.
     * @param aggressionLevel 1-chill, 2-easy, 3-normal, 4-hard, 5-nightmare.
     */
    public setAgressionLevel(aggressionLevel: AggressionLevelType) {
        this.aggressionLevel = aggressionLevel;
        switch(this.aggressionLevel) {
            case 1: this.defaultTimeUntilNextSpawn = 2; break;
            case 2: this.defaultTimeUntilNextSpawn = 1.5; break;
            case 3: this.defaultTimeUntilNextSpawn = 1; break;
            case 4: this.defaultTimeUntilNextSpawn = 0.5; break;
            case 5: this.defaultTimeUntilNextSpawn = 0.25; break;
        }
    }

    /**
     * Gets the next monster's id, removing it from this wave's queue in the process.
     * @returns A string representing the next monster that will be spawned. undefined if there will be none.
     */
    public getNextMonsterId(): string | undefined {
        let monsterIdFound = false;
        let monsterId = undefined;
        while(!monsterIdFound && this.monsterQueue.length > 0) {
            if(this.monsterQueue[0].count <= 0) {
                this.monsterQueue.shift();
            } else {
                this.monsterQueue[0].count--;
                monsterId = this.monsterQueue[0].monsterId;
                if(this.monsterQueue[0].count <= 0) this.monsterQueue.shift();
                monsterIdFound = true;
            }
        }
        return monsterId;
    }
}