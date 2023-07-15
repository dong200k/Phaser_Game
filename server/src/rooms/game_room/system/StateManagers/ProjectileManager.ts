import GameManager from '../GameManager';
import Projectile from '../../schemas/projectiles/Projectile'
import { GameEvents, IProjectileConfig } from '../interfaces';
import ProjectilePool from '../../schemas/projectiles/ProjectilePool';
import ctors, { IClasses } from '../../schemas/projectiles/projectileClasses';
import Matter from 'matter-js';

export default class ProjectileManager{
    private gameManager: GameManager
    private projectilePool: ProjectilePool

    // Add subclasses of projectile here
    static ctors = {
        "Projectile": Projectile,
    }

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.projectilePool = new ProjectilePool();
        this.initializeEvents();
    }   

    private initializeEvents() {
        let eventEmitter = this.gameManager.getEventEmitter();
        eventEmitter.addListener(GameEvents.SPAWN_PROJECTILE, (projectileConfig: IProjectileConfig) => {
            this.spawnProjectile(projectileConfig);
        });
    }

    update(deltaT: number){
        // Call update on each projectile
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Projectile){
                if(gameObject.active){
                    gameObject.update(deltaT)
                }else if(!gameObject.inPoolMap){
                    gameObject.inPoolMap = true
                    this.projectilePool.returnInstance(gameObject.poolType, gameObject)
                }
            }
        })
    }

    // getProjectileStateAndBody(sessionId: string){
    //     return {playerBody: this.gameManager.matterBodies.get(sessionId), playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    // }

    /**
     * Creates a projectile and its Matter.Body based on the projectileConfig and adds it to the gameManager.
     * If using a subclass of Projectile set the type parameter accordingly
     * @param projectileConfig 
     * @param type: string name of the projectile class to creates
     * @returns 
     */
    public spawnProjectile(projectileConfig: IProjectileConfig, type: IClasses = "Projectile") {
        let projectile: Projectile
        let poolType = projectileConfig.poolType

        // Create the pool if it doesn't exist
        if(!this.projectilePool.containsType(poolType)){
            this.projectilePool.addPoolType(poolType)
        }

        // If the pool exists and contains at least 1 instance
        let pool = this.projectilePool.getPool(poolType)
        if(pool && pool.length() > 0){
            // Get and reuse instance
            projectile = this.projectilePool.getInstance(poolType)
            projectile.setConfig(projectileConfig)
        }else{
            // no instance so create new projectile
            projectile = new ctors[type](projectileConfig, this.gameManager)
            let body = projectile.getBody() as Matter.Body
            body.label = ""
            this.gameManager.addGameObject(projectile.projectileId, projectile, body);
        }

        return {projectile: projectile, body: projectile.getBody() as Matter.Body}
    }

    getProjectilePool(){
        return this.projectilePool
    }
}