import { Schema, type, MapSchema } from '@colyseus/schema';
import Layer from './Layer';
import Tile from '../gameobjs/Tile';

export default class Tilemap extends Schema {
    @type({map: Layer}) layers = new MapSchema<Layer>();
    @type(Layer) currentLayer: Layer | null = null;
    @type("number") width: number;
    @type("number") height: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;

    constructor(width:number,height:number,tileWidth:number,tileHeight:number) {
        super();
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
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