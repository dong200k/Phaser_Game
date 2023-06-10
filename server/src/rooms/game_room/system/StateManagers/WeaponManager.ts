import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import Player from '../../schemas/gameobjs/Player';

export default class WeaponManager{
    /**
     * Sets the base weapon the player is equiping
     * @param playerState
     * @param weaponId id for the new base weapon to equip
     */
    static setCurrentWeapon(playerState: Player, weaponId: string){
        playerState.weaponUpgradeTree.setWeapon(weaponId)
    }   

    /**
     * Sets the player's weapon upgrade tree with root
     * @param playerState
     * @param root root node of weapon upgrade tree to equip
     */
    static setWeaponUpgradeTree(playerState: Player, root: Node<WeaponData>){
        let weaponTree = playerState.weaponUpgradeTree
        weaponTree.root = root
        
        if(root.data.weaponId){
            WeaponManager.setCurrentWeapon(playerState, root.data.weaponId)
        }

        // Select this upgrade by default
        root.data.setStatus("selected")
    }
}