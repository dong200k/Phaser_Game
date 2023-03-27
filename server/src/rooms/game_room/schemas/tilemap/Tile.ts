import { Schema, type, MapSchema } from '@colyseus/schema';
import GameObject from '../gameobjs/GameObject';

export default class Tile extends GameObject {
    /**The tile that is represented on the tilemap png */
    @type("number") tileId: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;

    constructor(tildId:number, tileWidth:number, tileHeight:number, x:number, y:number) {
        super(x, y);
        this.tileId = tildId;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
}