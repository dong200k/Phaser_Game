import TreeUtil from '../../../../util/TreeUtil';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import Player from '../../schemas/gameobjs/Player';

export default class WeaponManager{
    /**
     * Takes in player and root of a WeaponUpgradeTree equips the tree onto the player and also adds whatever effects the tree has
     * onto the player.
     * @param playerState player who is equiping the WeaponUpgradeTree
     * @param root root node of weapon upgrade tree to equip
     */
    static equipWeaponUpgrade(playerState: Player, root: Node<WeaponData>){
        // Already equipped a weapon
        if(playerState.weaponUpgradeTree.root){
            // Equip weapon is what we are trying to equip
            if(playerState.weaponUpgradeTree.root === root) return

            WeaponManager.unEquipWeaponUpgrade(playerState)
        }
        
        playerState.weaponUpgradeTree.root = root
        playerState.weaponUpgradeTree.setOwner(playerState)
        
        // Select this upgrade by default
        TreeUtil.selectUpgrade(playerState, playerState.weaponUpgradeTree, [root], 0)
    }

    /**
     * Takes in player and unequips their WeaponUpgradeTree
     * @param playerState player who is unequiping the WeaponUpgradeTree
     */
    static unEquipWeaponUpgrade(playerState: Player){
        playerState.weaponUpgradeTree.reset()
        return 
    }

    /**
     * Selects and activates the upgrade of a player's weapon upgrade tree based on player's choice. This will automatically add the tree's selected node's effects to the player.
     * Note: WeaponUpgradeTree covers artifact and weapon tree while StatTree<SkillData> covers the skill tree. The type of a upgrade is deterimined by whether we use WeaponUpgradeTree or StatTree<SkillData>.
     * @param playerState player who is selecting the upgrade
     * @param upgrades list of available upgrades to choose from.
     * @param choice choice of upgrade, zero indexed non negative integer
     */
    static selectUpgrade(playerState: Player, upgrades: Node<WeaponData>[], choice: number){
        TreeUtil.selectUpgrade(playerState, playerState.weaponUpgradeTree, upgrades, choice)
    }

    /**
    * Takes in a player and returns their WeaponUpgradeTree's next available upgrades
    * @param playerState player who wants to view their weapon tree upgrades
    * @returns a list of WeaponUpgradeTree's available upgrades
    */
   static getAvailableUpgrades(playerState: Player){
    return TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
   }

    /**
     * Takes in a player and gets the total stats the tree provides based on selected upgrades.
     * @param tree
     * @returns returns a Stat class with the trees total stats, do not modify
     */
    static getTotalStat(playerState: Player){
        return TreeUtil.getTotalStat(playerState.weaponUpgradeTree)
    }
}