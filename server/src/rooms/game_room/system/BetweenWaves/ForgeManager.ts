import Artifact from "../../schemas/Trees/Artifact"
import Player, { UpgradeItem } from "../../schemas/gameobjs/Player"
import GameManager from "../GameManager"
import ArtifactManager from "../StateManagers/ArtifactManager"
import TreeManager from "../StateManagers/TreeManager"
import WeaponManager from "../StateManagers/WeaponManager"

/** Upgrades available for choosing and basic for a single player */
export interface IForgeUpgrade {
    upgradeItems: UpgradeItem[],
    /** Chances remaning to pick upgrades before the next forge appears */
    chancesRemaining: number
}

/**
 * The ForgeManager manages the forge, a place between waves where players can trade their levels in for artifact and weapon upgrades.
 */
export default class ForgeManager{
    private gameManager: GameManager

    /** Upgrades available for choosing, generated each time forge shows up. Reset when wave ends. */
    private forgeUpgrades: Map<string, IForgeUpgrade> = new Map()    

    /** Config to determine how forge contents are generated */
    // private forgeConfig = {
    //     artifactUpgradeCount: 3,
    // }

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    /**
     * TODO: send info to client to show forge screen
     */
    handleOpenForge(){
    }

    /**
     * TODO: spawna a forge that players can interact with
     */
    spawnForge(){
        
    }

    hideForge(){
        
    }

    /**
     * Returns random upgrades for weapon/artifacts based on the given playerId.
     * 
     * Note: To get new upgrades 
     * @param playerId 
     * @returns 
     */
    public getItemUpgrades(playerId: string){
        // Contents already determined
        let playerForgeUpgrades = this.forgeUpgrades.get(playerId)
        if(playerForgeUpgrades) {
            console.log("forge item length: ", playerForgeUpgrades.upgradeItems.length)
            return playerForgeUpgrades.upgradeItems
        }
        
        // Genreate new upgrades from player upgrades
        this.forgeUpgrades.set(playerId, {
            upgradeItems: this.generateUpgradeItems(playerId),
            chancesRemaining: 1
        })
        return this.forgeUpgrades.get(playerId)!.upgradeItems
    }

    /**
     * Generates forge upgrades for a single player from their artifacts and weapon
     * @param playerId 
     * @returns 
     */
    private generateUpgradeItems(playerId: string){
        let upgrades: Array<UpgradeItem> = []
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)
        if(!player) return upgrades

        // Get possible artifact upgrades
        let possibleArtifactUpgrades: Array<UpgradeItem> = []
        for(let artifact of player.artifacts){
            if(!artifact.isMaxed()){
                possibleArtifactUpgrades.push(new UpgradeItem({
                    type: "artifact",
                    name: artifact.name,
                    description: artifact.getNextUpgradeDescription(),
                    imageKey: artifact.imageKey,
                    tree: artifact,
                    upgradeNode: artifact.getNextUpgrade()
                }))
            }
        }

        // Get possible weapon upgrades
        let weaponUpgrades = WeaponManager.getAvailableUpgrades(player)
        let possibleWeaponUpgrades: Array<UpgradeItem> = []
        for(let upgrade of weaponUpgrades){
            possibleWeaponUpgrades.push(new UpgradeItem({
                type: "weapon",
                name: upgrade.data.name,
                description: upgrade.data.description,
                imageKey: upgrade.data.name.toLocaleLowerCase() + "_icon",
                tree: player.weaponUpgradeTree,
                upgradeNode: upgrade
            }))
        }

        // Randomly choose upgrades
        upgrades = upgrades.concat(possibleArtifactUpgrades)
        upgrades = upgrades.concat(possibleWeaponUpgrades)

        return upgrades
    }

    /** resets forge upgrades for a player so that the next time upgrades are given to the player fresh upgrades are choosen
     * and chances remaining to pick an upgrade is reset.
    */
    public resetForgeUpgrades(playerId: string){
        this.forgeUpgrades.delete(playerId)
    }

    /**
     * Selects an upgrade for a player. UpgradeItems are found on the player's upgradeInfo.
     * @param playerId 
     * @param item 
     * @returns true if upgrade was successfull
     */
    public selectUpgrade(playerId: string, item: UpgradeItem){
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)

        if(player) {
            let forgeUpgrade = this.forgeUpgrades.get(playerId)

            if(forgeUpgrade && forgeUpgrade.chancesRemaining > 0){
                if(item.type === "weapon"){
                    TreeManager.selectGivenUpgrade(player, item.getTree(), item.getUpgradeNode())
                }else{
                    let artifact = item.getTree() as Artifact
                    ArtifactManager.upgradeArtifact(artifact)
                }

                // Remove item from list of upgrades
                let upgradeList = forgeUpgrade.upgradeItems
                if(upgradeList) forgeUpgrade.upgradeItems = upgradeList.filter(upgradeItem=> !upgradeItem.isEqual(item))
                console.log('length after picking upgraded: ', forgeUpgrade.upgradeItems.length)
                // Reduce remaining chances
                forgeUpgrade.chancesRemaining -= 1

                return true
            }else{
                if(forgeUpgrade) console.log("No chances left to use forge. ")
                else console.log(`Forge upgrade undefined for player: ${player.name}`)
            }
        }

        return false
    }

    public getChangesRemaning(playerId: string){
        let chancesRemaining = this.forgeUpgrades.get(playerId)?.chancesRemaining
        return chancesRemaining? chancesRemaining : 0
    }
}