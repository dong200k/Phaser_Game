import FileUtil from '../../../../util/FileUtil';
import SkillData from '../../schemas/Trees/Node/Data/SkillData';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import Node from '../../schemas/Trees/Node/Node';
import StatTree from '../../schemas/Trees/StatTree';
import Player from '../../schemas/gameobjs/Player';
import Stat from '../../schemas/gameobjs/Stat';

export default class SkillTreeManager{
    static singleton = new SkillTreeManager()
    private skillTrees: Map<string, StatTree<SkillData>> = new Map()

    constructor() {
        this.loadStatTrees()
    }   

    /**
     * Loads skill trees from assets/db.json
     */
    async loadStatTrees(){
        let db = await FileUtil.readJSONAsync("assets/db.json")
        let skillTrees = db.skills

        for (let [id, tree] of Object.entries(skillTrees)) {
            this.skillTrees.set(id, tree as StatTree<SkillData>)
        }
    }

    /**
     * Computes total stat a player's skill tree provides
     * @param playerState 
     */
    static getTotalStat(playerState: Player){
        let tree = playerState.skillTree
        let totalStats = Stat.getZeroStat()

        //dfs traversal to get stats that have been selected
        function dfs(root: Node<SkillData>){
            switch(root.data.status){
                case "selected":
                    // TODO add stat to total
                case "none":
                    return
            }
            
            for(let node of root.children){
                dfs(node)
            }
        }

        if(tree.root) dfs(tree.root)
    }

    // could make time complexity better
    static getAvailableUpgrades(playerState: Player){
        let tree = playerState.skillTree
        let root = tree.root
        if(!root) return

        let upgrades: Array<Node<SkillData>> = []

        //dfs traversal to get next upgrades
        function dfs(root: Node<SkillData>){
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
     * Selects/activates the upgrade of a player based on player's choice
     * @param playerState 
     * @param upgrades list of available upgrades to choose from
     * @param choice choice of upgrade, zero indexed
     */
    static selectUpgrade(playerState: Player, upgrades: Array<Node<SkillData>>, choice: number){
        if(choice < upgrades.length){
            let node = upgrades[choice]
            node.data.status = "selected"

            // ****TODO add upgrade to stat total
        }
    }


    /**
     * Sets the player's skill upgrade tree
     * @param playerState
     * @param root root node of skill tree to equip
     */
    static setWeaponUpgradeTree(playerState: Player, root: Node<SkillData>){
        let skillTree = playerState.skillTree
        skillTree.root = root
    }
}