import Matter, { Bodies } from 'matter-js';
import State from '../../schemas/State';
import Player from '../../schemas/gameobjs/Player';
import Cooldown from '../../schemas/gameobjs/Cooldown';
import GameManager from '../GameManager';
import MathUtil from '../../../../util/MathUtil';
import GameObject from '../../schemas/gameobjs/GameObject';
import Projectile from '../../schemas/gameobjs/Projectile';
import { Categories } from '../Collisions/Category';
import MaskManager from '../Collisions/MaskManager';

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

        // ***TODO*** grab projectile info from weapon player is using
        let spriteName = "demo_hero"
        let playerX = playerBody.position.x
        let playerY = playerBody.position.y
        let velocity = MathUtil.getNormalizedSpeed(mouseX - playerX, mouseY - playerY, 10)

        let body = this.gameManager.projectileManager.spawnProjectile(spriteName, playerState, playerX, playerY, velocity)
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
        let velocity = MathUtil.getNormalizedSpeed(x, y, speed)
        Matter.Body.setVelocity(playerBody, velocity);
    }

    processPlayerSpecial(playerId: string, useSpecial: boolean){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")
        
        if(!useSpecial || !playerState.specialCooldown.isFinished) return
        playerState.specialCooldown.reset()

        if(playerState.role === "ranger"){
            console.log("Activating wall hack speed boost for 1 second")
            playerState.stat.speed *= 5
            console.log(playerState.stat.speed)

            // set mask to 0 to collide with nothing
            playerBody.collisionFilter = {
                ...playerBody.collisionFilter,
                mask: 0 
            }

            // revert hacks
            setTimeout(()=>{
                playerState.stat.speed = 1
                if(playerBody){
                    playerBody.collisionFilter = {
                        ...playerBody.collisionFilter,
                        mask: MaskManager.getMask("PLAYER")
                    }
                }

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
            collisionFilter: {
                category: Categories.PLAYER,
                mask: MaskManager.getMask("PLAYER")
            }
        })

        this.gameManager.addGameObject(sessionId, newPlayer, body);
    }   
}