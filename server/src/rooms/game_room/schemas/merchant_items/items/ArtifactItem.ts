import GameManager from "../../../system/GameManager";
import ArtifactManager from "../../../system/StateManagers/ArtifactManager";
import EffectManager from "../../../system/StateManagers/EffectManager";
import Artifact from "../../Trees/Artifact";
import EffectFactory from "../../effects/EffectFactory";
import { StatConfig } from "../../effects/temp/StatEffect";
import Player from "../../gameobjs/Player";
import MerchantItem, { IMerchantItemConfig } from "../MerchantItem";

export type IArtifactItemConfig = {
    artifactId: string
} & IMerchantItemConfig

export default class ArtifactItem extends MerchantItem{
    private artifactId: string

    constructor(gameManager: GameManager, config: IArtifactItemConfig){
        super(gameManager, config)
        this.artifactId = config.artifactId
    }

    public consumeItem(player: Player): void {
        let artifact = this.hasArtifact(player)
        if(artifact){
            // Upgrade existing artifact
            try {
                ArtifactManager.upgradeArtifact(artifact)
            } catch (error) {
                console.log(`Error consuming artifact item.\n`, error)
            }
        }else{
            // Create and equip the artifact
            let artifactManager = this.gameManager.getArtifactManager()
            let artifact = artifactManager.createArtifact(this.artifactId)
    
            artifactManager.equipArtifact(player, artifact)
        }
    }

    public attemptPurchase(player: Player): string | boolean {
        let result = super.attemptPurchase(player)
        if(result !== true) return result

        if(this.artifactAlreadyMaxed(player)) return "Unable to purchase, artifact already maxed"
        return true
    }

    /**
     * 
     * @param player 
     * @returns true if the player already has the artifact maxed out else false
     */
    private artifactAlreadyMaxed(player: Player){
        for(let artifact of player.artifacts){
            if(artifact.getId() === this.artifactId && artifact.isMaxed()){
                return true
            }
        }

        return false
    }

    /**
     * 
     * @param player 
     * @returns the artifact if the player already has the artifact else false
     */
    private hasArtifact(player: Player){
        for(let artifact of player.artifacts){
            if(artifact.getId() === this.artifactId){
                return artifact
            }
        }

        return false
    }
}