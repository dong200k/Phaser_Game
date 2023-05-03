import { Schema, type } from "@colyseus/schema";
import Wave from "./wave/Wave";
import Tilemap from "./tilemap/Tilemap";

/**
 * The Dungeon class contains information about the waves of monsters that will spawn, spawn
 * locations, as well as the tilemap.
 */
export default class Dungeon extends Schema {

    @type("string") private dungeonName: string;
    @type("number") private currentWave: number;
    @type("boolean") private conquered: boolean;
    @type(Tilemap) private tilemap: Tilemap | null = null;
    private waves: Wave[];

    constructor(dungeonName: string) {
        super();
        this.currentWave = 0;
        this.dungeonName = dungeonName;
        this.conquered = false;
        this.waves = [];
    }

    public addWave(wave: Wave) { 
        this.waves.push(wave);
    }

    /**
     * Updates the dungeon.
     * @param deltaT Time passed in seconds.
     */
    public update(deltaT: number) {
        if(this.currentWave < this.waves.length) {
            if(this.waves[this.currentWave].update(deltaT)) {
                this.currentWave ++;
            }
        }
    }

    public setTilemap(tilemap: Tilemap) {
        this.tilemap = tilemap;
    }
}
