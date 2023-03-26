import FileUtil from "../../../../util/FileUtil";
import Tilemap from "../../schemas/tilemap/Tilemap";

export default class TilemapManager {
    private tilemap: Tilemap;

    constructor(tilemap: Tilemap) {
        this.tilemap = tilemap;
    }

    /**
     * Loads tiled json file and update the tilemap.
     * @param fileName The location of the tilemap json from Tiled.
     */
    public loadTilemapTiled(fileName: string) {
        FileUtil.readJSONAsync("assets/tilemaps/demo_map/demo_map.json")
        .then((data) => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
    }
}