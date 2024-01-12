import GameManager from "../GameManager";
import { TiledJSON } from "../interfaces";
import { Schema, type, ArraySchema } from '@colyseus/schema';
import Player from "../../schemas/gameobjs/Player";
import { Chunk } from "../../schemas/dungeon/Map/Chunk";
import TiledJSONClass from "../../schemas/dungeon/Map/TiledJSONClass";
import ChunkMap from "../../schemas/dungeon/Map/ChunkMap";

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

/** This class will manage the loading and unloading of chunks of one ChunkMap aka map/dungeon based on players positions.
 * Also since this is the server we will only load the obstacles. The client side is updated and will have its own map that loads every layer.
 */
export default class MapManager {
    private gameManager: GameManager
    private tiledJSON: TiledJSON
    /** Width of chunk in tiles */
    private chunkWidth = 30
    /** Height of chunk in tiles */
    private chunkHeight = 30
    private tileWidth = 16
    private tileHeight = 16
    /** number of chunks or the radius around chunks with a player that should be loaded. 
     * A zero load radius means the chunk is only loaded when a player enters it */
    private loadRadius = 2
    /** distance from the nearest chunk with a player where the chunk will get unloaded */
    private unloadRadius = 4
    /** Chunks that are free */
    private freeChunks: Chunk[] = []
    private timeSoFar = 0
    private checkChunkTimeSeconds = 1
    private chunkMap: ChunkMap
    /** name of layers with tiles */
    private layerNameWithTiles = new Set(["Obstacle", "Ground", "Background"])

    constructor(gameManager: GameManager, chunkMap: ChunkMap, tiledJSON: TiledJSON, chunkConfig?: IChunkConfig){
        this.gameManager = gameManager
        if(chunkConfig) this.setConfig(chunkConfig)
        this.chunkMap = chunkMap
        this.chunkMap.setChunkHeight(this.chunkHeight)
        this.chunkMap.setChunkWidth(this.chunkWidth)
        this.tiledJSON = tiledJSON
    }

