import { Schema, type, MapSchema } from '@colyseus/schema';

export default class Tile extends Schema {
    @type("number") tileId: number = 0;
}