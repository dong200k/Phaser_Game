import { Schema, type, ArraySchema } from '@colyseus/schema';
import { TiledJSON, TiledLayerJSON } from '../../../system/interfaces';

export default class TiledLayerJSONClass extends Schema{
    @type('number') height: number
    @type('number') width: number
    @type(['number']) tileIds = new ArraySchema<Number>()
    @type('string') name: string

    constructor(tiledLayerJSON: TiledLayerJSON){
        super()
        this.height = tiledLayerJSON.height
        this.width = tiledLayerJSON.width
        this.tileIds.concat(tiledLayerJSON.data)
        this.name = tiledLayerJSON.name
    }
}