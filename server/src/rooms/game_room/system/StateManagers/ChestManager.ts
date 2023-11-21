import Artifact from "../../schemas/Trees/Artifact";
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

const CHEST_DESPAWN_TIME_MS = 3000;

const REGISTERED_ARTIFACTS: string[] = [
    "upgrade-019ad207-0882-4d23-a90b-a6d28705b246", // Glass Cannon
    "upgrade-072fe1da-fc6f-4aa4-8b8c-72b5da52eb32", // Amplifier
    "upgrade-92d98c71-c9a2-47e4-8ba1-1f03c578dd50", // Lightning Rod
    "upgrade-16005a69-9f01-4f5a-b2a5-53029a9e08e3", // Carrot
    "upgrade-072fe1da-fc6f-4aa4-8b8c-72b5da52eb32", // Amplifier
    "upgrade-1718a411-4b87-4f14-bf7b-20aa5bfbce91", // Broccoli
    "upgrade-4c5aef1c-ed88-4795-90f6-49f7c1ef2b42", // Qi Armor
]

export default class ChestManager {

    private gameManager: GameManager;
    private chestPool: ChestPool;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
        this.chestPool = new ChestPool();
        
        setInterval(() => {
            this.spawnChest({
                x: 250, y: 250,
                rarity: "gold",
            })
        }, 2000);
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
            chest.active = true;
            chest.visible = true;
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
                let artifactInPlayer: Artifact[] = player.artifacts.filter((artifact) => {
                    return artifact.getId() === artifactList[randomIdx];
                });
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
                        console.log("Player has upgraded artifact: ", artifactInPlayer[0].name);
                    }
                } else {
                    // If the player doesn't have the artifact equiped, Equip it.
                    let newArtifact = this.gameManager.getArtifactManager().createArtifact(artifactList[randomIdx]);
                    let artifact = this.gameManager.getArtifactManager().equipArtifact(player, newArtifact);
                    if(!artifact) {
                        // If unsuccessful, remove bad artifact from artifactList, retry.
                        console.log("Failed to equip new artifact");
                        artifactList.splice(randomIdx, 1);
                        continue;
                    }
                    else {
                        itemCount--;
                        // console.log("Player has equiped new artifact: ", artifact.root?.data.name);
                    }
                }
            }

            // TODO: Do something if itemCount > 0.
            if(itemCount > 0) {
                console.log("WARNING: No more items to give to the player.");
            }
        }
        setTimeout(() => {
            chest.setActive(false);
        }, CHEST_DESPAWN_TIME_MS);
    }

}