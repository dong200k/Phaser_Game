import { Schema, type } from "@colyseus/schema";
import Wave from "./wave/Wave";
import Tilemap from "./tilemap/Tilemap";

/**
 * The Dungeon class contains information about the waves of monsters that will spawn, spawn
 * locations, as well as the tilemap.
 */
export default class Dungeon extends Schema {

    @type("number") private currentWave: number;
    @type("boolean") private conquered: boolean;
    private waves: Wave[];
    private tilemap: Tilemap | null = null;

    constructor() {
        super();
        this.currentWave = 0;
        this.conquered = false;
        this.waves = [];
    }

    public addWave(wave: Wave) { 
        this.waves.push(wave);
    }

    public update(deltaT: number) {
        if(this.currentWave < this.waves.length) {
            this.waves[this.currentWave].update(deltaT);
        }
    }
}
