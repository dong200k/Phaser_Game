import { Schema, type, ArraySchema } from '@colyseus/schema';
import { TiledJSON } from '../../../system/interfaces';
import TiledLayerJSONClass from './TiledLayerJSONClass';

/** DEPRECATED */
export default class TiledJSONClass extends Schema{
    @type('number') height: number
    @type('number') width: number
    @type([TiledLayerJSONClass]) layers = new ArraySchema<TiledLayerJSONClass>()

    constructor(tiledJSON: TiledJSON){
        super()
        this.height = tiledJSON.height
        this.width = tiledJSON.width
        for(let layer of tiledJSON.layers){
            this.layers.push(new TiledLayerJSONClass(layer))
        }
    }
}