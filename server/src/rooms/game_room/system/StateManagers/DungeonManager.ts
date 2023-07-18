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
import { TiledJSON } from "../interfaces"
import Tilemap from "../../schemas/dungeon/tilemap/Tilemap"
import Layer from "../../schemas/dungeon/tilemap/Layer"
import MathUtil from "../../../../util/MathUtil"
import MonsterPool from "../../schemas/gameobjs/monsters/MonsterPool"
import TinyZombie from "../../schemas/gameobjs/monsters/zombie/TinyZombie"

const dungeonURLMap = {
    "Demo Map": "assets/tilemaps/demo_map/demo_map.json",
    "Dirt Map": "assets/tilemaps/dirt_map/dirt_map.json"
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
                // console.log(`Active:${gameObject.active}, x:${gameObject.x}, y:${gameObject.y}, `);
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
        this.dungeon?.startNextWave();
    }

    private cleanUpMonsters() {

    }

    /** Creates a new Dungeon. The Dungeon will have an update method that should be called every frame. */
    private createDungeon() {
        let dungeonName = "Demo Map";
        let dungeonFileLocation = dungeonURLMap["Demo Map"];
        // Load the tiled json file ... 
        FileUtil.readJSONAsync(dungeonFileLocation).then((tiled: TiledJSON) => {
            // ----- Fill in the dungeons information based on the json file ------
            let newDungeon = new Dungeon(dungeonName);

            // Tilemap 
            let newTilemap = this.createTilemap(tiled);
            newDungeon.setTilemap(newTilemap);

            // Set spawnpoints 
            this.setDungeonSpawnPoints(newDungeon, tiled);

            // Make the obstables collidable by adding them to matter.
            this.addObstaclesToMatter(this.gameManager.getEngine(), this.gameManager.matterBodies, newTilemap);

            // Waves
            let wave = this.createNewWave();
            wave.setAgressionLevel(1);
            wave.addMonster("TinyZombie", 1);
            newDungeon.addWave(wave);

            let wave2 = this.createNewWave();
            wave2.setAgressionLevel(2);
            wave2.addMonster("TinyZombie", 20);
            newDungeon.addWave(wave2);

            // let wave3 = this.createNewWave();
            // wave3.setAgressionLevel(5);
            // wave3.addMonster("TinyZombie", 100);
            // newDungeon.addWave(wave3);

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

    public spawnMonster(monsterName: string): Monster {
        
        let monster: Monster;// = MonsterFactory.createMonster(monsterName);
        let poolType = monsterName;
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
            monster = MonsterFactory.createMonster(this.gameManager, monsterName);
            monster.setController(AIFactory.createSimpleAI(monster, this.gameManager.getPlayerManager()));
            this.gameManager.addGameObject(monster.getId(), monster, monster.getBody());
        }
        
        // let width = 12;
        // let height = 18;
        
        // monster.width = width;
        // monster.height = height;

        let randomSpawnPoint = null;
        if(this.dungeon !== undefined)
            randomSpawnPoint = this.dungeon.getRandomMonsterSpawnPoint();
        let spawnX = 200;
        let spawnY = 200;
        if(randomSpawnPoint !== null) {
            spawnX = randomSpawnPoint.x + Math.floor((Math.random() * 10) - 5);
            spawnY = randomSpawnPoint.y + Math.floor((Math.random() * 10) - 5);
        }

        Matter.Body.setPosition(monster.getBody(), {x: spawnX, y: spawnY});
        monster.x = spawnX;
        monster.y = spawnY;
        
        return monster;
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
     * Create and return a Tilemap based on a TiledJSON object.
     * @param data A TiledJSON object.
     * @returns A Tilemap.
     */
    private createTilemap(data: TiledJSON) {
        let tileWidth = data.tilewidth;
        let tileHeight = data.tileheight;
        let layers = data.layers;
        //Create tilemap
        let tilemap = new Tilemap(data.width, data.height, tileWidth, tileHeight);
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
}