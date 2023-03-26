import { Schema, type, MapSchema } from '@colyseus/schema';
import Layer from './Layer';
import Tile from './Tile';

export default class Tilemap extends Schema {
    @type({map: Layer})
    layers = new MapSchema<Layer>();
    @type(Layer) currentLayer: Layer | null = null;

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
        return null;
    }
}