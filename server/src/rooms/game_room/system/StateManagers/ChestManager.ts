import Player from "../../schemas/gameobjs/Player";
import Chest from "../../schemas/gameobjs/chest/Chest";
import ChestPool from "../../schemas/gameobjs/chest/ChestPool";
import GameManager from "../GameManager";
import ArtifactFactory from "../UpgradeTrees/factories/ArtifactFactory";
import WeaponUpgradeFactory from "../UpgradeTrees/factories/WeaponUpgradeFactory";
import { IChestConfig } from "../interfaces";
import ArtifactManager from "./ArtifactManager";



const ITEM_COUNT_MAP = {
    "wood": 1,
    "iron": 2,
    "gold": 3,
}

const REGISTERED_ARTIFACTS = [
    "upgrade-019ad207-0882-4d23-a90b-a6d28705b246", // Glass Cannon
    "upgrade-072fe1da-fc6f-4aa4-8b8c-72b5da52eb32", // Amplifier
    "upgrade-92d98c71-c9a2-47e4-8ba1-1f03c578dd50", // Lightning Rod
]

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

    /**
     * A player has opened a chest. This method will play the chest open animation 
     * and sound effect. Then gives the player a new artifact.
     * @param player The player that opened the chest.
     * @param chest The chest.
     */
    public handleOpenChest(player: Player, chest: Chest) {
        if(chest.openChest()) {
            let itemCount = ITEM_COUNT_MAP[chest.rarity];
            let artifactList = [...REGISTERED_ARTIFACTS];
            
            while(itemCount > 0 && artifactList.length > 0) {
                // console.log(`itemCount: ${itemCount} artifactListSize: ${artifactList.length}`);

                // Choose an random artifact from artifactList. 
                let randomIdx = Math.floor(Math.random() * artifactList.length);
                
                // Check if the player already has that artifact.
                let artifactInPlayer = player.artifacts.filter((artifact) => artifact.root?.id === artifactList[randomIdx]);
                // If the player have the artifact equiped
                if(artifactInPlayer.length > 0) {
                    // Check if the player's artifact is maxed or not.
                    if(!ArtifactManager.hasNextUpgrade(artifactInPlayer[0])) {
                        // console.log(`hasNextUpgrade is false.`);
                        // If the artifact is maxed, remove bad artifact from artifactList, retry.
                        artifactList.splice(randomIdx, 1);
                        continue;
                    } else {
                        // Otherwise upgrade the artifact.
                        ArtifactManager.upgradeArtifact(artifactInPlayer[0]);
                        itemCount--;
                        // console.log("Player has upgraded artifact: ", artifactInPlayer[0].name);
                    }
                } else {
                    // If the player doesn't have the artifact equiped, Equip it.
                    let randomArtifactData = WeaponUpgradeFactory.createUpgrade(artifactList[randomIdx]);
                    if(!randomArtifactData || !this.gameManager.getArtifactManager().equipArtifact(player, randomArtifactData)) {
                        // If unsuccessful, remove bad artifact from artifactList, retry.
                        // console.log("Failed to equip new artifact");
                        artifactList.splice(randomIdx, 1);
                        continue;
                    } else {
                        itemCount--;
                        // console.log("Player has equiped new artifact: ", randomArtifactData.data.name);
                    }
                }
            }

            // TODO: Do something if itemCount > 0.
        }
    }



}