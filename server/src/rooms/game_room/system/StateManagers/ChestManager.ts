import Chest from "../../schemas/gameobjs/chest/Chest";
import ChestPool from "../../schemas/gameobjs/chest/ChestPool";
import GameManager from "../GameManager";
import { IChestConfig } from "../interfaces";

export default class ChestManager {

    private gameManager: GameManager;
    private chestPool: ChestPool;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.chestPool = new ChestPool();
        
        setTimeout(() => {
            this.spawnChest({
                x: 500, y: 500,
                rarity: "wood",
            })
        }, 3000);
    }

    /**
     * Spawns a new chest. The chest can be filled with items.
     * When the chest is touched by a player it will give those items to the player.
     * @param config The IChestConfig
     * @returns a object containing the spawned chest and its matter body.
     */
    public spawnChest(config: IChestConfig) {
        let chest: Chest;
        let poolType = config.rarity;

        // Create the pool if it doesn't exist
        if(!this.chestPool.containsType(poolType)){
            this.chestPool.addPoolType(poolType);
        }

        // If the pool exists and contains at least 1 instance
        let pool = this.chestPool.getPool(poolType);
        if(pool && pool.length() > 0){
            // Get and reuse instance
            chest = this.chestPool.getInstance(poolType);
            chest.setConfig(config);
            chest.reset();
        }else{
            // no instance so create new instance.
            chest = new Chest(this.gameManager, config);
            let body = chest.getBody() as Matter.Body;
            this.gameManager.addGameObject(chest.id, chest, body);
        }

        return {chest: chest, body: chest.getBody() as Matter.Body};
    }

}