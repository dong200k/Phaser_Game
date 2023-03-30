import Matter, { Bodies } from 'matter-js';
import State from '../../schemas/State';
import Player from '../../schemas/gameobjs/Player';
import Cooldown from '../../schemas/gameobjs/Cooldown';
import GameManager from '../GameManager';
import MathUtil from '../../../../util/MathUtil';
import GameObject from '../../schemas/gameobjs/GameObject';

export default class PlayerManager{
    private gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    update(deltaT: number){
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Player){
                gameObject.attackCooldown.tick(deltaT)
                gameObject.specialCooldown.tick(deltaT)
            }
        })
    }

    getPlayerStateAndBody(sessionId: string){
        return {playerBody: this.gameManager.gameObjects.get(sessionId), playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    }

    processPlayerAttack(playerId: string, data: any){
        let [mouseClick, mouseX, mouseY] = data
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")
       
        if(!mouseClick || !playerState.attackCooldown.isFinished) return
        playerState.attackCooldown.reset()

        // spawn new game object/projectile at players position
        let obj = new GameObject(playerBody.position.x, playerBody.position.y, playerId)

        // sync with server state
        this.gameManager.state.gameObjects.set(obj.id, obj);

        //Create matterjs body for obj
        let body = Matter.Bodies.rectangle(obj.x, obj.y, 10, 10, {isStatic: false});
        
        // so bullet does not collide with player
        body.collisionFilter = {
            'group': -1,
            'category': 2,
            'mask': 0,
        };
        this.gameManager.gameObjects.set(obj.id, body);

        Matter.Composite.add(this.gameManager.world, body);

        let [x,y] = MathUtil.getNormalizedSpeed(mouseX - obj.x, mouseY - obj.y, 10)
        Matter.Body.setVelocity(body, {x, y});
    }

    processPlayerMovement(playerId: string, data: number[]){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")

        //calculate new player velocity
        let speed = playerState.stat.speed;
        let x = 0;
        let y = 0;
        if(data[0]) y -= 1;
        if(data[1]) y += 1;
        if(data[2]) x -= 1;
        if(data[3]) x += 1;
        [x,y] = MathUtil.getNormalizedSpeed(x, y, speed)
        Matter.Body.setVelocity(playerBody, {x, y});
    }

    processPlayerSpecial(playerId: string, useSpecial: boolean){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")
        
        if(!useSpecial || !playerState.specialCooldown.isFinished) return
        playerState.specialCooldown.reset()

        if(playerState.role === "ranger"){
            playerState.stat.speed *= 3
            console.log(playerState.stat.speed)

            setTimeout(()=>{
                playerState.stat.speed = 1
            }, 1000)
        }
       
    }

    public createPlayer(sessionId: string, isOwner: boolean) {
        if(isOwner) this.gameManager.setOwner(sessionId)

        //TODO: get player data from the database
        let newPlayer = new Player("No Name");
        newPlayer.x = Math.random() * 200 + 100;
        newPlayer.y = Math.random() * 200 + 100;

        let body = Matter.Bodies.rectangle(0, 0, 49, 44, {
            isStatic: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        })

        this.gameManager.addGameObject(sessionId, newPlayer, body);
    }   
}