import Matter from "matter-js"
import Monster from "../../schemas/gameobjs/monsters/Monster"
import MonsterFactory from "../../schemas/gameobjs/monsters/MonsterFactory"
import GameManager from "../GameManager"
import { Categories } from "../Collisions/Category"
import MaskManager from "../Collisions/MaskManager"
import Dungeon from "../../schemas/dungeon/Dungeon"
import Wave from "../../schemas/dungeon/Wave"
import DungeonEvent from "../../schemas/dungeon/DungeonEvent"
import MonsterController from "../AI/MonsterAI/simplemonster/MonsterController"

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

    update(deltaT: number){
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
        this.dungeon = new Dungeon();
        let wave = new Wave();
        wave.addMonsterId(["TinyZombie"]);
        this.dungeon.addWave(wave);
    }

    private initializeListeners() {
        DungeonEvent.getInstance().on("SPAWN_MONSTER", (monsterId) => {
            this.spawnMonster(monsterId);
        })
    }

    public spawnMonster(monsterName: string): Monster {
        let monster = MonsterFactory.createMonster("TinyZombie");
        monster.setController(new MonsterController({
            playerManager: this.gameManager.getPlayerManager(),
            monster: monster,
        }));
        let width = 12;
        let height = 18;
        let spawnX = 200;
        let spawnY = 200;

        let body = Matter.Bodies.rectangle(spawnX, spawnY, width, height, {
            isStatic: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        });

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