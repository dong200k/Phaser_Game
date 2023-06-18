import { ObjectPool } from '../../../../util/PoolUtil';
import TreeUtil from '../../../../util/TreeUtil';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import WeaponUpgradeTree from '../../schemas/Trees/WeaponUpgradeTree';
import Player from '../../schemas/gameobjs/Player';

export default class ArtifactManager{

    /** Maxmimum number of artifacts a player can have equipped at one time */
    static MAX_ARTIFACT_COUNT = 10
    /** Empty Artifact trees that get initialized when game starts*/
    static INITIAL_ARTIFACT_TREE_COUNT = 20
    /** Pool of artifacts that don't have a root */
    static artifactTreePool: ObjectPool<WeaponUpgradeTree>

    /** Initialize artifact pool with INITIAL_ARTIFACT_TREE_COUNT many empty aritfact tree*/
    static preload(){
        ArtifactManager.artifactTreePool = new ObjectPool(new WeaponUpgradeTree())
        for(let i=1; i<ArtifactManager.INITIAL_ARTIFACT_TREE_COUNT; i++){
            ArtifactManager.artifactTreePool.returnInstance(new WeaponUpgradeTree())
        }
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
    static equipArtifact(playerState: Player, root: Node<WeaponData>){
        let artifacts = playerState.artifacts

        // Check that player does not already have the maximum amount of artifacts
        if(artifacts.length >= ArtifactManager.MAX_ARTIFACT_COUNT) return false

        // Get new Artifact tree instance and initialize the root with the artifact we are equipping
        let artifactTree = ArtifactManager.artifactTreePool.getInstance()
        artifactTree.root = root

        // Apply artifacts effects to player
        let totalStat = TreeUtil.addTreeStatsToPlayer(playerState, artifactTree)
        TreeUtil.addTreeUpgradeEffectsToPlayer(playerState, artifactTree)
        
        let weaponId = TreeUtil.getWeaponId(artifactTree)
        TreeUtil.setTreeWeapon(artifactTree, weaponId)

        // Set total stat as computed total stat
        artifactTree.totalStat = totalStat

        // Add this artifact to the player
        artifacts.push(artifactTree)
        artifactTree.setOwner(playerState)

        return artifactTree
    }

    /**
     * Takes in a player and artifactTree and removes the artifactTree from the player, resets it, and returns it to the artifactPool
     * @param playerState player who wants to unequip an artifact
     * @param artifactTree artifact tree to unequip
     */
    static unEquipArtifact(playerState: Player, artifactTree: WeaponUpgradeTree){
        // Remove stat effects from player
        TreeUtil.removeTreeStats(playerState, artifactTree)
        
        // Remove all upgrade effects that are active from player
        TreeUtil.removeTreeUpgradeEffects(playerState, artifactTree)
        
        // Remove artifactTree from player
        playerState.artifacts = playerState.artifacts.filter(tree=> tree !== artifactTree)

        // Reset the artifact tree and send it to the object pool for reuse
        ArtifactManager.artifactTreePool.returnInstance(artifactTree.reset())
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
}