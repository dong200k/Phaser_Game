import { Schema, type, MapSchema } from '@colyseus/schema';

export default class Tile extends Schema {
    /**The tile that is represented on the tilemap png */
    @type("number") tileId: number = 0;
}