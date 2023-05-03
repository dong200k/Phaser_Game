import Matter from "matter-js"
import Monster from "../../schemas/gameobjs/monsters/Monster"
import MonsterFactory from "../../schemas/gameobjs/monsters/MonsterFactory"
import GameManager from "../GameManager"
import { Categories } from "../Collisions/Category"
import MaskManager from "../Collisions/MaskManager"
import Dungeon from "../../schemas/dungeon/Dungeon"
import Wave from "../../schemas/dungeon/wave/Wave"
import DungeonEvent from "../../schemas/dungeon/DungeonEvent"
import AIFactory from "../AI/AIFactory"

const dungeonURLMap = {
    "Demo Map": "assets/tilemaps/demo_map/demo_map.json",
    "Dirt Map": "assets/tilemaps/dirt_map/dirt_map.json"
}

// The dungeon manager will be responsible for holding the dungeon.
// The dungeon object will contain the tilemap.
// Merge the tilemap manager into the dungeon manager.
export default class DungeonManager {
    //Spawn different monsters 
    //Reuse monsters
    private gameManager: GameManager;
    private dungeon!: Dungeon;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.createDungeon();
        this.initializeListeners();
    }   

    /**
     * Updates this DungeonManager.
     * @param deltaT The time that passed in seconds.
     */
    public update(deltaT: number){
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Monster){
                gameObject.update(deltaT);
            }
        })

        this.dungeon.update(deltaT);
    }

    /** Creates a new Dungeon. The Dungeon will have an update method that should be called every frame. */
    private createDungeon() {

        

        this.dungeon = new Dungeon("");
        let wave = new Wave();
        wave.addMonster("TinyZombie", 10);
        this.dungeon.addWave(wave);
    }

    private initializeListeners() {
        DungeonEvent.getInstance().on("SPAWN_MONSTER", (monsterId) => {
            this.spawnMonster(monsterId);
            // console.log("MONSTER SPAWNED!!!");
        })
    }

    public spawnMonster(monsterName: string): Monster {
        let monster = MonsterFactory.createMonster("TinyZombie");
        monster.setController(AIFactory.createSimpleAI(monster, this.gameManager.getPlayerManager()));
        let width = 12;
        let height = 18;
        let spawnX = 200;
        let spawnY = 200;

        let body = Matter.Bodies.rectangle(spawnX, spawnY, width, height, {isStatic: false});

        body.collisionFilter = {
            group: 0,
            category: Categories.MONSTER,
            mask: MaskManager.getMask('MONSTER'),
        }
        
        this.gameManager.addGameObject(monster.getId(), monster, body);
        return monster;
    }

    public despawnMonster() {

    }

    public getTotalMonstersSpawned() {

    }

}