import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { TiledJSON, TiledLayerJSON } from '../../../system/interfaces';
import { Chunk } from './Chunk';

/** Holds tileIds for one layer for one chunk */
export default class TileLayer extends Schema{
    @type(['number']) tileIds = new ArraySchema<number>()
    @type('string') name: string
    private tiledLayerJSON: TiledLayerJSON
    private chunk: Chunk
    /** width in tiles */
    @type('number') width: number
    /** height in tiles */
    @type('number') height: number

    constructor(tiledLayerJSON: TiledLayerJSON, chunk: Chunk){
        super()
        this.tiledLayerJSON = tiledLayerJSON
        this.chunk = chunk
        this.name = tiledLayerJSON.name
        this.width = tiledLayerJSON.width
        this.height = tiledLayerJSON.height
        this.initTiledIds()
    }

    /** Copies tileIds from TiledJSON based on Chunk dimensions */
    public initTiledIds(){
        // Load tileids
        let undefinedCount = 0
        let outOfBoundsCount = 0
        // console.log(`chunk ${this.chunk.chunkId}, startX: ${this.chunk.startX}, endX: ${this.chunk.endX}, startY: ${this.chunk.startY}, endY: ${this.chunk.endY}`)
        // console.log(`tiledlayer width: ${this.tiledLayerJSON.width}, tiledlayer height: ${this.tiledLayerJSON.height}`)
        // console.log(`tiledlayer data lenght: ${this.tiledLayerJSON.data.length}`)
        let mapManager = this.chunk.getMapManager()

        for(let y=this.chunk.startY;y<this.chunk.endY;y++){
            for(let x=this.chunk.startX;x<this.chunk.endX;x++){
                let tileId = this.tiledLayerJSON.data[x + y * this.tiledLayerJSON.width]
                // console.log(`x: ${x}, y:${y}, idx: ${x + y * this.tiledLayerJSON.width}, tiledId: ${tileId}`)

                if(tileId !== undefined && mapManager.inBounds(x, y)) this.tileIds.push(tileId)
                else if(tileId == undefined){
                    this.tileIds.push(0)
                    undefinedCount++
                }else{
                    this.tileIds.push(0)
                    outOfBoundsCount++
                }
            }
        }
        // console.log(`undefined tile count: ${undefinedCount}`)
        // console.log(`outofbounds tile count: ${outOfBoundsCount}`)

    }

    public clearTileIds(){
        this.tileIds.clear()
    }
}