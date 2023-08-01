import { Schema, type, ArraySchema } from '@colyseus/schema';
import Tile from '../../gameobjs/Tile';
import GameManager from '../../../system/GameManager';

export default class Layer extends Schema {
    @type("number") width: number;
    @type("number") height: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;
    @type("string") name: string;
    @type([Tile]) tiles = new ArraySchema<Tile>();

    constructor(name:string, width:number, height:number, tileWidth:number, tileHeight:number) {
        super();
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.name = name;
    }

    public populateTiles(gameManager: GameManager, tileWidth: number, tileHeight: number, tileIdArray: number[]) {
        tileIdArray.forEach((tileId, idx) => {
            let x = (idx % this.width) * tileWidth + tileWidth/2;
            let y = Math.floor(idx / this.width) * tileHeight + tileHeight/2;
            this.tiles.push(new Tile(gameManager, tileId, tileWidth, tileHeight, x, y));
        })
    }

    public getTileAt(tileX:number,tileY:number):Tile|null {
        if(tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) return null;
        return this.tiles[(tileY * this.width) + tileX];
    }

    public toString() {
        return `name: ${this.name}\nwidth: ${this.width}\nheight: ${this.height}`;
    }
}