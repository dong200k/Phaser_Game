import { Chunk } from "../../../server/src/rooms/game_room/schemas/dungeon/Map/Chunk"
import TiledJSONClass from "../../../server/src/rooms/game_room/schemas/dungeon/Map/TiledJSONClass"

export default class TilemapManager{
    private maps: Map<number, Phaser.Tilemaps.Tilemap> = new Map()
    /** width in terms of tiles */
    private chunkWidth = 100
    /** height in terms of tiles */
    private chunkHeight = 100
    private tileWidth = 16
    private tileHeight = 16
    private tileSetName = ""
    private scene: Phaser.Scene

    constructor(scene: Phaser.Scene, tileSetName: string, tileWidth = 16, tileHeight = 16, chunkWidth = 30, chunkHeight = 30){
        this.tileHeight = tileHeight
        this.tileWidth = tileWidth
        this.chunkHeight = chunkHeight
        this.chunkWidth = chunkWidth
        this.tileSetName = tileSetName
        this.scene = scene
    }

    public loadNewChunk(id: number, chunk: Chunk){
        // console.log(`maps:`, this.maps)
        if(this.maps.has(id)) return
        // console.log(`attempting to load chunk ${id}`)

        let map = this.scene.add.tilemap("", this.tileWidth, this.tileHeight, this.chunkWidth, this.chunkHeight);
        // console.log(`tilewidth: ${this.tileWidth}, tileHeight: ${this.tileHeight}, chunkWidth: ${this.chunkWidth}, chunkHeight: ${this.chunkHeight}`)
        let tileset = map.addTilesetImage("tileset_image", this.tileSetName, this.tileWidth, this.tileHeight, 1, 2);
        // console.log(`tileset name: ${this.tileSetName}`)
        chunk.tileLayerMap.forEach((layer, chunkIdString)=>{
            let layerName = layer.name
            if(tileset){
                let mapLayer = map.createBlankLayer(layer.name, tileset, chunk.startX * this.tileWidth, chunk.startY * this.tileHeight)
                if(layerName === "Background")
                    mapLayer?.setDepth(-10);
                if(layerName === "Ground")
                    mapLayer?.setDepth(-5);
                if(layerName === "Obstacle")
                    mapLayer?.setDepth(10);
                let count = 0
                // console.log(`layer: ${layerName} tileIds:`,layer.tileIds)
                for(let i=0;i<chunk.chunkWidth;i++){
                    for(let j=0;j<chunk.chunkHeight;j++){
                        let tileId = layer.tileIds[i + chunk.chunkWidth * j]
                        // console.log(layer.tileIds)
                        if(tileId !== undefined && tileId !== 0) mapLayer?.putTileAt(tileId - 1, i, j)
                        // else if(tileId === undefined) count++
                        // if(tileId !== undefined && tileId ! == 0) mapLayer?.putTileAt(tileId - 1, i, j)
                        // else if(tileId === undefined) console.log("tile id is undefined")

                        // console.log(`putting tile ${tileId} at ${i + chunk.startX}, ${j+chunk.startY}`)
                        // console.log(`tileId: ${tileId}, chunk:${id}`)
                    }
                }
                // console.log(`layer: ${layerName} has ${count} undefined tiles`)
            }
        })
        this.maps.set(id, map)
    }
    
    public unloadChunk(id: number){
        // console.log(`unloading chunk ${id}`)
        let map = this.maps.get(id)
        if(map){
            map.destroy()
            this.maps.delete(id)
        }
    }
}