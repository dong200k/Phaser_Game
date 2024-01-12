import { ObjectPool } from '../../../../util/PoolUtil';
import Artifact from '../../schemas/Trees/Artifact';
import SkillData from '../../schemas/Trees/Node/Data/SkillData';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import StatTree from '../../schemas/Trees/StatTree';
import Player from '../../schemas/gameobjs/Player';
import GameManager from '../GameManager';
import WeaponUpgradeFactory from '../UpgradeTrees/factories/WeaponUpgradeFactory';
import { upgrade } from '../interfaces';
import TreeManager from './TreeManager';

export default class ArtifactManager{

    /** Maxmimum number of artifacts a player can have equipped at one time */
    static MAX_ARTIFACT_COUNT = 100
    /** Empty Artifact trees that get initialized when game starts*/
    static INITIAL_ARTIFACT_TREE_COUNT = 20
    /** Pool of artifacts that don't have a root */
    private artifactPool: ObjectPool<Artifact>

    private gameManager: GameManager

    constructor(gameManager: GameManager){
        this.gameManager = gameManager
        this.artifactPool = new ObjectPool(new Artifact())
        for(let i=1; i<=ArtifactManager.INITIAL_ARTIFACT_TREE_COUNT; i++){
            this.addArtifactToPool()
        }
    }

    private addArtifactToPool(){
        let tree = new Artifact()
        tree.setGameManager(this.gameManager)
        this.artifactPool.returnInstance(tree)
    }

    /**
     * Creates a new artifact. The artifact will have the id
     * of the provided upgradeId.
     * @param upgradeId The Id of the upgrade tree
     * that this artifact will use.
     */
    public createArtifact(upgradeId: string) {
        let upgrade = WeaponUpgradeFactory.createUpgrade(upgradeId) as upgrade;
        let upgradeTree = upgrade?.root
        if(!upgradeTree) {
            throw new Error(`Error: Upgrade Tree with Id ${upgradeId} does not exist`);
        }
        // Get new Artifact tree instance and initialize the root with the artifact we are equipping
        if(this.artifactPool.length() === 0) this.addArtifactToPool()
        let artifact = this.artifactPool.getInstance()
        artifact.root = upgradeTree;
        artifact.setId(upgradeId);
        artifact.name = upgrade.name ?? "";
        artifact.description = upgrade.description ?? "";
        artifact.imageKey = upgrade.imageKey ?? "";
        artifact.usage = upgrade.usage ?? "";

        // Set the artifacts level
        let curr = upgradeTree;
        let level = 0;
        while(curr) {
            if(curr.data.status === "selected") {
                level++;
            }
            curr = curr.children[0];
        }
        artifact.artifactLevel = level;

        return artifact;
    }

    /**
     * Max the level of an artifact.
     * @param artifact The artifact.
     */
    public maxArtifact(artifact: Artifact) {
        while(ArtifactManager.upgradeArtifact(artifact)) {
            // Loop until upgrade ends.
        }
    }

    /**
     * Takes in a player and a artifact upgrade tree's root. Equips the root onto one of the player's empty artifact trees if 
     * they do not already have the maximum amount of artifacts. Once the artifact is equipped, all of the artifact's selected 
     * effects and stat bonuses will also be applied to the player by this function.
     * Note: if the tree already has selected nodes, UpgradeEffects will be selected how they were selected by the player. 
     * @param playerState player who wants to equip the artifact
     * @param root root of artifact upgrade tree to equip. Or the actual artifact.
     * @returns the artifact tree if it is equiped else false
     */
    public equipArtifact(playerState: Player, root: Node<WeaponData> | Artifact){
        if(root instanceof Artifact) {
            return this.equipArtifactHelper(playerState, root);
        } else {
            console.log("WARNING: equiping an artifact with Node<WeaponData> is deprecated. Please create an artifact using createArtifact then call equipArtifact.");
        }

        if(!root) throw new Error(`Error equiping artifact: ${root}`)
        let artifacts = playerState.artifacts

        // Check that player does not already have the maximum amount of artifacts
        if(artifacts.length >= ArtifactManager.MAX_ARTIFACT_COUNT) {
            console.log(`Artifact ${root.data.name} will not be equipped. Player ${playerState.name} already has the maximum number of artifacts equipped.`)
            return false
        }

        // Get new Artifact tree instance and initialize the root with the artifact we are equipping
        if(this.artifactPool.length() === 0) this.addArtifactToPool()
        let artifact = this.artifactPool.getInstance()
        artifact.root = root
        artifact.name = root.data.name;
        artifact.description = root.data.description;
        // artifact.setId(root.id);

        // Set the artifacts level
        let curr = root;
        let level = 0;
        while(curr) {
            if(curr.data.status === "selected") {
                level++;
            }
            curr = curr.children[0];
        }
        artifact.artifactLevel = level;

        // Apply artifacts effects to player
        let totalStat = TreeManager.addTreeStatsToPlayer(playerState, artifact)
        TreeManager.addTreeUpgradeEffectsToPlayer(playerState, artifact)
        
        let weaponId = TreeManager.getWeaponId(artifact)
        TreeManager.setTreeWeapon(artifact, weaponId)
        artifact.setGameManager(this.gameManager)
        
        // Set total stat as computed total stat
        artifact.totalStat = totalStat

        // Add this artifact to the player
        artifacts.push(artifact)
        artifact.setOwner(playerState)

        console.log(`Equiping artifact: ${artifact.root.data.name}`)

        // playerState.effects.forEach(e=>console.log(e.toString() + '\n'))
        return artifact;
    }

