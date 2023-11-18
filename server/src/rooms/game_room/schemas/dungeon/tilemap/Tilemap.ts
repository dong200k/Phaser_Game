import { Schema, type, MapSchema } from '@colyseus/schema';
import Layer from './Layer';
import Tile from '../../gameobjs/Tile';

export default class Tilemap extends Schema {
    @type({map: Layer}) layers = new MapSchema<Layer>();
    @type(Layer) currentLayer: Layer | null = null;
    /** Number of tiles in the horizontal direction. */
    @type("number") width: number;
    /** Number of tiles in the vertical direction. */
    @type("number") height: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;

    @type("string") tileSetName: string;
    @type("string") clientTilesetLocation: string;

    /**
     * Creates a new Tilemap for a Dungeon. The tilemap will be sent 
     * to the client to build the tilemap.
     * @param width The width of the tilemap in tiles.
     * @param height The height of the tilemap in tiles. 
     * @param tileWidth The width of each tile in px.
     * @param tileHeight The height of each tile in px.
     * @param tilesetName The name of the tileset. Used as the tilesetKey on the client.
     * @param clientTilesetLocation The location of the tileset image file on the client.
     */
    constructor(width:number,height:number,tileWidth:number,tileHeight:number, 
        tilesetName: string, clientTilesetLocation:string) {
        super();
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileSetName = tilesetName;
        this.clientTilesetLocation = clientTilesetLocation;
    } 
 
    /**Adds an existing layer to the tilemap. This layer is set as the tilemap's currentLayer. */
    public addExistingLayer(layer:Layer) {
        let layerName = layer.name;
        if(this.layers.has(layerName)) {
            console.log("Error: Duplicate layer name of ", layerName);
        } else {
            this.layers.set(layerName, layer);
            this.currentLayer = layer;
        }
    }

    /**
     * Gets a tile from the tilemap.
     * @param tileX The tile's x postion.
     * @param tileY the tile's y postion.
     * @param layer The name of the layer to search. Otherwise the tilemap's currentLayer is used.
     * @returns A tile from the tilemap.
     */
    public getTileAt(tileX:number, tileY:number, layer:string=""):Tile|null {
        let searchLayer = this.currentLayer;
        let specifiedLayer = this.layers.get(layer);
        if(specifiedLayer)
            searchLayer = specifiedLayer;
        if(searchLayer == null) 
            return null;
        return searchLayer.getTileAt(tileX, tileY);
    }

    public toString() {
        let string = `Tilemap\nwidth: ${this.width}\nheight: ${this.height}\ntileWidth: ${this.tileWidth}\ntileHeight: ${this.tileHeight}`;
        this.layers.forEach((layer) => {
            string += `\n\n\tLayer\n${layer.toString()}`;
        })
        return string;
    }
}