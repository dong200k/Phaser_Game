import { Schema, type, MapSchema } from '@colyseus/schema';
import Layer from './Layer';
import Tile from '../gameobjs/Tile';

export default class Tilemap extends Schema {
    @type({map: Layer})
    layers = new MapSchema<Layer>();
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
 
    public addExistingLayer(layer:Layer) {
        let layerName = layer.name;
        if(this.layers.has(layerName)) {
            console.log("Error: Duplicate layer name of ", layerName);
        } else {
            this.layers.set(layerName, layer);
        }
    }

    /** Get a tile at location */
    public getTileAt(tileX:number, tileY:number, layer:Layer|null=null):Tile|null {
        let searchLayer = this.currentLayer;
        if(layer != null)
            searchLayer = layer;
        if(searchLayer == null) 
            return null;
        // TODO: return correct tile.
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