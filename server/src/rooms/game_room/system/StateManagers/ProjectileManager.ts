import Matter, { Bodies } from 'matter-js';
import State from '../../schemas/State';
import Player from '../../schemas/gameobjs/Player';
import Cooldown from '../../schemas/gameobjs/Cooldown';
import GameManager from '../GameManager';
import MathUtil from '../../../../util/MathUtil';
import GameObject from '../../schemas/gameobjs/GameObject';
import Projectile from '../../schemas/gameobjs/Projectile';
import Entity from '../../schemas/gameobjs/Entity';

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
   
    public createProjectile(spriteName: string = "demo_hero", owner: Entity, x?: number, y?: number) {
        let projectile = new Projectile(spriteName, x? x : owner.x, y? y : owner.y, owner);
        let body = this.gameManager.createMatterObject()
        this.gameManager.addGameObject(projectile.id, projectile, body);
    }   
}