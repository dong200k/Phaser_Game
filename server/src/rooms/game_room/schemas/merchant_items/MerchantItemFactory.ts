import GameManager from "../../system/GameManager";
import { StatConfig } from "../effects/temp/StatEffect";
import { IMerchantItemConfig } from "./MerchantItem";
import ArtifactItem, { IArtifactItemConfig } from "./items/ArtifactItem";
import StatItem, { IStatItemConfig } from "./items/StatItem";

export default class MerchantItemFactory{
    private gameManager: GameManager
    constructor(gameManager: GameManager){
        this.gameManager = gameManager
    }

    

    /** Create a item that grants the player who purchases it lifesteal */
    public createLifeStealItem(lifeSteal = 1, coinCost = 0, levelCost = 0){
        return this.createStatItem({
            statConfig: {lifeSteal}, 
            coinCost, 
            levelCost,
            name: "Blood orb",
            description: `Grants +${lifeSteal} lifesteal to player's attacks` + `Gold Cost: ${coinCost}`
        })
    }

    /** Creates a max health item that increases the max health of the player who purchases it.*/
    public createMaxHealthItem(maxHp = 50, coinCost = 0, levelCost = 0){
        return this.createStatItem({
            statConfig: {maxHp}, 
            coinCost, 
            levelCost,
            name: "Max Health " + maxHp,
            description: "Increases max health by " + maxHp + `Gold Cost: ${coinCost}`
        })
    }

    /**
     * Creates a stat item that adds stats to the player who purchases it.
     * @param statItemConfig 
     * @returns 
     */
    public createStatItem(statItemConfig: IStatItemConfig){
        return new StatItem(this.gameManager, statItemConfig)
    }

    /**
     * Creates a artifact item that gives the player an artifact or upgrades the player's artifact if they already have it.
     * @param artifactId 
     * @param coinCost
     * @param levelCost
     * @returns 
     */
    public createArtifactItem(artifactId: string, coinCost = 0, levelCost = 0){
        let artifact = this.gameManager.getArtifactManager().createArtifact(artifactId)

        return new ArtifactItem(this.gameManager, {
            artifactId,
            name: artifact.name,
            description: artifact.description + "Gold Cost: " + coinCost,
            coinCost,
            levelCost
        })
    }
}