import Matter from "matter-js"
import DungeonManager from "../../../system/StateManagers/DungeonManager"
import MapManager from "../../../system/StateManagers/MapManager"
import { TiledJSON } from "../../../system/interfaces"
import InvisObstacle from "../../gameobjs/InvisObstacle"
import { Categories } from "../../../system/Collisions/Category"
import MaskManager from "../../../system/Collisions/MaskManager"
import TiledJSONClass from "./TiledJSONClass"
import { Schema, type, MapSchema } from '@colyseus/schema';
import ChunkMap from "./ChunkMap"


/** Chunk that represents a small part of the map that can be loaded and unloaded (this can be thought of as a chunk of a old tilemap) */
export class Chunk extends Schema{
    private mapManager: MapManager
    private tiledJSON: TiledJSONClass
    private chunkId: number
    private obstacles: InvisObstacle[]
    private chunkHeight: number
    private chunkWidth: number
    private startX: number = 0
    private endX: number = 0
    private startY: number = 0
    private endY: number = 0

    constructor(mapManager: MapManager, chunkMap: ChunkMap, chunkId: number){
        super()
        this.mapManager = mapManager
        this.tiledJSON = chunkMap.tiledJSON
        this.chunkId = chunkId
        this.obstacles = []
        let chunkData = mapManager.getChunksData()
        this.chunkHeight = chunkData.chunkHeight
        this.chunkWidth = chunkData.chunkWidth
        this.initChunkStartAndEnd()
    }

    public loadChunk(){
        // Loads obstacles of the chunk
        this.addObstaclesToMatterAlgo()
    }

    public unloadChunk(){
        // TODO remove obstacles here
        this.obstacles.forEach(obstacle=>{
        })
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
        let tileIds = obstacleLayer.tileIds

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
                if(tileId && tileId !== 0) grid[y-startY][x-startX] = 1;
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
}
