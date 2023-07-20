import { Schema, type, MapSchema } from '@colyseus/schema';
import GameObject from './GameObject';
import GameManager from '../../system/GameManager';

export default class Tile extends GameObject {
    /**The tile that is represented on the tilemap png */
    @type("number") tileId: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;

    constructor(gameManager: GameManager, tildId:number, tileWidth:number, tileHeight:number, x:number, y:number) {
        super(gameManager, x, y);
        this.tileId = tildId;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = tileWidth;
        this.height = tileHeight;
        this.type = "Tile";
    }
}