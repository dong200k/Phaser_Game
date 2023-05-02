import FileUtil from "../../../../util/FileUtil";
import State from "../../schemas/State";
import Layer from "../../schemas/dungeon/tilemap/Layer";
import Tilemap from "../../schemas/dungeon/tilemap/Tilemap";
import Matter from "matter-js";
import MathUtil from "../../../../util/MathUtil";
import { Categories } from "../Collisions/Category";
import MaskManager from "../Collisions/MaskManager";

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
    public loadTilemapTiled(fileName: string):Promise<unknown> {
        let promise = new Promise((resolve, reject) => {
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
                    let newLayer = new Layer(layerName, width, height, tileWidth, tileHeight);
                    newLayer.populateTiles(tileWidth, tileHeight, layer.data);
                    this.tilemap?.addExistingLayer(newLayer);
                })
                resolve(null);
            })
            .catch(err => {
                console.log(err);
                reject();
            });
        })
        return promise;
    }

    public addObstaclesToMatter(engine:Matter.Engine, gameObjects:Map<string, Matter.Body>) {
        let obstacleLayer = this.tilemap?.layers.get("Obstacle");
        if(obstacleLayer) {
            let width = obstacleLayer.width;
            let height = obstacleLayer.height;
            let tileWidth = this.tilemap?.tileWidth;
            let tileHeight = this.tilemap?.tileHeight;

            if(tileWidth && tileHeight) {
                for(let y = 0; y < height; y++) {
                    for(let x = 0; x < width; x++) {
                        let tile = obstacleLayer.getTileAt(x, y);
                        if(tile && tile.tileId !== 0) {
                            let uid = MathUtil.uid();
                            // sync with server state
                            // this.state.gameObjects.set(uid, tile);
    
                            //Create matterjs body for obj
                            let body = Matter.Bodies.rectangle(tile.x, tile.y, tileWidth, tileHeight, {
                                isStatic: true,
                                inertia: Infinity,
                                inverseInertia: 0,
                                restitution: 0,
                                friction: 0,
                            });

                            body.collisionFilter = {
                                group: 0,
                                category: Categories.OBSTACLE,
                                mask: MaskManager.getMask('OBSTACLE') 
                            };
                            
                            gameObjects.set(uid, body);
    
                            Matter.Composite.add(engine.world, body);
                        }
                    }
                }
            } else {
                console.log("Error: tileWidth and tileHeight is not defined");
            }
            
        }
    }
}