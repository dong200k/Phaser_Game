import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import Player from '../../schemas/gameobjs/Player';
import TreeManager from './TreeManager';

export default class WeaponManager{
    
    /**
     * Takes in player and root of a WeaponUpgradeTree equips the tree onto the player and also adds whatever effects the tree has
     * onto the player.
     * @param playerState player who is equiping the WeaponUpgradeTree
     * @param root root node of weapon upgrade tree to equip
     */
    static equipWeaponUpgrade(playerState: Player, root: Node<WeaponData>){
        // Already equipped a weapon
        if(playerState.weaponUpgradeTree.root) return
        
        playerState.weaponUpgradeTree.root = root
        let totalStat = TreeManager.addTreeStatsToPlayer(playerState, playerState.weaponUpgradeTree)
        TreeManager.addTreeUpgradeEffectsToPlayer(playerState, playerState.weaponUpgradeTree)
        
        let weaponId = TreeManager.getWeaponId(playerState.weaponUpgradeTree)
        TreeManager.setTreeWeapon(playerState.weaponUpgradeTree, weaponId)

        // Set total stat as computed total stat
        playerState.weaponUpgradeTree.totalStat = totalStat

        playerState.weaponUpgradeTree.setOwner(playerState)
    }

    /**
     * Takes in player and unequips their WeaponUpgradeTree and removes the stat/upgrade effects the tree gives
     * @param playerState player who is unequiping the WeaponUpgradeTree
     * @returns the root of the weaponUpgradeTree that was unequipped, or undefined if there is no root
     */
    static unEquipWeaponUpgrade(playerState: Player){
        if(!playerState.weaponUpgradeTree.root) return
        TreeManager.removeTreeStats(playerState, playerState.weaponUpgradeTree)
        TreeManager.removeTreeUpgradeEffects(playerState, playerState.weaponUpgradeTree)
        let root = playerState.weaponUpgradeTree.root
        playerState.weaponUpgradeTree.reset()
        return root
    }

    /**
     * Takes in player and swaps their current weaponUpgradeTree
     * @param playerState player who is unequiping their WeaponUpgradeTree
     * @param root root node of weapon upgrade tree to switch to
     * @returns the root of the weaponUpgradeTree that was unequipped, or undefined if there is no root
     */
    static swapWeaponUpgrade(playerState: Player, root: Node<WeaponData>){
        // Weapon to swap is same as current weapon
        if(playerState.weaponUpgradeTree.root === root) return

        // A weapon is already equipped so unequip it
        let oldRoot
        if(playerState.weaponUpgradeTree.root){
            oldRoot = WeaponManager.unEquipWeaponUpgrade(playerState)
        }
        
        // Equip new weapon
        this.equipWeaponUpgrade(playerState, root)

        return oldRoot
    }

    /**
     * Selects and activates the upgrade of a player's weapon upgrade tree based on player's choice. This will automatically add the tree's selected node's effects to the player.
     * Note: WeaponUpgradeTree covers artifact and weapon tree while StatTree<SkillData> covers the skill tree. The type of a upgrade is deterimined by whether we use WeaponUpgradeTree or StatTree<SkillData>.
     * @param playerState player who is selecting the upgrade
     * @param upgrades list of available upgrades to choose from.
     * @param choice choice of upgrade, zero indexed non negative integer
     */
    static selectUpgrade(playerState: Player, upgrades: Node<WeaponData>[], choice: number){
        TreeManager.selectUpgrade(playerState, playerState.weaponUpgradeTree, upgrades, choice)
    }

    /**
    * Takes in a player and returns their WeaponUpgradeTree's next available upgrades
    * @param playerState player who wants to view their weapon tree upgrades
    * @returns a list of WeaponUpgradeTree's available upgrades
    */
   static getAvailableUpgrades(playerState: Player){
    return TreeManager.getAvailableUpgrades(playerState.weaponUpgradeTree)
   }

    /**
     * Takes in a player and gets the total stats the weapon tree provides based on selected upgrades.
     * @param tree
     * @returns returns a Stat class with the tree's total stats, do not modify
     */
    static getTotalStat(playerState: Player){
        return TreeManager.getTotalStat(playerState.weaponUpgradeTree)
    }
}