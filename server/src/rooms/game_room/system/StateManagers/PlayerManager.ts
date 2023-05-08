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
import WeaponManager from './WeaponManager';
import WeaponLogicManager from '../Weapons/WeaponLogic/WeaponLogicManager';

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

        data = {mouseX, mouseY, playerBody}

        WeaponLogicManager.getManager().useAttack(playerState, this.gameManager, data)
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
                        mask: MaskManager.getManager().getMask("PLAYER")
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
        let playerSpawnPoint = this.gameManager.getDungeonManager().getPlayerSpawnPoint();
        if(playerSpawnPoint !== null) {
            newPlayer.x = playerSpawnPoint.x + (Math.random() * 20 - 10);
            newPlayer.y = playerSpawnPoint.y + (Math.random() * 20 - 10);
        } 
        //Set weaponupgrade tree for player with a test weapon
        // let tree = factory.get
        // WeaponManager.setWeaponUpgradeTree(newPlayer, undefined)

        let body = Matter.Bodies.rectangle(newPlayer.x, newPlayer.y, 49, 44, {
            isStatic: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
            collisionFilter: {
                category: Categories.PLAYER,
                mask: MaskManager.getManager().getMask("PLAYER")
            }
        })

        newPlayer.setId(sessionId);
        this.gameManager.addGameObject(sessionId, newPlayer, body);
    }   

    /**
     * Gets the nearest player to the given x and y position.
     * @param x The x value.
     * @param y The y value.
     */
    public getNearestPlayer(x: number, y: number): Player | undefined {
        let players = new Array<Player>;
        this.gameManager.state.gameObjects.forEach((value) => {if(value instanceof Player) players.push(value)});
        if(players.length === 0) return undefined;
        let nearestPlayer = players[0];
        let nearestDistance = MathUtil.distanceSquared(x, y, nearestPlayer.x, nearestPlayer.y);
        for(let i = 1; i < players.length; i++) {
            let player = players[i];
            let distance = MathUtil.distanceSquared(x, y, player.x, player.y);
            if(distance < nearestDistance) {
                nearestDistance = distance;
                nearestPlayer = player;
            }
        }
        return nearestPlayer;
    }
}