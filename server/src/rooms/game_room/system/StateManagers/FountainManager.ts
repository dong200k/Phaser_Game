import Matter from "matter-js"
import GameManager from "../GameManager"
import Fountain, { IFountainConfig } from "../../schemas/gameobjs/Fountain"



/**
 * The fountain manager spawns fountain which heals players.
 */
export default class FountainManager{
    private gameManager: GameManager
    private fountain!: Fountain
    private fountainCreated = false

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    /**
     * 
     * @param pos spawn position, default is the origin
     * @returns callback to hide the fountain
     */
    spawnFountain(config: IFountainConfig){
        console.log("Spawning Fountain")
        if(!config.x) config.x = 0
        if(!config.y) config.y = 0

        if(!this.fountainCreated){
            this.fountainCreated = true
            let fountain = new Fountain(this.gameManager, config)
            let body = fountain.getBody() as Matter.Body;
            this.gameManager.addGameObject(fountain.id, fountain, body);
            this.fountain = fountain
        }else{
            this.fountain.resetChances()
            this.fountain.show({x: config.x, y: config.y})
        }
    }

    hideFountain(){
        console.log("Hiding fountain")
        this.fountain.hide()
    }

    getFountain(){
        return this.fountain
    }
}