import Matter from "matter-js"
import Artifact from "../../schemas/Trees/Artifact"
import Forge from "../../schemas/gameobjs/Forge"
import GameObject from "../../schemas/gameobjs/GameObject"
import Player, { UpgradeItem } from "../../schemas/gameobjs/Player"
import GameManager from "../GameManager"
import ArtifactManager from "./ArtifactManager"
import TreeManager from "./TreeManager"
import WeaponManager from "./WeaponManager"

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
    private forge!: Forge
    private createdForge = false
    /** Chances each players get at each forge to pick upgrades */
    private chancesEachForge = 2

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
     * Called when player opens the forge. This method will give players the lastest upgrade information.
     * @param player 
     * @param forge 
     */
    handleOpenForge(player: Player, forge: GameObject){
        let upgrades = this.getItemUpgrades(player.getId())
        this.gameManager.getPlayerManager().givePlayerUpgradeSelection(player, upgrades)
    }

    /**
     * 
     * @param pos spawn position of forge default is the origin
     */
    spawnForge(pos = {x: 0, y: 0}){
        console.log("Spawning forge")
        if(!this.createdForge){
            this.forge = new Forge(this.gameManager, pos)
            let body = this.forge.getBody() as Matter.Body;
            this.gameManager.addGameObject(this.forge.id, this.forge, body);
        }
        this.forge.show(pos)
    }

    hideForge(){
        console.log("Despawning forge")
        this.forge.hide()
        this.clearForgeUpgrades()
        this.gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Player){
                obj.upgradeInfo.playerSelectedUpgrade()
            }
        })
    }

    /**
     * This method will clear all the upgrades in every player's forge. This also causes the side effect of
     * players getting more upgrade chances the next time the forge comes around.
     */
    private clearForgeUpgrades(){
        this.forgeUpgrades.forEach((val, key)=>{
            this.forgeUpgrades.delete(key)
        })
    }

    /**
     * Returns random upgrades for weapon + artifacts based on the given playerId.
     * If the player has looked at upgrades already then the cached upgrades are returned.
     * If the player has no upgrades chances remaining then an empty list is returned.
     * 
     * @param playerId 
     * @returns 
     */
    public getItemUpgrades(playerId: string){
        // Contents already determined
        let playerForgeUpgrades = this.forgeUpgrades.get(playerId)
        if(playerForgeUpgrades) {
            // No chances to get upgrades
            if(playerForgeUpgrades.chancesRemaining === 0) return []
            
            return playerForgeUpgrades.upgradeItems
        }
        
        // Genreate new upgrades from player upgrades
        this.forgeUpgrades.set(playerId, {
            upgradeItems: this.generateUpgradeItems(playerId),
            chancesRemaining: this.chancesEachForge
        })
        this.updatePlayerUpgradeInfoChances(playerId)

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
        this.updatePlayerUpgradeInfoChances(playerId)
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

                this.updatePlayerUpgradeInfoChances(playerId)
                return true
            }else{
                if(forgeUpgrade) console.log("No chances left to use forge. ")
                else console.log(`Forge upgrade undefined for player: ${player.name}`)
            }
        }

        return false
    }

    /**
     * Returns the remaining upgrade chances in the forge
     * @param playerId 
     * @returns 
     */
    public getChangesRemaning(playerId: string){
        let chancesRemaining = this.forgeUpgrades.get(playerId)?.chancesRemaining
        return chancesRemaining? chancesRemaining : 0
    }

    /**
     * This method will update the player's UpgradeInfo with information about the remaining chances to select and upgrade in the forge.
     * @param playerId 
     */
    public updatePlayerUpgradeInfoChances(playerId: string){
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)
        player?.upgradeInfo.setForgeUpgradeChances(this.getChangesRemaning(playerId))
    }   
}