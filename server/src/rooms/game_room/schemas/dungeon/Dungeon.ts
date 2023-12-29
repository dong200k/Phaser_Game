import { Schema, type, ArraySchema } from "@colyseus/schema";
import Wave from "./wave/Wave";
import Tilemap from "./tilemap/Tilemap";
import MathUtil from "../../../../util/MathUtil";
import GameManager from "../../system/GameManager";
import SafeWave from "./wave/SafeWave";
import Monster from "../gameobjs/monsters/Monster";

export class SpawnPoint extends Schema {
    @type("number") x: number;
    @type("number") y: number;

    constructor(x:number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}

class PlayerBounds extends Schema {
    @type("number") minX: number;
    @type("number") minY: number;
    @type("number") maxX: number;
    @type("number") maxY: number;

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.minX = x;
        this.minY = y;
        this.maxX = x + width;
        this.maxY = y + height;
    }
}

/**
 * The Dungeon class contains information about the waves of monsters that will spawn, spawn
 * locations, as well as the tilemap.
 */
export default class Dungeon extends Schema {

    @type("string") private dungeonName: string;
    /** The current wave zero indexed. So currentWave = 0 is wave 1 in-game. */
    @type("number") currentWave: number;
    @type("number") maxWave: number;
    @type("boolean") conquered: boolean;
    @type(Tilemap) tilemap: Tilemap | null = null;
    @type([SpawnPoint]) private playerSpawnPoints = new ArraySchema<SpawnPoint>();
    @type([SpawnPoint]) private monsterSpawnPoints = new ArraySchema<SpawnPoint>(); 
    @type(PlayerBounds) playerBounds: PlayerBounds | null = null;
    /** Time in seconds until safe wave is over */
    @type('number') safeWaveTime = 0
    
    private waves: Wave[];
    /** False if a wave is running. True otherwise.*/
    waveEnded: boolean;
    private gameManager: GameManager;
    

    constructor(gameManager: GameManager, dungeonName: string) {
        super();
        this.currentWave = -1;
        this.maxWave = -1;
        this.dungeonName = dungeonName;
        this.waveEnded = true;
        this.conquered = false;
        this.waves = [];
        this.gameManager = gameManager;
    }

    /**
     * Adds a new wave to this dungeon.
     * @param wave A Wave.
     */
    public addWave(wave: Wave) { 
        this.waves.push(wave);
        this.maxWave = this.waves.length;
    }

    /**
     * Updates the dungeon.
     * @param deltaT Time passed in seconds.
     */
    public update(deltaT: number) {
        if(!this.waveEnded && this.currentWave < this.waves.length) {
            if(this.waves[this.currentWave].update(deltaT)) {
                this.waveEnded = true;
                // Spawn a chest on the map in a random location.

                let minX = 50;
                let maxX = 200;
                let minY = 50;
                let maxY = 200;
                // Change the spawn area based on the size of the tilemap.
                if(this.tilemap) {
                    maxX = this.tilemap.width * this.tilemap.tileWidth - 20;
                    maxY = this.tilemap.height * this.tilemap.tileHeight - 20;
                }
                
                this.gameManager.getChestManager().spawnChest({
                    rarity: "wood",
                    x: MathUtil.getRandomIntegerBetween(minX, maxX),
                    y: MathUtil.getRandomIntegerBetween(minY, maxY)
                });
            }
        }
    }

    /** Checks to see if the dungeon has anymore waves to run. 
     * @returns True if there are more waves. False otherwise.
     */
    public hasNextWave() {
        return this.currentWave + 1 < this.waves.length;
    }

    public startNextWave() {
        // Dont start safe wave untill all monsters are cleared
        let nextWave = this.waves[this.currentWave + 1]
        if(nextWave instanceof SafeWave && this.hasMonsterAlive()){
            return
        }

        if(this.waveEnded === true) {
            this.currentWave++;
        }
        this.waveEnded = false;
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

    /**
     * Performs a check too see if this dungeon is over or not.
     * This will then update the conquered variable accordingly.
     */
    private checkIfConquered() {
        if(!this.hasNextWave() && this.waveEnded) {
            let dungeonOver = true;
            // Check if the are any more active monsters.
            this.gameManager.gameObjects.forEach((obj) => {
                if(obj instanceof Monster) {
                    if(obj.isActive()) {
                        dungeonOver = false;
                    }
                }
            })
            if(dungeonOver) {
                this.setConquered(true);
            } else {
                this.setConquered(false);
            }
        }
    }

    /** Returns if the dungeon has been conquered or not. */
    public isConquered() {
        this.checkIfConquered();
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

    /** Returns the current wave object using the the value of this.currentWave. */
    public getCurrentWaveObject() {
        return this.waves[this.currentWave];
    }

    /**
     * Returns a random monster spawn points.
     * @returns A random spawnpoint for monsters.
     */
    public getRandomMonsterSpawnPoint(): SpawnPoint | null {
        if(this.monsterSpawnPoints.length === 0) return null;
        return this.monsterSpawnPoints.at(Math.floor(this.monsterSpawnPoints.length * Math.random()));
    }
    
    /**
     * Adds the player world bounds which will lock the player's position inside 
     * these bounds.
     * @param x The top left corner x.
     * @param y The top left corner y.
     * @param width The width of the bounds.
     * @param height The height of the bounds.
     */
    public addPlayerWorldBounds(x: number, y: number, width: number, height: number) {
        this.playerBounds = new PlayerBounds(x, y, width, height);
    }

    /**
     * Gets the player bounds for this dungeon.
     * The player bounds restrict the player's movements 
     * to within the bounds.
     */
    public getPlayerBounds() {
        return this.playerBounds;
    }
    
    /**
     * 
     * @returns true if there are monsters still active else false
     */
    public hasMonsterAlive(){
        let hasMonsterAlive = false
        this.gameManager.gameObjects.forEach((obj) => {
            if(obj instanceof Monster) {
                if(obj.isActive()) {
                    hasMonsterAlive = true;
                }
            }
        })

        return hasMonsterAlive
    }
}
