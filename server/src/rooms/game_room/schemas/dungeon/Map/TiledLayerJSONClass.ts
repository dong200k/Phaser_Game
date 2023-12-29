import { Schema, type, ArraySchema } from '@colyseus/schema';
import { TiledJSON, TiledLayerJSON } from '../../../system/interfaces';

/** Not going to be abled to send a huge layer since colyseus's array schema is going to run out of heap space and crash so not using this anymore */
export default class TiledLayerJSONClass extends Schema{
    @type('number') height: number
    @type('number') width: number
    // @type(['number']) tileIds = new ArraySchema<number>()
    @type('string') name: string


    constructor(tiledLayerJSON: TiledLayerJSON){
        super()
        this.height = tiledLayerJSON.height
        this.width = tiledLayerJSON.width
        this.name = tiledLayerJSON.name
    }
}   