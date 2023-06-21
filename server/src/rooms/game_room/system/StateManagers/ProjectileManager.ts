import GameManager from '../GameManager';
import Projectile from '../../schemas/projectiles/Projectile'
import { IProjectileConfig } from '../interfaces';
import ProjectilePool from '../../schemas/projectiles/ProjectilePool';

export default class ProjectileManager{
    private gameManager: GameManager
    private projectilePool: ProjectilePool

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
        this.projectilePool = new ProjectilePool()
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
    //     return {playerBody: this.gameManager.gameObjects.get(sessionId), playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    // }

    /**
     * Creates a projectile and its Matter.Body based on the projectileConfig and adds it to the gameManager
     * @param projectileConfig 
     * @returns 
     */
    public spawnProjectile(projectileConfig: IProjectileConfig) {
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
            projectile = new Projectile(projectileConfig, this.gameManager);
            this.gameManager.addGameObject(projectile.projectileId, projectile, projectile.getBody() as Matter.Body);
        }

        return {projectile: projectile, body: projectile.getBody() as Matter.Body}
    }

    getProjectilePool(){
        return this.projectilePool
    }
}