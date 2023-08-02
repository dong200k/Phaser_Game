import SkillData from '../../schemas/Trees/Node/Data/SkillData';
import Node from '../../schemas/Trees/Node/Node';
import Player from '../../schemas/gameobjs/Player';
import TreeManager from './TreeManager';

export default class SkillTreeManager{

    /**
     * Takes in a player and a root of a skill tree, equips the root onto the player's skillTree and adds the stat bonuses
     * of the tree to the player.
     * @param playerState player who wants to equip the artifact
     * @param root root of skill tree to equip
     */
    static equipSkillTree(playerState: Player, root: Node<SkillData>){
        let skillTree = playerState.skillTree
        
        // Already equipped a skillTree
        if(skillTree.root) return
        
        // Equip the tree and update player/tree stats
        skillTree.root = root
        let totalStat = TreeManager.addTreeStatsToPlayer(playerState, skillTree)
        skillTree.totalStat = totalStat
        Object.entries(totalStat).forEach(([k,v])=>{
            console.log(k,v)
        })
    }

    /**
     * Takes in player and unequips their SkillTree and removes all of its stat effects it givess]
     * @param playerState player who is unequiping the SkillTree
     * @returns the root of the SkillTree that was unequipped, or undefined if there is no root
     */
    static unEquipSkillTree(playerState: Player){
        let skillTree = playerState.skillTree

        if(!skillTree.root) return

        TreeManager.removeTreeStats(playerState, skillTree)
        let root = skillTree.root
        skillTree.reset()

        return root
    }

    /**
     * Takes in player and swaps their current skillTree
     * @param playerState player who is swapping their skillTree
     * @param root root node of skill tree tree to switch to
     * @returns the root of the skilltree that was unequipped, or undefined if there is no root
     */
    static swapSkillTree(playerState: Player, root: Node<SkillData>){
        // Skill tree to swap is same as current one
        if(playerState.skillTree.root === root) return

        // A skill tree is already equipped so unequip it
        let oldRoot
        if(playerState.skillTree.root){
            oldRoot = SkillTreeManager.unEquipSkillTree(playerState)
        }
        
        // Equip new weapon
        SkillTreeManager.equipSkillTree(playerState, root)

        return oldRoot
    }

    /**
     * Selects and activates the upgrade of a player's skill tree based on player's choice. This will automatically add the tree's selected node's effects to the player.
     * @param playerState player who is selecting the upgrade
     * @param upgrades list of available upgrades to choose from.
     * @param choice choice of upgrade, zero indexed non negative integer
     */
    static selectUpgrade(playerState: Player, upgrades: Node<SkillData>[], choice: number){
        TreeManager.selectUpgrade(playerState, playerState.skillTree, upgrades, choice)
    }

    /**
    * Takes in a player and returns their SkillTree's next available upgrades
    * @param playerState player who wants to view their skill tree upgrades
    * @returns a list of skill tree's available upgrades
    */
   static getAvailableUpgrades(playerState: Player){
    return TreeManager.getAvailableUpgrades(playerState.skillTree)
   }

    /**
     * Takes in a player and gets the total stats the skill tree provides based on selected upgrades.
     * @param tree
     * @returns returns a Stat class with the tree's total stats, do not modify
     */
    static getTotalStat(playerState: Player){
        return TreeManager.getTotalStat(playerState.skillTree)
    }
}