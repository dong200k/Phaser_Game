import FileUtil from "../../../../util/FileUtil";
import State from "../../schemas/State";
import Layer from "../../schemas/tilemap/Layer";
import Tilemap from "../../schemas/tilemap/Tilemap";

export default class TilemapManager {
    private state: State;
    private tilemap: Tilemap|null = null;

    constructor(state:State) {
        this.state = state;
    }

    /**
     * Loads tiled json file and update the tilemap.
     * @param fileName The location of the tilemap json from Tiled relative to the root of the project.
     */
    public loadTilemapTiled(fileName: string) {
        FileUtil.readJSONAsync(fileName)
        .then((data) => {
            //Tilemap data has been loaded
            let tileWidth = data.tilewidth;
            let tileHeight = data.tileheight;
            let layers = data.layers;
            //Create tilemap
            this.state.tilemap = new Tilemap(data.width, data.height, tileWidth, tileHeight);
            this.tilemap = this.state.tilemap;
            layers.forEach((layer:any) => {
                let width = layer.width;
                let height = layer.height;
                let layerName = layer.name;
                //Create tilemap layers
                let newLayer = new Layer(layerName, width, height);
                newLayer.populateTiles(tileWidth, tileHeight, layer.data);
                this.tilemap?.addExistingLayer(newLayer);
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
}