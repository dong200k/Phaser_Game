import GameManager from "../GameManager";
import { TiledJSON } from "../interfaces";
import { Schema, type, ArraySchema } from '@colyseus/schema';
import Player from "../../schemas/gameobjs/Player";
import { Chunk } from "../../schemas/dungeon/Map/Chunk";


export interface IChunkConfig{
    /** Width of chunk in tiles */
    chunkWidth?: number,
    /** Height of chunk in tiles */
    chunkHeight?: number,
    /** Pixel width of tile */
    tileWidth?: number,
    /** Pixel height of tile */
    tileHeight?: number,
    /** number of chunks or the radius around chunks with a player that should be loaded. 
     * A zero load radius means the chunk is only loaded when a player enters it */
    loadRadius?: number,
    /** distance from the nearest chunk with a player where the chunk will get unloaded */
    unloadRadius?: number
}

/** This class will manage the loading and unloading of chunks of one map/dungeon.
 * Also since this is the server we will only load the obstacles. The client side is updated and will have its own map that loads every layer.
 */
export default class MapManager{
    private gameManager: GameManager
    private tiledJSON!: TiledJSON
    /** Width of chunk in tiles */
    private chunkWidth = 30
    /** Height of chunk in tiles */
    private chunkHeight = 30
    private tileWidth = 16
    private tileHeight = 16
    /** number of chunks or the radius around chunks with a player that should be loaded. 
     * A zero load radius means the chunk is only loaded when a player enters it */
    private loadRadius = 1
    /** distance from the nearest chunk with a player where the chunk will get unloaded */
    private unloadRadius = 3
    /** Chunks that are currently being used */
    private activeChunksMap: Map<number, Chunk> = new Map()
    /** Chunks that are free */
    private freeChunks: Chunk[] = []
    private timeSoFar = 0
    private checkChunkTime = 5000

    constructor(gameManager: GameManager, chunkConfig?: IChunkConfig){
        this.gameManager = gameManager
        if(chunkConfig) this.setConfig(chunkConfig)
    }

    public update(deltaT: number){
        this.timeSoFar += deltaT
        if(this.timeSoFar <= this.checkChunkTime) return
        this.timeSoFar = 0

        this.gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Player){
                
                let playerChunkId = this.getChunkIdForPosition(obj.getBody().position)

                // Load nearby chunks
                let chunksNearPlayer = this.getChunkIdsWithinLoadRadius(playerChunkId)
                for(let chunkId of chunksNearPlayer){
                    this.loadChunkById(chunkId)
                }

                // Unload active chunks that are not nearby
                for(let [chunkId,] of this.activeChunksMap)
                if(this.shouldUnload(chunkId)) this.unloadChunkById(chunkId)
            }
        })
        
    }

    private loadChunkById(id: number){
        // Todo add chunk recycling logic
        if(this.activeChunksMap.has(id)) return
        let chunk = new Chunk(this, this.tiledJSON, id)
        this.activeChunksMap.set(id, chunk)
        chunk.loadChunk()
    }

    private unloadChunkById(id: number){
        // TODO add chunk recycling logic
        if(this.activeChunksMap.has(id)){
            this.activeChunksMap.get(id)?.unloadChunk()
            this.activeChunksMap.delete(id)
        }
    }

    public getChunkIdForPosition(position: {x: number, y: number}){
        return Math.floor(position.x/this.chunkWidth) + Math.ceil(this.tiledJSON.width/this.chunkWidth) * Math.floor(position.y/this.chunkHeight)
    }

    public getChunkXandY(id: number){
        let {startX, startY} = this.getChunkStartAndEnd(id)
        return {x: Math.floor(startX/this.chunkWidth), y: Math.floor(startY/this.chunkHeight)}
    }

    public getChunkIdsWithinLoadRadius(id: number){
        // Get chunk x and y with 0th chunk starting at 0,0
        let {x, y} = this.getChunkXandY(id)
        let ids: number[] = []

        // Brute force calculate all chunks ids within load radius assumin 4 side connection (2 chunks are neigbors if they are below, on top, or on the side of each other)
        for(let i=x-this.loadRadius;i<=x+this.loadRadius;i++){
            let leftOverRadius = Math.abs(i - x)
            for(let j=y-leftOverRadius;j<=y+leftOverRadius;j++){
                let neighborId = i + j * Math.ceil(this.tiledJSON.width / this.chunkWidth)
                if(id! == neighborId) ids.push(neighborId)
            }
        }

        return ids
    }

    /** Returns whether the chunk should unload or not */
    public shouldUnload(id: number){
        // Get id of chunks with a player
        let chunksIdsWithPlayers = new Set<number>()
        this.gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Player){
                chunksIdsWithPlayers.add(this.getChunkIdForPosition(obj.getBody().position))
            }
        })

        let {x, y} = this.getChunkXandY(id)

        // Check if chunk exceeds unload radius for all players
        let exceedsUnloadRadius = true
        for(let playerChunkId of chunksIdsWithPlayers){
            let {x: playerChunkX, y: playerChunkY} = this.getChunkXandY(playerChunkId)
            let diff = Math.abs(playerChunkX - x) + Math.abs(playerChunkY - x)
            if(diff < this.unloadRadius){
                exceedsUnloadRadius = false
            }
        }

        return exceedsUnloadRadius
    }

    public getChunkStartAndEnd(id: number){
        let startX = Math.floor(id % Math.ceil(this.tiledJSON.width / this.chunkWidth))
        let endX = startX + this.chunkWidth

        let startY = Math.floor(id / Math.ceil(this.tiledJSON.width / this.chunkWidth))
        let endY = startY + this.chunkHeight
        return {startX, startY, endX, endY}
    }

    public readJSON(){

    }

    public getActiveChunkIds(){

    }

    public getChunksData(){
        return {
            activeChunkIds: this.getActiveChunkIds(),
            chunkHeight: this.chunkHeight,
            chunkWidth: this.chunkWidth,
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            loadRadius: this.loadRadius,
            unloadRadius: this.unloadRadius
        }
    }

    public notifyClient(){

    }

    public setConfig(chunkConfig: IChunkConfig){
        this.chunkHeight = chunkConfig.chunkHeight ?? this.chunkHeight
        this.chunkWidth = chunkConfig.chunkWidth ?? this.chunkWidth
        this.tileWidth = chunkConfig.tileWidth ?? this.tileWidth
        this.tileHeight = chunkConfig.tileHeight ?? this.tileHeight,
        this.loadRadius = chunkConfig.loadRadius ?? this.loadRadius
        this.unloadRadius = chunkConfig.unloadRadius ?? this.unloadRadius
    }

    public getGameManager(){
        return this.gameManager
    }

    public setTiledJSON(tiledJSON: TiledJSON){
        this.tiledJSON = tiledJSON
    }
}