    private equipArtifactHelper(playerState: Player, artifact: Artifact) {
        let root = artifact.root;
        if(!root) {
            throw new Error(`Error equiping artifact. Artifact has no root`);
        }

        let artifacts = playerState.artifacts
        // Check that player does not already have the maximum amount of artifacts
        if(artifacts.length >= ArtifactManager.MAX_ARTIFACT_COUNT) {
            console.log(`Artifact ${root.data.name} will not be equipped. Player ${playerState.name} already has the maximum number of artifacts equipped.`)
            return false
        }

        // Apply artifacts effects to player
        let totalStat = TreeManager.addTreeStatsToPlayer(playerState, artifact)
        TreeManager.addTreeUpgradeEffectsToPlayer(playerState, artifact)
        
        let weaponId = TreeManager.getWeaponId(artifact)
        TreeManager.setTreeWeapon(artifact, weaponId)
        artifact.setGameManager(this.gameManager)
        
        // Set total stat as computed total stat
        artifact.totalStat = totalStat

        // Add this artifact to the player
        artifacts.push(artifact)
        artifact.setOwner(playerState)

        console.log(`Equiping artifact: ${root.data.name}`)
        return artifact;
    }

    /**
     * Takes in a player and artifact and removes the artifact from the player, resets it, and returns it to the artifactPool
     * @param playerState player who wants to unequip an artifact
     * @param artifact artifact to unequip
     */
    public unEquipArtifact(playerState: Player, artifact: Artifact){
        console.log(`Unequiping artifact: ${artifact.root?.data.name}`)
        // Remove stat effects from player
        TreeManager.removeTreeStats(playerState, artifact)
        
        // Remove all upgrade effects that are active from player
        TreeManager.removeTreeUpgradeEffects(playerState, artifact)
        
        // Remove artifact from player
        playerState.artifacts = playerState.artifacts.filter(tree=> tree !== artifact)

        // Reset the artifact tree and send it to the object pool for reuse
        this.artifactPool.returnInstance(artifact.reset())
    }
    
    /**
     * Takes in a artifact tree and selects all of its upgrades in order of root to the leaf.
     * Note: artifacts have one branch so the selection order is predetermined for all users unlike weapons.
     * @param artifact 
     */
    static selectAllUpgrades(artifact: Node<WeaponData>){
        let curr = artifact
        while(curr){
            curr.data.setStatus("selected")
            curr = curr.children[0]
        }
    }

    /**
     * Upgrades the given artifact.
     * @param artifact The artifact to upgrade.
     * @returns True if the upgrade was successful. False otherwise.
     */
    static upgradeArtifact(artifact: Artifact) {
        if(!this.hasNextUpgrade(artifact))
            return false;
        // If the artifact is equiped already.
        if(artifact.owner) {
            let availableUpgrades = ArtifactManager.getAvailableUpgrades(artifact);
            ArtifactManager.selectUpgrade(artifact.owner, artifact, availableUpgrades, 0);
            artifact.artifactLevel++;
        } else {
            ArtifactManager.selectNextUpgrade(artifact);
        }
        return true;
    }

    /**
     * Helper method for upgradeArtifact. Upgrades the artifact without 
     * applying its effects to its owner (player).
     * @param artifact The artifact.
     */
    private static selectNextUpgrade(artifact: Artifact) {
        let node = artifact.root;
        while(node) {
            if(node.data.status === "none") {
                node.data.status = "selected";
                artifact.artifactLevel++;
            }
            node = node.children[0];
        }
    }

    /**
     * Checks if an artifact tree has anymore upgrades (if there are any nodes with status 'none'). 
     * @param artifact The artifact tree.
     * @returns True if there are more upgrades. False otherwise.
     */
    static  hasNextUpgrade(artifact: Artifact) {
        let node = artifact.root;
        let hasNextUpgrade = false;
        while(node) {
            if(node.data.status === "none")
                hasNextUpgrade = true;
            if(node.children.length > 0) node = node.children[0];
            else break;
        }
        return hasNextUpgrade;
    } 

    /**
     * Takes in a WeaponUpgradeTree (artifact) and returns the list of available upgrades in the tree.
     * @param tree to get upgrades from
     * @returns a list of available upgrades
     */
    static getAvailableUpgrades <T extends Artifact, U extends Exclude<T["root"], undefined>>
    (artifact: T): U[]{
        return TreeManager.getAvailableUpgrades(artifact)
    }

    /**
     * Selects and activates the upgrade of a player's tree (skill or weapon/artifact) based on player's choice.  This will automatically add the tree's selected node's effects to the player.
     * Note: WeaponUpgradeTree covers artifact and weapon tree while StatTree<SkillData> covers the skill tree. The type of a upgrade is deterimined by whether we use WeaponUpgradeTree or StatTree<SkillData>.
     * @param playerState player who is selecting the upgrade
     * @param artifact artifact tree
     * @param upgrades list of available upgrades to choose from.
     * @param choice choice of upgrade, zero indexed non negative integer
     */
    static selectUpgrade<T extends Artifact|StatTree<SkillData>, U extends Exclude<T["root"], undefined>>
    (playerState: Player, artifact: T, upgrades: U[], choice: number){
        return TreeManager.selectUpgrade(playerState, artifact, upgrades, choice)
    }

    /**
     * 
     * @param player 
     * @param artifactId
     * @returns the true if the player already has the artifact else false
     */
    static hasArtifact(player: Player, artifactId: string){
        for(let artifact of player.artifacts){
            if(artifact.getId() === artifactId){
                return true
            }
        }

        return false
    }
}