import { Schema, type, ArraySchema } from "@colyseus/schema";
import Wave from "./wave/Wave";
import Tilemap from "./tilemap/Tilemap";

export class SpawnPoint extends Schema {
    @type("number") x: number;
    @type("number") y: number;

    constructor(x:number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}

/**
 * The Dungeon class contains information about the waves of monsters that will spawn, spawn
 * locations, as well as the tilemap.
 */
export default class Dungeon extends Schema {

    @type("string") private dungeonName: string;
    @type("number") private currentWave: number;
    @type("boolean") private conquered: boolean;
    @type(Tilemap) private tilemap: Tilemap | null = null;
    @type([SpawnPoint]) private playerSpawnPoints = new ArraySchema<SpawnPoint>();
    @type([SpawnPoint]) private monsterSpawnPoints = new ArraySchema<SpawnPoint>(); 
    private waves: Wave[];

    constructor(dungeonName: string) {
        super();
        this.currentWave = 1;
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
        if(this.currentWave - 1 < this.waves.length) {
            if(this.waves[this.currentWave - 1].update(deltaT)) {
                this.currentWave ++;
            }
        }
    }

    public setTilemap(tilemap: Tilemap) {
        this.tilemap = tilemap;
    }

    public getTilemap() {
        return this.tilemap;
    }

    public addPlayerSpawnPoint(x: number, y: number) {
        let spawnPoint = new SpawnPoint(x, y);
        this.playerSpawnPoints.push(spawnPoint);
    }

    public addMonsterSpawnPoint(x: number, y: number) {
        let spawnPoint = new SpawnPoint(x, y);
        this.monsterSpawnPoints.push(spawnPoint);
    }

    public getPlayerSpawnPoints() {
        return this.playerSpawnPoints;
    }

    public getMonsterSpawnPoints() {
        return this.monsterSpawnPoints;
    }

    public getCurrentWave() {
        return this.currentWave;
    }

    public getRandomMonsterSpawnPoint(): SpawnPoint | null {
        if(this.monsterSpawnPoints.length === 0) return null;
        return this.monsterSpawnPoints.at(Math.floor(this.monsterSpawnPoints.length * Math.random()));
    }
}
