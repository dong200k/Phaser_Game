import { Schema, type, MapSchema } from '@colyseus/schema';

export default class Tile extends Schema {
    /**The tile that is represented on the tilemap png */
    @type("number") tileId: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;

    constructor(tildId:number, tileWidth:number, tileHeight:number) {
        super();
        this.tileId = tildId;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
}