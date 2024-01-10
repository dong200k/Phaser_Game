import Matter from "matter-js"
import Artifact from "../../schemas/Trees/Artifact"
import Forge from "../../schemas/gameobjs/Forge"
import GameObject from "../../schemas/gameobjs/GameObject"
import Player, { UpgradeItem } from "../../schemas/gameobjs/Player"
import GameManager from "../GameManager"
import ArtifactManager from "./ArtifactManager"
import TreeManager from "./TreeManager"
import WeaponManager from "./WeaponManager"
import MerchantManager from "./MerchantManager"
import WeaponUpgradeTree from "../../schemas/Trees/WeaponUpgradeTree"
import WeaponData from "../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../schemas/Trees/Node/Node"
import ForgeUpgrade from "../../schemas/ForgeUpgradeItem"

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
    handleOpenForge(player: Player, forge: Forge){
        let upgrades = this.getItemUpgrades(player.getId())
        forge.ping += 1
        // this.gameManager.getPlayerManager().givePlayerUpgradeSelection(player, upgrades)
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
        this.forge?.hide()
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
        this.forge.forgeUpgrades.forEach((val, key)=>{
            this.forge.forgeUpgrades.delete(key)
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
        let playerForgeUpgrades = this.forge.forgeUpgrades.get(playerId)
        if(playerForgeUpgrades) {
            // No chances to get upgrades
            if(playerForgeUpgrades.chancesRemaining === 0) return []
            
            return playerForgeUpgrades.upgradeItems
        }
        
        // Genreate new upgrades from player upgrades
        this.forge.forgeUpgrades.set(playerId, new ForgeUpgrade(
            this.generateUpgradeItems(playerId),
            this.forge.chancesEachForge
        ))
        // this.updatePlayerUpgradeInfoChances(playerId)

        return this.forge.forgeUpgrades.get(playerId)!.upgradeItems
    }

    /**
     * Generates forge upgrades for a single player from their artifacts and weapon
     * @param playerId 
     * @returns 
     */
    public generateUpgradeItems(playerId: string){
        let upgrades: Array<UpgradeItem> = []
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)
        if(!player) return upgrades
        
        // let possibleArtifactUpgrades = this.getPossibleArtifactUpgrades(player)
        let possibleWeaponUpgrades = this.getPossibleWeaponUpgrades(player)

        // Randomly choose upgrades
        // upgrades = upgrades.concat(possibleArtifactUpgrades)
        upgrades = upgrades.concat(possibleWeaponUpgrades)

        return MerchantManager.chooseRandomFromList(4, upgrades)
    }

    public getPossibleWeaponUpgrades(player: Player){
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
                upgradeNode: upgrade,
                usage: "weapon"
            }))
        }
        return possibleWeaponUpgrades
    }

    public getPossibleArtifactUpgrades(player: Player){
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
                    upgradeNode: artifact.getNextUpgrade(),
                    usage: artifact.usage
                }))
            }
        }
        return possibleArtifactUpgrades
    }

    /** resets forge upgrades for a player so that the next time upgrades are given to the player fresh upgrades are choosen
     * and chances remaining to pick an upgrade is reset.
    */
    public resetForgeUpgrades(playerId: string){
        this.forge.forgeUpgrades.delete(playerId)
        // this.updatePlayerUpgradeInfoChances(playerId)
    }

    /**
     * Selects an upgrade for a player. UpgradeItems are found on the player's upgradeInfo.
     * @param playerId 
     * @param item 
     * @returns true if upgrade was successfull
     */
    private selectUpgrade(playerId: string, item: UpgradeItem){
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)

        if(player) {
            let forgeUpgrade = this.forge.forgeUpgrades.get(playerId)

            if(forgeUpgrade && forgeUpgrade.chancesRemaining > 0){
                if(item.type === "weapon"){
                    TreeManager.selectGivenUpgrade(player, item.getTree() as WeaponUpgradeTree, item.getUpgradeNode() as Node<WeaponData>)
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
        let chancesRemaining = this.forge.forgeUpgrades.get(playerId)?.chancesRemaining
        return chancesRemaining? chancesRemaining : 0
    }

    /**
     * This method will update the player's UpgradeInfo with information about the remaining chances to select and upgrade in the forge.
     * @param playerId 
     */
    public updatePlayerUpgradeInfoChances(playerId: string){
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId)
        // player?.upgradeInfo.setForgeUpgradeChances(this.getChangesRemaning(playerId))
        this.forge.forgeUpgrades.get(playerId)?.setChancesRemaining(this.getChangesRemaning(playerId))
    }   
    
    public processPlayerSelectUpgrade(playerId: string, choice: number) {
        let player = this.gameManager.getPlayerManager().getPlayerWithId(playerId);
        if(!player) return

        if(player && this.getChangesRemaning(playerId) > 0) {
            let upgrades = this.forge.forgeUpgrades.get(playerId)?.upgradeItems
            if(!upgrades) return console.log("No forge upgrades available")
            let selectedUpgrade = upgrades[choice]
            let success = this.selectUpgrade(playerId, selectedUpgrade)
            
            if(success){
                console.log('selected upgrade: ', selectedUpgrade.getUpgradeNode()?.data.name)
                if(this.getChangesRemaning(playerId) <= 0){
                    // Clear upgrades.
                    player.upgradeInfo.playerSelectedUpgrade();
                    // this.gameManager.getForgeManager().resetForgeUpgrades(playerId)
                }else{
                    // Remove only selected upgrade
                    player.upgradeInfo.removeUpgrade(selectedUpgrade)
                    player.upgradeInfo.incrementUpgradeCount()
                }
            }
        }
    }
}