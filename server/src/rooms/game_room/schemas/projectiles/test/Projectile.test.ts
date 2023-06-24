import { ObjectPool } from "../../../../../util/PoolUtil"
import GameManager from "../../../system/GameManager"
import ProjectileManager from "../../../system/StateManagers/ProjectileManager"
import State from "../../State"
import Player from "../../gameobjs/Player"
import Projectile from "../Projectile"
import ProjectilePool from "../ProjectilePool"

describe("Projectile test", ()=>{
    let gameManager: GameManager
    let playerState: Player
    let projectileManager: ProjectileManager
    let projectilePool: ProjectilePool
    let range: number
    let activeTime: number

    beforeEach(async ()=>{
        gameManager = new GameManager(new State())
        await gameManager.preload()

        projectileManager = gameManager.getProjectileManager()
        projectilePool = projectileManager.getProjectilePool()

        //create player
        let sessionId = "fake-id"
        gameManager.getPlayerManager().createPlayer(sessionId, false)
        playerState = gameManager.getPlayerManager().getPlayerStateAndBody(sessionId).playerState

        activeTime = 3000
        range = 1000
    })

    function spawnProjectile(poolType: string = "pool-1", velocity: {x: number, y: number} = {x: 0, y: 0}){
        return projectileManager.spawnProjectile({
            sprite: "sprite",
            stat: playerState.stat,
            spawnX: playerState.x,
            spawnY: playerState.y,
            width: 10,
            height: 10,
            initialVelocity: velocity,
            collisionCategory: "PLAYER_PROJECTILE",
            range: range,
            activeTime: activeTime,
            poolType: poolType
        })
    }

    test("Inactive projectiles get reused properly based on poolType when spawning projectiles", ()=>{
        let poolType = "pool-1"

        // Spawn 1 projectile
        let {projectile, body} = spawnProjectile(poolType)

        // Update projectile by activeTime so its inactive
        expect(projectile.active).toBeTruthy()
        projectileManager.update(activeTime)
        expect(projectile.active).toBeFalsy()

        // update projectilemanager again to send all inactive projectiles are sent to the pool
        expect(projectile.inPoolMap).toBeFalsy()
        projectileManager.update(1)
        expect(projectile.inPoolMap).toBeTruthy()
        expect(projectilePool.getPool(poolType)?.length()).toBe(1) // pool should have this projectile

        // Spawn another projectile of same poolType
        let {projectile: projectile2, body: body2} = spawnProjectile(poolType)
        expect(projectile).toBe(projectile2) // same projectile reused
        expect(body).toBe(body2) // same Matter.Body reused
        expect(projectilePool.getPool(poolType)?.length()).toBe(0) // pool is now empty
    })
    test("new projectiles/gameobjects/matterbody are created when there is no pool or instance in pool to reuse", ()=>{
        let poolType = "pool-1"

        // Spawn 1 projectile
        let {projectile, body} = spawnProjectile(poolType)

        // Update projectile short of activeTime so its still active
        expect(projectile.active).toBeTruthy()
        projectileManager.update(activeTime - 1)
        expect(projectile.active).toBeTruthy()
        expect(projectilePool.getPool(poolType)?.length()).toBe(0) // pool empty

        // Spawn another projectile of same poolType but its a different projectile since the pool is empty
        let {projectile: projectile2, body: body2} = spawnProjectile(poolType)
        expect(projectile).not.toBe(projectile2) // same projectile reused
        expect(body).not.toBe(body2) // same Matter.Body reused
        expect(projectilePool.getPool(poolType)?.length()).toBe(0) // pool empty
    })
    test("Timed projectiles get returned to the proper pool based on poolType when timed out", ()=>{
        let poolType = "pool-1"
        let gameObjectsBefore = gameManager.state.gameObjects.size
        let matterBodiesBefore = gameManager.gameObjects.size

        // Spawn 1 projectile
        expect(projectilePool.getPool(poolType)).toBeUndefined() // no pool is created yet
        let {projectile, body} = spawnProjectile(poolType)
        expect(projectilePool.getPool(poolType)).toBeDefined() // pool created after spawning projectile with poolType

        // Check that projectiles are spawned and active
        let gameObjectsAfter = gameManager.state.gameObjects.size
        let matterBodiesAfter = gameManager.gameObjects.size
        expect(gameObjectsAfter).toBe(gameObjectsBefore + 1)
        expect(matterBodiesAfter).toBe(matterBodiesBefore + 1)
        expect(projectile.active).toBe(true) // active
        expect(projectile.inPoolMap).toBe(false) // not in pool map for reuse

        // update projectiles by just short of activeTime so they won't be reused yet
        projectileManager.update(activeTime - 1)
        expect(projectile.active).toBeTruthy() // active
        expect(projectile.inPoolMap).toBeFalsy() // not in pool map for reuse

        // update remaining time so projectile is now inactive
        projectileManager.update(1)
        expect(projectile.active).toBeFalsy() // no longer active
        expect(projectile.inPoolMap).toBeFalsy() //not in pool map as projectile manager needs to update one more time

        // Update again to add inactive projectiles to projectilePool
        projectileManager.update(1)
        let pool = projectilePool.getPool(poolType) as ObjectPool<Projectile>
        expect(projectile.inPoolMap).toBeTruthy()
        expect(pool.length() === 1).toBeTruthy()

        // Check that instance is returned
        expect(pool.getInstance()).toBe(projectile)
    })
    test("Ranged projectiles get returned to the proper pool based on poolType when range is out", ()=>{
        let poolType = "pool-2"
        let gameObjectsBefore = gameManager.state.gameObjects.size
        let matterBodiesBefore = gameManager.gameObjects.size
        
        // Spawn 1 projectile
        expect(projectilePool.getPool(poolType)).toBeUndefined() // no pool is created yet
        let {projectile, body} = spawnProjectile(poolType)
        expect(projectilePool.getPool(poolType)).toBeDefined() // pool created after spawning projectile with poolType

        // Check that projectiles are spawned and active
        let gameObjectsAfter = gameManager.state.gameObjects.size
        let matterBodiesAfter = gameManager.gameObjects.size
        expect(gameObjectsAfter).toBe(gameObjectsBefore + 1)
        expect(matterBodiesAfter).toBe(matterBodiesBefore + 1)
        expect(projectile.active).toBe(true) // active
        expect(projectile.inPoolMap).toBe(false) // not in pool map for reuse

        // update projectiles's position, but still within range
        projectile.x = projectile.spawnX + range - 100
        projectileManager.update(0)
        expect(projectile.active).toBeTruthy() // active
        expect(projectile.inPoolMap).toBeFalsy() // not in pool map for reuse

        // update position so it is out of range
        projectile.x = projectile.spawnX + range + 10
        projectileManager.update(0)
        expect(projectile.active).toBeFalsy() // no longer active
        expect(projectile.inPoolMap).toBeFalsy() //not in pool map as projectile manager needs to update one more time

        // Update again to add inactive projectiles to projectilePool
        projectileManager.update(0)
        let pool = projectilePool.getPool(poolType) as ObjectPool<Projectile>
        expect(projectile.inPoolMap).toBeTruthy()
        expect(pool.length() === 1).toBeTruthy()

        // Check that instance is returned
        expect(pool.getInstance()).toBe(projectile)
    })
})