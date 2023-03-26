import { Schema, type, MapSchema } from '@colyseus/schema';
import Layer from './Layer';

export default class Tilemap extends Schema {
    @type({map: Layer})
    layers = new MapSchema<Layer>();  

    public addExistingLayer(layer:Layer) {
        let layerName = layer.name;
        if(this.layers.has(layerName)) {
            console.log("Error: Duplicate layer name of ", layerName);
        } else {
            this.layers.set(layerName, layer);
        }
    }
}