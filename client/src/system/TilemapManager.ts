import Layer from "../../../server/src/rooms/game_room/schemas/dungeon/tilemap/Layer"

export default class TilemapManager{
    private map: Phaser.Tilemaps.Tilemap
    private backgroundLayer?: Phaser.Tilemaps.TilemapLayer | null
    private groundLayer?: Phaser.Tilemaps.TilemapLayer | null
    private obstacleLayer?: Phaser.Tilemaps.TilemapLayer | null
    /** width in terms of tiles */
    private width = 100
    /** height in terms of tiles */
    private height = 100
    private tileWidth = 16
    private tileHeight = 16

    constructor(scene: Phaser.Scene, tileSetName: string, tileWidth = 16, tileHeight = 16){
        this.tileHeight = tileHeight
        this.tileWidth = tileWidth
        this.map = scene.add.tilemap("", tileWidth, tileHeight, this.width, this.height);
        let tileset = this.map.addTilesetImage("tileset_image", tileSetName, tileWidth, tileHeight, 1, 2);
        if(tileset) {
            this.backgroundLayer = this.map.createBlankLayer("Background", tileset)
            this.groundLayer = this.map.createBlankLayer("Ground", tileset)
            this.obstacleLayer = this.map.createBlankLayer("Obstacle", tileset)
        }
    }

    updateMapWithLayers(layers: Layer[]){
        for(let layer of layers){
            this.updateLayer(layer)
        }
    }

    updateLayer(layer: Layer){
        let clientLayer
        switch(layer.name){
            case "Background": clientLayer = this.backgroundLayer; break;
            case "Ground": clientLayer = this.groundLayer; break;
            case "Obstacle": clientLayer = this.obstacleLayer; break;
        }
        if(!clientLayer) return

        for(let tile of layer.tiles){
            clientLayer.putTileAt(tile.tileId - 1, Math.floor(tile.x/this.tileWidth), Math.floor(tile.y/this.tileHeight))
        }
    }
}