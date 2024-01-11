import Matter from "matter-js"
import Monster from "../../schemas/gameobjs/monsters/Monster"
import MonsterFactory from "../../schemas/gameobjs/monsters/MonsterFactory"
import GameManager from "../GameManager"
import { Categories } from "../Collisions/Category"
import MaskManager from "../Collisions/MaskManager"
import Dungeon, { SpawnPoint } from "../../schemas/dungeon/Dungeon"
import Wave from "../../schemas/dungeon/wave/Wave"
import DungeonEvent from "../../schemas/dungeon/DungeonEvent"
import AIFactory from "../AI/AIFactory"
import FileUtil from "../../../../util/FileUtil"
import { AABB, IDungeon, IDungeonWave, TiledJSON, Vector2 } from "../interfaces"
import Tilemap from "../../schemas/dungeon/tilemap/Tilemap"
import Layer from "../../schemas/dungeon/tilemap/Layer"
import MathUtil from "../../../../util/MathUtil"
import MonsterPool from "../../schemas/gameobjs/monsters/MonsterPool"
import TinyZombie from "../../schemas/gameobjs/monsters/zombie/TinyZombie"
import InvisObstacle from "../../schemas/gameobjs/InvisObstacle"
import DatabaseManager from "../Database/DatabaseManager"
import Entity from "../../schemas/gameobjs/Entity"
import SafeWave from "../../schemas/dungeon/wave/SafeWave"
import TutorialDungeon from "../../schemas/dungeon/TutorialDungeon"
import City from "../../schemas/dungeon/City"
import TpEvent from "../../schemas/gameobjs/event/TpEvent"
import DialogEvent from "../../schemas/gameobjs/event/DialogEvent"

// const dungeonURLMap = {
//     "Demo Map": "assets/tilemaps/demo_map/demo_map.json",
//     "Dirt Map": "assets/tilemaps/dirt_map/dirt_map.json"
// }

interface Rect {
    x: number,
    y: number,
    width: number,
    height: number,
}

// The dungeon manager will be responsible for holding the dungeon.
// The dungeon object will contain the tilemap.
// Merge the tilemap manager into the dungeon manager.
export default class DungeonManager {
    private gameManager: GameManager;
    private dungeon?: Dungeon;

    // Stores reusable Monster objects.
    private monsterPool: MonsterPool;

