import { Schema, type, MapSchema } from '@colyseus/schema';
import { Chunk } from './Chunk';
import TiledJSONClass from './TiledJSONClass';
import { TiledJSON } from '../../../system/interfaces';

/** This can be considered the new tile map. Instead of of having a bunch of tiles, larger chunks are used instead. The chunk map also holds the map TiledJSON, and also information about active chunks. */
export default class ChunkMap extends Schema {
    /** Map of active chunks ids and chunks that are loaded in the game */
    @type({map: Chunk}) activeChunks = new MapSchema<Chunk>();
    /** Information about the map, used by client to load the map and by the server to load obstacles to matter */
    @type(TiledJSONClass) tiledJSON: TiledJSONClass
    /** Number of tiles in the horizontal direction. */
    @type("number") width: number;
    /** Number of tiles in the vertical direction. */
    @type("number") height: number;
    @type("number") tileWidth: number;
    @type("number") tileHeight: number;

    @type("string") tileSetName: string;
    @type("string") clientTilesetLocation: string;

    /**
     * Creates a new Tilemap for a Dungeon. The tilemap will be sent 
     * to the client to build the tilemap.
     * @param tiledJSON json information about the map
     * @param chunkWidth The width in tiles of a chunk
     * @param chunkHeight The height in tiles of a chunk
     * @param width The width of the tilemap in tiles.
     * @param height The height of the tilemap in tiles. 
     * @param tileWidth The width of each tile in px.
     * @param tileHeight The height of each tile in px.
     * @param tilesetName The name of the tileset. Used as the tilesetKey on the client.
     * @param clientTilesetLocation The location of the tileset image file on the client.
     */
    constructor(tiledJSON: TiledJSON, width:number,height:number,tileWidth:number,tileHeight:number, 
        tilesetName: string, clientTilesetLocation:string) {
        super();
        this.tiledJSON = new TiledJSONClass(tiledJSON)
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileSetName = tilesetName;
        this.clientTilesetLocation = clientTilesetLocation;
    } 

    public toString() {
        let string = `Tilemap\nwidth: ${this.width}\nheight: ${this.height}\ntileWidth: ${this.tileWidth}\ntileHeight: ${this.tileHeight}`;
        // this.layers.forEach((layer) => {
        //     string += `\n\n\tLayer\n${layer.toString()}`;
        // })
        return string;
    }
}