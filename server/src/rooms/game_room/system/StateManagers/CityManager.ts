import Matter from "matter-js";
import FileUtil from "../../../../util/FileUtil";
import City from "../../schemas/dungeon/City";
import Layer from "../../schemas/dungeon/tilemap/Layer";
import Tilemap from "../../schemas/dungeon/tilemap/Tilemap";
import InvisObstacle from "../../schemas/gameobjs/InvisObstacle";
import GameManager from "../GameManager";
import { AABB, TiledJSON, Vector2 } from "../interfaces";
import DungeonManager from "./DungeonManager";
import { Categories } from "../Collisions/Category";
import MaskManager from "../Collisions/MaskManager";

/** NOT IN USE, SEE DUNGEON MANAGER INSTEAD. */
export default class CityManager {
    private city!: City;
    private gameManager: GameManager;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

    public createCity() {
        // let dungeonData = DatabaseManager.getManager().getDungeonByName(this.gameManager.getOptions().dungeonSelected);
        // let dungeonFileLocation = dungeonData.serverJsonLocation;
        // let dungeonName = dungeonData.name;

        // Load the tiled json file ... 
        FileUtil.readJSONAsync("assets/tilemaps/city_map/city_tilemap.json").then((tiled: TiledJSON) => {
            // Create the city with the city_tilemap.json file.
            this.city = new City(this.gameManager);
            // Tilemap 
            let newTilemap = this.createTilemap(tiled);
            this.city.setTilemap(newTilemap);

            // Set spawnpoints 
            // this.setDungeonSpawnPoints(newDungeon, tiled);

            // Set world bounds
            // this.setDungeonWorldBounds(newDungeon, tiled);

            // Set tpZones
            this.setCityTpZones(tiled);

            console.log(this.city.getTpZones());

            // Make the obstables collidable by adding them to matter.
            this.addObstaclesToMatterAlgo(newTilemap);

            // Sets assetList.
            // this.populateAssetSet(dungeonData);

            // ---- Setting new city to state -----
            this.gameManager.state.city = this.city;
        }).catch((err) => {
            console.log(err);
        })
    }


    private setCityTpZones(data: TiledJSON) {
        let tpZones = this.city.getTpZones();
        data.layers.forEach((value) => {
            if(value.type === "objectgroup" && value.name === "Events") {
                value.objects.forEach((tpObject) => {
                    if(tpObject.type === "tp_start" || tpObject.type === "tp_end") {
                        // Get the tp_id.
                        let id: number = -1;
                        tpObject.properties.forEach((property) => {
                            if(property.name === "tp_id") {
                                id = property.value;
                            }
                        })
                        if(id !== -1) {
                            let tpEnd: Vector2 = {x: 0, y: 0};
                            let tpStart: AABB = {x: 0, y: 0, width: 1, height: 1};
                            if(tpObject.type === "tp_start") {
                                tpStart.x = tpObject.x + tpObject.width / 2;
                                tpStart.y = tpObject.y + tpObject.height / 2;
                                tpStart.width = tpObject.width;
                                tpStart.height = tpObject.height;
                            }
                            else if(tpObject.type === "tp_end") {
                                tpEnd.x = tpObject.x;
                                tpEnd.y = tpObject.y;
                            }

                            if(tpZones[id] === undefined) {
                                tpZones[id] = {
                                    tp_end: tpEnd,
                                    tp_start: tpStart,
                                    tp_id: id,
                                }
                            } else {
                                if(tpObject.type === "tp_end") {
                                    tpZones[id].tp_end = tpEnd;
                                } else if(tpObject.type === "tp_start") {
                                    tpZones[id].tp_start = tpStart;
                                }
                            }
                        }
                    }
                })
            }
        });
    }

    /**
     * Create and return a city Tilemap based on a TiledJSON object.
     * @returns A Tilemap.
     */
    private createTilemap(data: TiledJSON) {
        let tileWidth = data.tilewidth;
        let tileHeight = data.tileheight;
        let layers = data.layers;
        // Create tilemap
        let tilemap = new Tilemap(data.width, data.height, tileWidth, tileHeight,
             "city_tileset", "tilemaps/city_map/city_tileset_extruded.png");
        layers.forEach((layer) => {
            let width = layer.width;
            let height = layer.height;
            let layerName = layer.name;
            let layerType = layer.type;
            //Create tilemap layers
            if(layerType === "tilelayer") {
                let newLayer = new Layer(layerName, width, height, tileWidth, tileHeight);
                newLayer.populateTiles(this.gameManager, tileWidth, tileHeight, layer.data);
                tilemap.addExistingLayer(newLayer);
            }
        })

        return tilemap;
    }

    /**
     * Registers the obstacle layer to the matter engine for collision. This method 
     * will reduce the number of matter bodies that is used by the obstacle tiles.
     * @param engine The matter engine.
     * @param matterBodies The matterBodies array to add the matter body of the tile to.
     * @param tilemap The tilemap that contains the objectlayer.
     */
    private addObstaclesToMatterAlgo(tilemap: Tilemap) {
        let obstacleLayer = tilemap.layers.get("Obstacle");
        if(obstacleLayer) {
            let tileWidth = tilemap.tileWidth;
            let tileHeight = tilemap.tileHeight; 

            // Create a grid of numbers where 1's will
            let grid: number[][] = [];
            for(let i = 0; i < tilemap.height; i++)
                grid[i] = [];
            
            for(let y = 0; y < tilemap.height; y++) {
                for(let x = 0; x < tilemap.width; x++) {
                    let tile = obstacleLayer.getTileAt(x, y);
                    if(tile && tile.tileId !== 0) grid[y][x] = 1;
                    else grid[y][x] = 0;
                }
            }

            // Calculate the rectanges that will cover the obstacle layer.
            let rects = DungeonManager.getRectangleMapping(grid);

            // Create InvisObstacles based on the rects and add them to the gameManager.
            rects.forEach((rect) => {
                let x = rect.x * tileWidth;
                let y = rect.y * tileHeight;
                let width = rect.width * tileWidth;
                let height = rect.height * tileHeight;
                x += width / 2;
                y += height / 2;
                let invisObstacle = new InvisObstacle(this.gameManager, x, y, width, height);
                let body = Matter.Bodies.rectangle(x, y, width, height, {
                    isStatic: true,
                    friction: 0,
                });
                body.collisionFilter = {
                    group: 0,
                    category: Categories.OBSTACLE,
                    mask: MaskManager.getManager().getMask('OBSTACLE') 
                };
                this.gameManager.addGameObject(invisObstacle.id, invisObstacle, body);
            })
        }
    }
}