    public update(deltaT: number){
        this.timeSoFar += deltaT
        if(this.timeSoFar <= this.checkChunkTimeSeconds) return
        this.timeSoFar = 0

        this.gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Player){
                let playerChunkId = this.getChunkIdForPosition(obj.getBody().position)
                // console.log(`player: ${obj.name} is in chunk ${playerChunkId}`)

                // Load chunks near player
                let chunksNearPlayer = this.getChunkIdsWithinLoadRadius(playerChunkId)
                // console.log(`chunks near player ${obj.name}, ${chunksNearPlayer}`)
                for(let chunkId of chunksNearPlayer){
                    this.loadChunkById(chunkId)
                }
            }
        })   

        // Unload active chunks that are not near any player
        for(let [chunkId,] of this.chunkMap.activeChunks){
            let chunkNumber = parseInt(chunkId)
            if(this.shouldUnload(chunkNumber)) this.unloadChunkById(chunkNumber)
        }
    }

    /**
     * Initializes the first chunk/chunks near the position argument
     * @param position 
     */
    public initChunks(position: {x: number, y: number}){
        let id = this.getChunkIdForPosition(position)
        let chunkIdsNearby = this.getChunkIdsWithinLoadRadius(id)
        for(let chunkId of chunkIdsNearby){
            this.loadChunkById(chunkId)
        }
    }

    /**
     * Takes in a chunk id and creates a new chunk and loads it if it is not currently active
     * 
     * Note: chunk is loaded even if it is out of bounds, though that should not cause errors
     * @param id 
     * @returns 
     */
    private loadChunkById(id: number){
        // console.log(`Server is attempting to load chunk ${id}`)
        if(!this.isValidChunkId(id)) return
        // Todo add chunk recycling logic, maybe add logic to check that chunk is within bounds of game world(although it doesn't matter and won't cause an error i think)
        let stringId = id.toString()
        if(this.chunkMap.activeChunks.has(stringId)) return
        let chunk = new Chunk(this, this.chunkMap, id)
        this.chunkMap.activeChunks.set(stringId, chunk)
        chunk.loadChunk()
    }

    private isValidChunkId(id: number){
        let maxChunkId = Math.ceil(this.tiledJSON.width/this.chunkWidth) * Math.ceil(this.tiledJSON.height/this.chunkHeight) - 1
        return id >= 0 && id <= maxChunkId
    }

    /**
     * Takes in a chunk id and unloads the chunk and removes it from the active chunksmap if it exists
     * @param id 
     */
    private unloadChunkById(id: number){
        // console.log(`Server is attempting to unload chunk ${id}`)
        let stringId = id.toString()

        // TODO add chunk recycling logic
        if(this.chunkMap.activeChunks.has(stringId)){
            // console.log(`Server unloaded chunk ${id}`)
            this.chunkMap.activeChunks.get(stringId)?.unloadChunk()
            this.chunkMap.activeChunks.delete(stringId)
        }
    }

    /**
     * Return the chunk id based on the given position in the game world
     * @param position 
     * @returns 
     */
    public getChunkIdForPosition(position: {x: number, y: number}){
        // Get the tile position
        let tileX = position.x / this.tileWidth
        let tileY = position.y / this.tileHeight
        
        return Math.floor(tileX/this.chunkWidth) + Math.ceil(this.tiledJSON.width/this.chunkWidth) * Math.floor(tileY/this.chunkHeight)
    }

    /**
     * Returns a chunk x and y based representing the chunk position relative to other chunks the first chunk is at 0,0. Note this position is not in the game world.
     * @param id 
     * @returns 
     */
    public getChunkXandY(id: number){
        let {startX, startY} = this.getChunkStartAndEnd(id)
        return {x: Math.floor(startX/this.chunkWidth), y: Math.floor(startY/this.chunkHeight)}
    }

    /**
     * Returns a list of ids within the load of the given chunk id
     * 
     * Note: these ids may be for chunks off the map
     * @param id 
     * @returns 
     */
    public getChunkIdsWithinLoadRadius(id: number){
        return this.getChunkIdsWithinRadius(id, this.loadRadius)
    }

    /**
     * Returns the id of all chunks within the radius of the given chunk id
     * @param id chunk id to check radius
     * @param radius distance in terms of chunks from the id based on the 4 side traversal. Diagonal chunks require 2 moves to reach side chunks require 1 mnove.
     */
    public getChunkIdsWithinRadius(id: number, radius: number){
        // Get chunk x and y with 0th chunk starting at 0,0
        let {x, y} = this.getChunkXandY(id)
        let ids: number[] = []

        // console.log(`get chunkids in load radius x: ${x}, y: ${y}`)
        let loadStartX = x - radius
        let loadEndX = x + radius
        // Brute force calculate all chunks ids within load radius assumin 4 side connection (2 chunks are neigbors if they are below, on top, or on the side of each other)
        for(let i=loadStartX;i<=loadEndX;i++){
            let leftOverRadius = radius - Math.abs(i - x)
            if(leftOverRadius < 0) continue
            for(let j=y-leftOverRadius;j<=y+leftOverRadius;j++){
                // console.log(`neighbor x: ${x}, y: ${y}`)

                let neighborId = i + j * Math.ceil(this.tiledJSON.width / this.chunkWidth)
                // console.log(`neighor chunk id: ${neighborId}`)
                ids.push(neighborId)
            }
        }

        return ids
    }

    /** Returns whether the chunk should unload or not which is based on the unload radius and the players positions */
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
            let diff = Math.abs(playerChunkX - x) + Math.abs(playerChunkY - y)
            if(diff < this.unloadRadius){
                exceedsUnloadRadius = false
            }
        }

        return exceedsUnloadRadius
    }

    /** Returns the chunk startX, startY, endX, and endY. This is in terms of tiles not the actual pixel locations in game */
    public getChunkStartAndEnd(id: number){
        let startX = Math.floor(id % Math.ceil(this.tiledJSON.width / this.chunkWidth)) * this.chunkWidth
        let endX = startX + this.chunkWidth

        let startY = Math.floor(id / Math.ceil(this.tiledJSON.width / this.chunkWidth)) * this.chunkHeight
        let endY = startY + this.chunkHeight
        // console.log(`chunk ${id} startX: ${startX}, startY: ${startY}`)
        return {startX, startY, endX, endY}
    }

    public getChunksData(){
        return {
            // activeChunkIds: this.getActiveChunkIds(),
            chunkHeight: this.chunkHeight,
            chunkWidth: this.chunkWidth,
            tileWidth: this.tileWidth,
            tileHeight: this.tileHeight,
            loadRadius: this.loadRadius,
            unloadRadius: this.unloadRadius
        }
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

    /**
     * Return set of layer names with tiles
     */
    public getLayerNamesWithTiles(){
        return this.layerNameWithTiles
    }

    /**
     * Checks whether the given tile position is within the map
     * @param tileX 
     * @param tileY 
     * @returns 
     */
    public inBounds(tileX: number, tileY: number){
        return tileX >= 0 && tileX < this.tiledJSON.width && tileY >= 0 && tileY < this.tiledJSON.height
    }
}