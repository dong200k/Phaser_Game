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
    private waitingForWaveStart: boolean;

    constructor(dungeonName: string) {
        super();
        this.currentWave = 1;
        this.dungeonName = dungeonName;
        this.waitingForWaveStart = true;
        this.conquered = false;
        this.waves = [];
    }

    /**
     * Adds a new wave to this dungeon.
     * @param wave A Wave.
     */
    public addWave(wave: Wave) { 
        this.waves.push(wave);
    }

    /**
     * Updates the dungeon.
     * @param deltaT Time passed in seconds.
     */
    public update(deltaT: number) {
        if(!this.waitingForWaveStart && this.currentWave - 1 < this.waves.length) {
            if(this.waves[this.currentWave - 1].update(deltaT)) {
                this.currentWave++;
                this.waitingForWaveStart = true;
            }
        }
    }

    /** Checks to see if the dungeon has anymore waves to run. 
     * @returns True if there are more waves. False otherwise.
     */
    public hasNextWave() {
        return this.currentWave - 1 < this.waves.length;
    }

    public startNextWave() {
        this.waitingForWaveStart = false;
    }

    public setTilemap(tilemap: Tilemap) {
        this.tilemap = tilemap;
    }

    public getTilemap() {
        return this.tilemap;
    }

    public getDungeonName() {
        return this.dungeonName;
    }

    public isConquered() {
        return this.conquered;
    }

    public setConquered(conquered: boolean) {
        this.conquered = conquered;
    }

    /**
     * Adds a spawn point for players.
     * @param x The x value.
     * @param y The y value.
     */
    public addPlayerSpawnPoint(x: number, y: number) {
        let spawnPoint = new SpawnPoint(x, y);
        this.playerSpawnPoints.push(spawnPoint);
    }

    /**
     * Adds a spawn point for monsters.
     * @param x The x value.
     * @param y The y value.
     */
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

    /**
     * Returns a random monster spawn points.
     * @returns A random spawnpoint for monsters.
     */
    public getRandomMonsterSpawnPoint(): SpawnPoint | null {
        if(this.monsterSpawnPoints.length === 0) return null;
        return this.monsterSpawnPoints.at(Math.floor(this.monsterSpawnPoints.length * Math.random()));
    }
    
    
}
