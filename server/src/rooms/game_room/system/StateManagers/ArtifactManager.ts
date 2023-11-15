import { ObjectPool } from '../../../../util/PoolUtil';
import SkillData from '../../schemas/Trees/Node/Data/SkillData';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import StatTree from '../../schemas/Trees/StatTree';
import WeaponUpgradeTree from '../../schemas/Trees/WeaponUpgradeTree';
import Player from '../../schemas/gameobjs/Player';
import GameManager from '../GameManager';
import TreeManager from './TreeManager';

export default class ArtifactManager{

    /** Maxmimum number of artifacts a player can have equipped at one time */
    static MAX_ARTIFACT_COUNT = 100
    /** Empty Artifact trees that get initialized when game starts*/
    static INITIAL_ARTIFACT_TREE_COUNT = 20
    /** Pool of artifacts that don't have a root */
    private artifactTreePool: ObjectPool<WeaponUpgradeTree>

    private gameManager: GameManager

    constructor(gameManager: GameManager){
        this.gameManager = gameManager
        this.artifactTreePool = new ObjectPool(new WeaponUpgradeTree())
        for(let i=1; i<=ArtifactManager.INITIAL_ARTIFACT_TREE_COUNT; i++){
            this.addArtifactToPool()
        }
    }

    private addArtifactToPool(){
        let tree = new WeaponUpgradeTree()
        tree.setGameManager(this.gameManager)
        this.artifactTreePool.returnInstance(tree)
    }

    /**
     * Takes in a player and a artifact upgrade tree's root. Equips the root onto one of the player's empty artifact trees if 
     * they do not already have the maximum amount of artifacts. Once the artifact is equipped, all of the artifact's selected 
     * effects and stat bonuses will also be applied to the player by this function.
     * Note: if the tree already has selected nodes, UpgradeEffects will be selected how they were selected by the player. 
     * @param playerState player who wants to equip the artifact
     * @param root root of artifact upgrade tree to equip
     * @returns the artifact tree if it is equiped else false
     */
    public equipArtifact(playerState: Player, root: Node<WeaponData>){
        if(!root) throw new Error(`Error equiping artifact: ${root}`)
        let artifacts = playerState.artifacts

        // Check that player does not already have the maximum amount of artifacts
        if(artifacts.length >= ArtifactManager.MAX_ARTIFACT_COUNT) {
            console.log(`Artifact ${root.data.name} will not be equipped. Player ${playerState.name} already has the maximum number of artifacts equipped.`)
            return false
        }

        // Get new Artifact tree instance and initialize the root with the artifact we are equipping
        if(this.artifactTreePool.length() === 0) this.addArtifactToPool()
        let artifactTree = this.artifactTreePool.getInstance()
        artifactTree.root = root

        // Apply artifacts effects to player
        let totalStat = TreeManager.addTreeStatsToPlayer(playerState, artifactTree)
        TreeManager.addTreeUpgradeEffectsToPlayer(playerState, artifactTree)
        
        let weaponId = TreeManager.getWeaponId(artifactTree)
        TreeManager.setTreeWeapon(artifactTree, weaponId)
        artifactTree.setGameManager(this.gameManager)
        
        // Set total stat as computed total stat
        artifactTree.totalStat = totalStat

        // Add this artifact to the player
        artifacts.push(artifactTree)
        artifactTree.setOwner(playerState)

        console.log(`Equiping artifact: ${artifactTree.root.data.name}`)

        // playerState.effects.forEach(e=>console.log(e.toString() + '\n'))
        return artifactTree
    }

    /**
     * Takes in a player and artifactTree and removes the artifactTree from the player, resets it, and returns it to the artifactPool
     * @param playerState player who wants to unequip an artifact
     * @param artifactTree artifact tree to unequip
     */
    public unEquipArtifact(playerState: Player, artifactTree: WeaponUpgradeTree){
        console.log(`Unequiping artifact: ${artifactTree.root?.data.name}`)
        // Remove stat effects from player
        TreeManager.removeTreeStats(playerState, artifactTree)
        
        // Remove all upgrade effects that are active from player
        TreeManager.removeTreeUpgradeEffects(playerState, artifactTree)
        
        // Remove artifactTree from player
        playerState.artifacts = playerState.artifacts.filter(tree=> tree !== artifactTree)

        // Reset the artifact tree and send it to the object pool for reuse
        this.artifactTreePool.returnInstance(artifactTree.reset())
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
     * Takes in a WeaponUpgradeTree (artifact) and returns the list of available upgrades in the tree.
     * @param tree to get upgrades from
     * @returns a list of available upgrades
     */
    static getAvailableUpgrades <T extends WeaponUpgradeTree, U extends Exclude<T["root"], undefined>>
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
    static selectUpgrade<T extends WeaponUpgradeTree|StatTree<SkillData>, U extends Exclude<T["root"], undefined>>
    (playerState: Player, artifact: T, upgrades: U[], choice: number){
        return TreeManager.selectUpgrade(playerState, artifact, upgrades, choice)
    }
}