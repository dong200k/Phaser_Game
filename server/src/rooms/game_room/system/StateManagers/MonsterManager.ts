import Matter from "matter-js"
import Monster from "../../schemas/gameobjs/monsters/Monster"
import MonsterFactory from "../../schemas/gameobjs/monsters/MonsterFactory"
import GameManager from "../GameManager"
import { Categories } from "../Collisions/Category"
import MaskManager from "../Collisions/MaskManager"

export default class MonsterManager {
    //Spawn different monsters 
    //Reuse monsters


    private gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    update(deltaT: number){
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Monster){
                gameObject.update(deltaT);
            }
        })
    }

    public spawnMonster(monsterName: string): Monster {
        let monster = MonsterFactory.createMonster("TinyZombie");
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