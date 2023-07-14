import GameManager from "../../../../system/GameManager"
import DungeonManager from "../../../../system/StateManagers/DungeonManager";
import State from "../../../State";
import Player from "../../Player";
import MonsterPool from "../MonsterPool";


describe("Monster tests", ()=>{
    let gameManager: GameManager;
    let playerState: Player;
    let dungeonManager: DungeonManager;
    let monsterPool: MonsterPool;
    

    beforeEach(async ()=>{
        gameManager = new GameManager(new State());
        await gameManager.preload();

        dungeonManager = gameManager.getDungeonManager();
        monsterPool = dungeonManager.getMonsterPool();

        //create player
        let sessionId = "fake-id"
        gameManager.getPlayerManager().createPlayer(sessionId, false, gameManager)
        playerState = gameManager.getPlayerManager().getPlayerStateAndBody(sessionId).playerState
    })

    function spawnMonster(monsterName: string){
        return dungeonManager.spawnMonster(monsterName);
    }

    test("Inactive monsters gets sent to the pool. Pool monsters can then be reused.", ()=>{
        let monsterName = "TinyZombie";
        let poolType = monsterName;

        // Create a monster 
        let monster = spawnMonster(monsterName);

        monster.setActive(false);

        // update projectilemanager again to send all inactive projectiles are sent to the pool
        expect(monster.inPoolMap).toBeFalsy()
        dungeonManager.update(1)
        expect(monster.inPoolMap).toBeTruthy()
        expect(monsterPool.getPool(poolType)?.length()).toBe(1) // pool should have this projectile

        // Spawn another projectile of same poolType
        let monster2 = spawnMonster(monsterName);
        expect(monster).toBe(monster2) // same projectile reused
        expect(monster.getBody()).toBe(monster2.getBody()) // same Matter.Body reused
        expect(monsterPool.getPool(poolType)?.length()).toBe(0) // pool is now empty
    })
    test("Spawning two monsters of the same pool type. Pool should stay empty.", ()=>{
        let monsterName = "TinyZombie";
        let poolType = monsterName;

        // Create a monster 
        let monster = spawnMonster(monsterName);

        // Create another monster.
        let monster2 = spawnMonster(monsterName);

        // monster does not equal monster2. 
        expect(monster).not.toBe(monster2);

        // update dungeon manager. The monster pool should be empty.
        expect(monster.inPoolMap).toBeFalsy();
        expect(monster2.inPoolMap).toBeFalsy();
        dungeonManager.update(1);
        expect(monster.inPoolMap).toBeFalsy();
        expect(monster2.inPoolMap).toBeFalsy();
        expect(monsterPool.getPool(poolType)?.length()).toBe(0) // empty pool.
    })
    test("Monster that are spawned from the pool have its hp reseted.", () => {
        let monsterName = "TinyZombie";

        // Create a monster 
        let monster = spawnMonster(monsterName);
        let defaultHp = monster.stat.hp;

        // Subtract the monster's hp by 100.
        monster.stat.hp -= 100;

        // Monster's hp should now not be the same as the default.
        expect(monster.stat.hp).not.toBe(defaultHp);

        // Return monster to pool.
        monster.active = false;
        dungeonManager.update(1);

        // Reuse monster
        let monster2 = spawnMonster(monsterName);

        // Check if the monster is the same and the hp reseted.
        expect(monster).toBe(monster2);
        expect(monster2.stat.hp).toBe(defaultHp);
        expect(monster.stat.hp).toBe(defaultHp);

    })
})