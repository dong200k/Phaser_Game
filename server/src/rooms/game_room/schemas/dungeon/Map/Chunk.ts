import Matter from "matter-js"
import DungeonManager from "../../../system/StateManagers/DungeonManager"
import MapManager from "../../../system/StateManagers/MapManager"
import { TiledJSON } from "../../../system/interfaces"
import InvisObstacle from "../../gameobjs/InvisObstacle"
import { Categories } from "../../../system/Collisions/Category"
import MaskManager from "../../../system/Collisions/MaskManager"
import TiledJSONClass from "./TiledJSONClass"
import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import ChunkMap from "./ChunkMap"
import TileLayer from "./TileLayer"


/** Chunk that represents a small part of the map that can be loaded and unloaded (this can be thought of as a chunk of a old tilemap) */
export class Chunk extends Schema{
    private tiledJSON: TiledJSON
    @type('number') chunkId: number
    @type('number') chunkHeight: number
    @type('number') chunkWidth: number
    @type('number') tileHeight: number
    @type('number') tileWidth: number
    /** relative x position  */
    @type('number') startX: number = 0
    @type('number') endX: number = 0
    @type('number') startY: number = 0
    @type('number') endY: number = 0
    /** Actual x position of the top left of the chunk in the game */
    @type('number') positionX: number = 0
    /** Actual y position of the top left of the chunk in the game */
    @type('number') positionY: number = 0
    /** Stores the chunk tile information */
    @type({map: TileLayer}) tileLayerMap = new MapSchema<TileLayer>()
    private mapManager: MapManager
    private obstacles: InvisObstacle[]

    constructor(mapManager: MapManager, chunkMap: ChunkMap, chunkId: number){
        super()
        this.mapManager = mapManager
        this.tiledJSON = chunkMap.getTiledJSON()
        this.chunkId = chunkId
        this.obstacles = []
        let chunkData = mapManager.getChunksData()
        this.chunkHeight = chunkData.chunkHeight
        this.chunkWidth = chunkData.chunkWidth
        this.tileHeight = chunkData.tileHeight
        this.tileWidth = chunkData.tileWidth
        this.initChunkStartAndEnd()
        this.initChunkPosition()
    }

    public loadChunk(){
        // Loads obstacles of the chunk
        this.addObstaclesToMatterAlgo()
        this.tiledJSON.layers.forEach(layer=>{
            // console.log(`layer name: ${layer.name}`)
            if(this.mapManager.getLayerNamesWithTiles().has(layer.name)) {
                // console.log(`has layer name: ${layer.name}`)

                this.tileLayerMap.set(layer.name, new TileLayer(layer, this))
            }
        })
        // console.log(`Chunk ${this.chunkId} was loaded on server`)
    }

    public unloadChunk(){
        // TODO remove obstacles here
        this.obstacles.forEach(obstacle=>{
        })
        this.tileLayerMap.forEach(tileLayer=>tileLayer.clearTileIds())
        // console.log(`Chunk ${this.chunkId} was unloaded on server`)
    }

    public resetChunk(){
    }

    /** Initializes where the chunk starts and ends based on the chunk id and the tiledJSON */
    private initChunkStartAndEnd(){
        let {startX, endX, startY, endY} = this.mapManager.getChunkStartAndEnd(this.chunkId)
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
    }

    /** Initializes the chunk start position, this is the actual pixel position in game.
     * 
     * Note initChunkStartAndEnd must be called before this.
     */
    private initChunkPosition(){
        this.positionX = this.startX * this.tileWidth
        this.positionY = this.startY * this.tileHeight
    }

    private getStartAndEnd(){
        return {startX: this.startX, endX: this.endX, startY: this.startY, endY: this.endY}
    }

    /**
     * Registers the obstacle layer to the matter engine for collision. This method 
     * will reduce the number of matter bodies that is used by the obstacle tiles.
     * @param engine The matter engine.
     * @param matterBodies The matterBodies array to add the matter body of the tile to.
     * @param tilemap The tilemap that contains the objectlayer.
     */
    private addObstaclesToMatterAlgo() {
        // Grab obstacle layer data
        let obstacleLayer = this.tiledJSON.layers.find(layer=>layer.name==="Obstacle")
        if(!obstacleLayer) return
        let tileIds = obstacleLayer.data

        // Calculate chunk info
        let gameManager = this.mapManager.getGameManager()
        let {chunkHeight, chunkWidth, tileHeight, tileWidth} = this.mapManager.getChunksData()
        let {startX, endX, startY, endY} = this.getStartAndEnd()

        // Create a grid of numbers where 1's will
        let grid: number[][] = [];
        for(let i = 0; i < chunkHeight; i++)
            grid[i] = [];
        
        for(let y = startY; y < endY; y++) {
            for(let x = startX; x < endX; x++) {
                let tileId = tileIds[x % obstacleLayer.width + y * obstacleLayer.height]
                if(tileId && tileId !== 0 && this.mapManager.inBounds(x, y)) grid[y-startY][x-startX] = 1;
                else grid[y-startY][x-startX] = 0;
            }
        }

        // Calculate the rectanges that will cover the obstacle layer.
        let rects = DungeonManager.getRectangleMapping(grid);

        // Create InvisObstacles based on the rects and add them to the gameManager.
        rects.forEach((rect) => {
            let x = (rect.x + startX) * tileWidth;
            let y = (rect.y + startY) * tileHeight;
            let width = rect.width * tileWidth;
            let height = rect.height * tileHeight;
            x += width / 2;
            y += height / 2;
            let invisObstacle = new InvisObstacle(gameManager, x, y, width, height);
            let body = Matter.Bodies.rectangle(x, y, width, height, {
                isStatic: true,
                friction: 0,
            });
            body.collisionFilter = {
                group: 0,
                category: Categories.OBSTACLE,
                mask: MaskManager.getManager().getMask('OBSTACLE') 
            };
            gameManager.addGameObject(invisObstacle.id, invisObstacle, body);
            this.obstacles.push(invisObstacle)
        })
    }

    public getMapManager(){
        return this.mapManager
    }
}
