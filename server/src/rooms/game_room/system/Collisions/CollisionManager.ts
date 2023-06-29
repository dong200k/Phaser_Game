import Matter from "matter-js";
import GameManager from "../GameManager";

export default class CollisionManager{
    private gameManager: GameManager

    constructor(gameManager: GameManager){
        this.gameManager = gameManager
    }

    // public resolveCollisions(bodyA: Matter.Body, bodyB)
}