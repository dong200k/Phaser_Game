import { Schema, type, ArraySchema } from "@colyseus/schema";
import Wave from "./wave/Wave";
import Tilemap from "./tilemap/Tilemap";
import MathUtil from "../../../../util/MathUtil";
import GameManager from "../../system/GameManager";
import SafeWave from "./wave/SafeWave";
import Monster from "../gameobjs/monsters/Monster";
import ChunkMap from "./Map/ChunkMap";
import Player from "../gameobjs/Player";

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
    @type("number") currentWave: number;
    @type("number") maxWave: number;
    @type("boolean") conquered: boolean;
    // @type(Tilemap) tilemap: Tilemap | null = null;
    @type(ChunkMap) chunkMap: ChunkMap | null = null
    @type([SpawnPoint]) private playerSpawnPoints = new ArraySchema<SpawnPoint>();
    @type([SpawnPoint]) private monsterSpawnPoints = new ArraySchema<SpawnPoint>(); 
    @type(PlayerBounds) playerBounds: PlayerBounds | null = null;
    /** Time in seconds until safe wave is over */
    @type('number') safeWaveTime = 0
    
    private waves: Wave[];
    /** False if a wave is running. True otherwise.*/
    waveEnded: boolean;
    private gameManager: GameManager;
    private spawnLimit = 500
    

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
            if(this.waves[this.currentWave] instanceof Wave && this.getActiveMonsterCount() >= this.spawnLimit) return
            if(this.waves[this.currentWave].update(deltaT)) {
                this.waveEnded = true;
                // Spawn a chest on the map in a random location.

                let minX = 50;
                let maxX = 200;
                let minY = 50;
                let maxY = 200;
                // Change the spawn area based on the size of the tilemap.
                // if(this.tilemap) {
                //     maxX = this.tilemap.width * this.tilemap.tileWidth - 20;
                //     maxY = this.tilemap.height * this.tilemap.tileHeight - 20;
                // }
                
                // this.gameManager.getChestManager().spawnChest({
                //     rarity: "wood",
                //     x: MathUtil.getRandomIntegerBetween(minX, maxX),
                //     y: MathUtil.getRandomIntegerBetween(minY, maxY)
                // });
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

    // public setTilemap(tilemap: Tilemap) {
    //     this.tilemap = tilemap;
    // }

    // public getTilemap() {
    //     return this.tilemap;
    // }

    public setChunkMap(chunkMap: ChunkMap) {
        this.chunkMap = chunkMap
    }

    public getChunkMap() {
        return this.chunkMap
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
        if(this.monsterSpawnPoints.length === 0) {
            // get a random position around player
            let spawnPoint: SpawnPoint | null = null
            for(let obj of this.gameManager.gameObjects){
                if(obj instanceof Player) {
                    // let x = (Math.random() * 200 + 500) * (Math.random()<0.5? 1 : -1) + obj.x
                    // let y = (Math.random() * 200 + 500) * (Math.random()<0.5? 1 : -1) + obj.y
                    // spawnPoint = new SpawnPoint(x, y)
                    let radius = 800
                    let playerVelocity = obj.getBody().velocity
                    let rotationDegree = Math.random() * 360 - 180
                    let rotatedOffset = MathUtil.getRotatedSpeed(playerVelocity.x, playerVelocity.y, radius, rotationDegree)
                    let newPos = {x: obj.x + rotatedOffset.x, y: obj.y + rotatedOffset.y}
                    return new SpawnPoint(newPos.x, newPos.y)
                }
            }
            return spawnPoint
        }
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

    /**
     * 
     * @returns true number of active monsers
     */
    public getActiveMonsterCount(){
        let count = 0
        this.gameManager.gameObjects.forEach((obj) => {
            if(obj instanceof Monster) {
                if(obj.isActive()) {
                    count++
                }
            }
        })

        return count
    }
}
