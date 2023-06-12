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
    }
}