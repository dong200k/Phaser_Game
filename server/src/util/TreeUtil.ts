import SkillData from "../rooms/game_room/schemas/Trees/Node/Data/SkillData"
import WeaponData from "../rooms/game_room/schemas/Trees/Node/Data/WeaponData"
import Node from "../rooms/game_room/schemas/Trees/Node/Node"
import StatTree from "../rooms/game_room/schemas/Trees/StatTree"
import WeaponUpgradeTree from "../rooms/game_room/schemas/Trees/WeaponUpgradeTree"
import Player from "../rooms/game_room/schemas/gameobjs/Player"
import Stat from "../rooms/game_room/schemas/gameobjs/Stat"
import WeaponManager from "../rooms/game_room/system/StateManagers/WeaponManager"

export default class TreeUtil{
    /**
     * Takes in a weapon or skill tree and computes the total stats the tree provides based on selected upgrades
     * @param tree
     * @returns 
     */
    static getTotalTreeStat(tree: WeaponUpgradeTree | StatTree<SkillData>){
        let totalStats = Stat.getZeroStat()

        //dfs traversal to get stats that have been selected
        function dfs(root: Node<WeaponData> | Node<SkillData>){
            switch(root.data.status){
                case "selected":
                    totalStats = Stat.add(totalStats, root.data.stat)
                    break
                case "none":
                    return
            }
            
            for(let node of root.children){
                dfs(node)
            }
        }

        if(tree.root) dfs(tree.root)

        return totalStats
    }

    // could make time complexity better
    static getAvailableUpgrades(tree: WeaponUpgradeTree | StatTree<SkillData>){
        let root = tree.root
        if(!root) return []

        let upgrades: Array<Node<WeaponData> | Node<SkillData>> = []
        //dfs traversal to get next upgrades
        function dfs(root: Node<WeaponData> | Node<SkillData>){
            if(root.data.status === "none")
                return upgrades.push(root)

            for(let node of root.children){
                dfs(node)
            }
        }

        dfs(root)
        return upgrades
    }

    /**
     * Selects/activates the upgrade of a player based on player's choice.
     * @param playerState 
     * @param upgrades list of available upgrades to choose from
     * @param choice choice of upgrade, zero indexed non negative integer
     */
    static selectUpgrade(playerState: Player, upgrades: Array<Node<WeaponData> | Node<SkillData>>, choice: number){
        if(choice < upgrades.length){
            //Select upgrade
            let selectedUpgrade = upgrades[choice]
            selectedUpgrade.data.setStatus("selected")
            
            // Mark upgrades on the same level as skipped if its a weapon upgrade tree
            if(upgrades[0].data instanceof WeaponData){
                upgrades.forEach((upgrade, i)=>{
                    if(i!==choice) upgrade.data.setStatus("skipped")
                })

                // Change base weapon if node has a weaponId
                let data = selectedUpgrade.data as WeaponData
                let weaponId = data.weaponId
                if(weaponId) WeaponManager.setCurrentWeapon(playerState, weaponId)
            }
            
            // for weapon/artifact upgrade trees add attack/artifact effects to the effect manager
            if(upgrades[0].data instanceof WeaponData){

            }

            
            // ****TODO add upgrade to stat total
        }
    }
}