    // Monster constructors
    static ctors = {
        "TinyZombie": TinyZombie,
    }

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.monsterPool = new MonsterPool();
        this.createDungeon();
    }   

    /**
     * Updates this DungeonManager.
     * @param deltaT The time that passed in seconds.
     */
    public update(deltaT: number){
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Monster){
                // console.log(`Active:${gameObject.active}, x:${gameObject.x}, y:${gameObject.y}, `);\
                // if(gameObject.name === "Berserker Boss")console.log(gameObject.name, gameObject.active)
                if(gameObject.active) {
                    gameObject.update(deltaT);
                } else if(!gameObject.isInPoolMap()) {
                    gameObject.disableCollisions();
                    this.monsterPool.returnInstance(gameObject.poolType, gameObject);
                }
            }
        })

        this.dungeon?.update(deltaT);

        // SPAM THE WAVES!!!
        if(this.dungeon && this.dungeon.hasNextWave()) {
            this.dungeon.startNextWave();
        }

        // Check if the dungeon is over. every 30 tick.
        if(this.gameManager.state.serverTickCount % 30 === 29 &&
            this.dungeon && this.dungeon.isConquered()) {
            this.gameManager.endGame();
        }

        // Check for out of bounds monsters every 30 tick
        if(this.gameManager.state.serverTickCount % 30 === 0) {
            this.handleOutOfBoundsMonsters();
        }
    }

    /**
     * Checks if there are any more monsters that are alive on the map.
     * @returns True if there are active monsters. False otherwise.
     */
    public checkActiveMonsters() {
        let activeMonsters = false;
        // Check if the are any more active monsters.
        this.gameManager.gameObjects.forEach((obj) => {
            if(obj instanceof Monster) {
                if(obj.isActive()) {
                    activeMonsters = true;
                }
            }
        });
        return activeMonsters;
    }
    
    /** Kill all outof bounds monsters. */
    private handleOutOfBoundsMonsters() {
        let playerBounds = this.dungeon?.getPlayerBounds();
        if(playerBounds) {
            let width = playerBounds.maxX - playerBounds.minX;
            let height = playerBounds.maxY - playerBounds.minY;
            let bounds = Matter.Bodies.rectangle(playerBounds.minX + width / 2, playerBounds.minY + height / 2, width, height, {isStatic: true, isSensor: true});
            this.gameManager.gameObjects.forEach((obj) => {
                if(obj instanceof Monster && Matter.Collision.collides(bounds, obj.getBody(), Matter.Pairs.create({})) === null) {
                    obj.stat.hp = 0;
                }
            })
        }
    }

    private cleanUpMonsters() {

    }

    /** Creates a new Dungeon. The Dungeon will have an update method that should be called every frame. */
    private createDungeon() {
        // let dungeonName = "Demo Map";
        // let dungeonFileLocation = dungeonURLMap["Demo Map"];
        let dungeonData = DatabaseManager.getManager().getDungeonByName(this.gameManager.getOptions().dungeonSelected);
        let dungeonFileLocation = dungeonData.serverJsonLocation;
        let dungeonName = dungeonData.name;

        // if(dungeonName === "City") return;

        // Load the tiled json file ... 
        FileUtil.readJSONAsync(dungeonFileLocation).then((tiled: TiledJSON) => {
            // ----- Fill in the dungeons information based on the json file ------
            let newDungeon: Dungeon;
            if(dungeonName === "Tutorial Dungeon") {
                newDungeon = new TutorialDungeon(this.gameManager, dungeonName);
            } else if(dungeonName === "City") {
                let newCity = new City(this.gameManager);
                newDungeon = newCity; //A city is coded as a subclass of Dungeon.

                this.setCityTpZones(newCity, tiled);

                this.addTpZonesToGame(newCity);

                this.addDialogEvents(newCity, tiled);
            } else {
                newDungeon = new Dungeon(this.gameManager, dungeonName);
            }
            // Tilemap 
            let newTilemap = this.createTilemap(tiled, dungeonData);
            newDungeon.setTilemap(newTilemap);

            // Set spawnpoints 
            this.setDungeonSpawnPoints(newDungeon, tiled);

            // Set world bounds
            this.setDungeonWorldBounds(newDungeon, tiled);

            // Make the obstables collidable by adding them to matter.
            this.addObstaclesToMatterAlgo(newTilemap);

            // Load wave from dungeon data.
            this.createWavesFromData(newDungeon, dungeonData);

            // Sets assetList.
            this.populateAssetSet(dungeonData);

            // ---- Setting new dungeon to state -----
            this.dungeon = newDungeon;
            this.gameManager.state.dungeon = this.dungeon;
        }).catch((err) => {
            console.log(err);
        })
    }

    public createNewWave() {
        return new Wave((name: string) => {
            this.spawnMonster(name);
        });
    }

    public populateAssetSet(dungeonData: IDungeon) {
        let assetSet = this.gameManager.getAssetSet();
        // populate assetSet from dungeonData.
        dungeonData.waves.forEach(wave => {
            wave.monsters.forEach(monster => {
                try {
                    let monsterData = DatabaseManager.getManager().getMonsterByName(monster.name);
                    assetSet.add(monsterData.imageKey);
                } catch(e) {
                    console.log(e);
                }
            }) 
        })
    }

    public createWavesFromData(dungeon: Dungeon, dungeonData: IDungeon) {
        dungeonData.waves.forEach((waveData) => {
            let waveType = waveData.type; // TODO: Create wave types.
            let wave: Wave

            switch(waveType){
                case "safe":
                    wave = this.createSafeWave(waveData)
                    break;
                default:
                    wave = this.createPackWave(waveData)
                    break;
            }
            
            dungeon.addWave(wave);
        })
    }

    public createPackWave(waveData: IDungeonWave){
        let wave = new Wave((name: string) => {
            this.spawnMonster(name);
        })
        wave.setAgressionLevel(waveData.difficulty);
        waveData.monsters.forEach((monsterData) => {
            wave.addMonster(monsterData.name, monsterData.count);
        })
        return wave
    }

    public createSafeWave(waveData: IDungeonWave){
        let wave = new SafeWave(this.gameManager, {
            forgeSpawnPosition: {x: 113, y: 111},
            waveDuration: waveData.duration
        })
        return wave
    }

    public spawnMonster(monsterName: string, spawnPoint?: SpawnPoint | null): Monster | null {
        
        let monster: Monster;// = MonsterFactory.createMonster(monsterName);
        let poolType = monsterName;
        try {
            let monsterConfig = DatabaseManager.getManager().getMonsterByName(monsterName);
            //monster.setController(AIFactory.createSimpleAI(monster, this.gameManager.getPlayerManager()));

            // Create the pool if it doesn't exist
            if(!this.monsterPool.containsType(poolType)) {
                this.monsterPool.addPoolType(poolType);
            }
            

            // If the pool contains at least 1 instance
            let pool = this.monsterPool.getPool(poolType);
            if(pool && pool.length() > 0) {
                // reuse instance.
                monster = this.monsterPool.getInstance(poolType);
                monster.reset();
            } else {
                // Create a new monster.
                // monster = MonsterFactory.createMonster(this.gameManager, monsterName);
                monster = MonsterFactory.createMonsterFromConfig(this.gameManager, monsterConfig);
                // monster.setController(AIFactory.createSimpleAI(monster, this.gameManager.getPlayerManager()));
                this.gameManager.addGameObject(monster.getId(), monster, monster.getBody());
            }
            
            // let width = 12;
            // let height = 18;
            
            // monster.width = width;
            // monster.height = height;

            let randomSpawnPoint = spawnPoint;
            if(this.dungeon !== undefined && !randomSpawnPoint){
                randomSpawnPoint = this.dungeon.getRandomMonsterSpawnPoint();

            }
            let spawnX = 200;
            let spawnY = 200;
            if(randomSpawnPoint !== null && randomSpawnPoint !== undefined) {
                spawnX = randomSpawnPoint.x + Math.floor((Math.random() * 10) - 5);
                spawnY = randomSpawnPoint.y + Math.floor((Math.random() * 10) - 5);
            }

            Matter.Body.setPosition(monster.getBody(), {x: spawnX, y: spawnY});
            monster.x = spawnX;
            monster.y = spawnY;
            
            return monster;
        } catch(e) {
            console.log(e);
        }
        return null;
    }

    public despawnMonster() {

    }

    public getTotalMonstersSpawned() {

    }

    public getPlayerSpawnPoint(): SpawnPoint | null {
        if(this.dungeon === undefined) return null;
        if(this.dungeon.getPlayerSpawnPoints().length === 0) return null;
        return this.dungeon.getPlayerSpawnPoints().at(0);
    }

    /** Gets the MonsterPool. The MonsterPool is used to reuse Monster objects. */
    public getMonsterPool() {
        return this.monsterPool;
    }

    /**
     * Sets the spawn points for the given dungeon. Spawnpoints can be added with Tiled. To add create a point 
     * inside the objectlayer called 'SpawnPoints'. Then give it a type of either 'player' or 'monster'
     * @param dungeon The dungeon.
     * @param data The Tiled tilemap jsonfile.
     */
    private setDungeonSpawnPoints(dungeon: Dungeon, data: TiledJSON) {
        data.layers.forEach((value) => {
            if(value.type === "objectgroup" && value.name === "SpawnPoints") {
                value.objects.forEach((spawnPoint) => {
                    if(spawnPoint.type === "player") {
                        dungeon.addPlayerSpawnPoint(spawnPoint.x, spawnPoint.y);
                    } else if(spawnPoint.type === "monster") {
                        dungeon.addMonsterSpawnPoint(spawnPoint.x, spawnPoint.y);
                    }
                })
            }
        });
    }

    /**
     * Sets the world bounds for the dungeon. There is a world bound for the player typed 'playerbounds'.
     * @param dungeon The dungeon.
     * @param data The Tiled tilemap jsonfile.
     */
    private setDungeonWorldBounds(dungeon: Dungeon, data: TiledJSON) {
        data.layers.forEach((value) => {
            if(value.type === "objectgroup" && value.name === "WorldBounds") {
                value.objects.forEach((bounds) => {
                    if(bounds.type === "playerbounds") {
                        dungeon.addPlayerWorldBounds(bounds.x, bounds.y, bounds.width, bounds.height);
                    }
                })
            }
        });
    }

    /**
     * Create and return a Tilemap based on a TiledJSON object.
     * @param data A TiledJSON object.
     * @returns A Tilemap.
     */
    private createTilemap(data: TiledJSON, dungeon: IDungeon) {
        let tileWidth = data.tilewidth;
        let tileHeight = data.tileheight;
        let layers = data.layers;
        // Create tilemap
        let tilemap = new Tilemap(data.width, data.height, tileWidth, tileHeight,
             dungeon.tilesetName, dungeon.clientTilesetLocation);
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
     * Registers the obstacle layer to the matter engine for collision. 
     * @param engine The matter engine.
     * @param matterBodies The matterBodies array to add the matter body of the tile to.
     * @param tilemap The tilemap that contains the objectlayer.
     */
    private addObstaclesToMatter(engine:Matter.Engine, matterBodies:Map<string, Matter.Body>, tilemap: Tilemap) {
        let obstacleLayer = tilemap.layers.get("Obstacle");
        if(obstacleLayer) {
            let width = obstacleLayer.width;
            let height = obstacleLayer.height;
            let tileWidth = tilemap.tileWidth;
            let tileHeight = tilemap.tileHeight;

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
                                friction: 0,
                            });

                            body.collisionFilter = {
                                group: 0,
                                category: Categories.OBSTACLE,
                                mask: MaskManager.getManager().getMask('OBSTACLE') 
                            };
                            
                            // matterBodies.set(uid, body);
                            // Matter.Composite.add(engine.world, body);
                            this.gameManager.addGameObject(uid, tile, body);
                        }
                    }
                }
            } else {
                console.log("Error: tileWidth and tileHeight is not defined");
            }
        }
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

    /**
     * Given a grid of 1's and 0's, return a list of rectangles that fills up all the 1's 
     * on the grid. This list should be made as small as possible.
     * @param grid The grid of 1's and 0's
     * @returns a list of Rect objects.
     */
    public static getRectangleMapping(grid: number[][]): Rect[] {
        let rects: Rect[] = [];
        let maxWidth = grid[0].length;
        let maxHeight = grid.length;
        
        for(let y = 0; y < grid.length; y++) {
            for(let x = 0; x < grid[0].length; x++) {

                // Search for the next 1.
                if(grid[y][x] === 1) {
                    let rect = {x: x, y: y, width: 1, height: 1};
                    let expandedRight = false;
                    let expandedBottom = false;
                    do {
                        expandedRight = false;
                        expandedBottom = false;
                        // Try to expand the rectangle to the right.
                        if(x + rect.width < maxWidth) {
                            let col = x + rect.width;
                            let count = rect.height;
                            for(let idx = y; idx < grid.length; idx++) {
                                if(grid[idx][col] === 1 && count !== 0) count--;
                                else idx = grid.length;
                            }
                            if(count <= 0) {
                                // expand right.
                                expandedRight = true;
                                rect.width++;
                            } 
                        }
                        // Try to expand the rectangle downwards.
                        if(!expandedRight && y + rect.height < maxHeight) {
                            let row = y + rect.height;
                            let count = rect.width;
                            // Check if it is possible to expand the rectangle downwards.
                            for(let idx = x; idx < grid[row].length; idx++) {
                                if(grid[row][idx] === 1 && count !== 0) count --;
                                else idx = grid[row].length;
                            }
                            if(count <= 0) {
                                // It is possible to expand the rect downwards.
                                expandedBottom = true;
                                rect.height++;
                            }
                        }
                    } while(expandedRight || expandedBottom);
                    // zero out the region of the rectangle.
                    for(let rx = rect.x; rx < rect.x + rect.width; rx++) {
                        for(let ry = rect.y; ry < rect.y + rect.height; ry++) {
                            grid[ry][rx] = 0;
                        }
                    }

                    rects.push(rect);
                }

            }
        }

        return rects;
    }

    /**
     * Gets the current dungeon. 
     * The dungeon contains the tilemaps, spawnpoints, world bounds, and wave spawning.
     * @returns The current dungeon.
     */
    public getDungeon() {
        return this.dungeon;
    }

    /**
     * Gets all the monsters that are active.
     * @returns A monster array.
     */
    public getAllActiveMonsters() {
        let monsters: Monster[] = [];
        this.gameManager.gameObjects.forEach((obj) => {
            if(obj instanceof Monster && obj.active) monsters.push(obj);
        })
        return monsters;
    }

    /**
     * Aggro all the active monsters to the provided aggroTarget.
     * @param aggroTarget - The target that the monsters will attack.
     */
    public aggroAllMonstersOnto(aggroTarget: Entity) {
        this.gameManager.gameObjects.forEach((obj) => {
            if(obj instanceof Monster && obj.active) {
                obj.setAggroTarget(aggroTarget);
            } 
        })
    }

    private setCityTpZones(city: City, data: TiledJSON) {
        let tpZones = city.getTpZones();
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

    private addTpZonesToGame(city: City) {
        let tpZones = city.getTpZones();
        tpZones.forEach((tpZone) => {
            let tpEvent = new TpEvent(this.gameManager, tpZone);
            this.gameManager.addGameObject(tpEvent.id, tpEvent, tpEvent.getBody());
            console.log(tpEvent.getBody().bounds);
        })
    }

    private addDialogEvents(city: City, data: TiledJSON) {
        data.layers.forEach((layer) => {
            if(layer.type === "objectgroup" && layer.name === "Events") {
                layer.objects.forEach((event) => { 
                    if(event.type === "dialog") {
                        console.log(event);
                        let text = "";
                        let bounds: AABB = {
                            x: event.x + event.width / 2,
                            y: event.y + event.height / 2,
                            width: event.width,
                            height: event.height,
                        }
                        event.properties.forEach((property) => {
                            if(property.name === "text") {
                                text = property.value;
                            }
                        });
                        // Create DialogEvent.
                        let dialogEvent = new DialogEvent(this.gameManager, event.name, {
                            dialogItems: [
                                {
                                    text: text,
                                }
                            ]
                        }, bounds);
                        this.gameManager.addGameObject(dialogEvent.id, dialogEvent, dialogEvent.getBody());
                    }
                });
            }
        });
    }
}