import Matter, { Bodies } from 'matter-js';
import State from '../../schemas/State';
import Player from '../../schemas/gameobjs/Player';
import Cooldown from '../../schemas/gameobjs/Cooldown';
import GameManager from '../GameManager';
import MathUtil from '../../../../util/MathUtil';
import GameObject from '../../schemas/gameobjs/GameObject';
import Projectile from '../../schemas/gameobjs/Projectile';
import Entity from '../../schemas/gameobjs/Entity';
import { Categories } from '../Collisions/Category';
import MaskManager from '../Collisions/MaskManager';

export default class ProjectileManager{
    private gameManager: GameManager

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    update(deltaT: number){
    }

    // getProjectileStateAndBody(sessionId: string){
    //     return {playerBody: this.gameManager.gameObjects.get(sessionId), playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    // }

    public spawnProjectile(spriteName: string = "demo_hero", owner: Entity, x?: number, y?: number, velocity?: {x: number, y:number}) {
        // ***TODO*** grab width and height from database or based on owner and spriteName
        let width = 10
        let height = 10
        let spawnX = x? x: owner.x
        let spawnY = y? y: owner.y
        let projectile = new Projectile(spriteName, owner, spawnX, spawnY, width, height);
        
        let body = Matter.Bodies.rectangle(spawnX, spawnY, width, height, {
            isStatic: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        })

        // TODO make it not hard coded to player projectile only
        body.collisionFilter = {
            group: 0,
            category: Categories.PLAYER_PROJECTILE,
            mask: MaskManager.getManager().getMask('PLAYER_PROJECTILE') 
        };

        // console.log(Categories.OBSTACLE & MaskManager.getMask("PLAYER_PROJECTILE") as number)
       
        let projVelocity = velocity? velocity: {x: 1, y: 1}
        Matter.Body.setVelocity(body, projVelocity);
        console.log(projectile.projectileId)
        this.gameManager.addGameObject(projectile.projectileId, projectile, body);
        return body 
    }   
}