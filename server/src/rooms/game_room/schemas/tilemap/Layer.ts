import { Schema, type, ArraySchema } from '@colyseus/schema';
import Tile from '../gameobjs/Tile';

export default class Layer extends Schema {
    @type("number") width: number;
    @type("number") height: number;
    @type("string") name: string;
    @type([Tile]) tiles = new ArraySchema<Tile>();

    constructor(name:string, width:number, height:number) {
        super();
        this.width = width;
        this.height = height;
        this.name = name;
    }

    public populateTiles(tileWidth: number, tileHeight: number, tileIdArray: number[]) {
        tileIdArray.forEach((tileId, idx) => {
            let x = (idx % this.width) * tileWidth + tileWidth/2;
            let y = Math.floor(idx / this.width) * tileHeight + tileHeight/2;
            this.tiles.push(new Tile(tileId, tileWidth, tileHeight, x, y));
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