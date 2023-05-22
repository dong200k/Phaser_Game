import FileUtil from "../../../../../util/FileUtil"
import SkillData from "../../../schemas/Trees/Node/Data/SkillData"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import StatTree from "../../../schemas/Trees/StatTree"
import Stat from "../../../schemas/gameobjs/Stat"

type upgrade = {
    id: string,
    upgradeName: string,
    root: Node<WeaponData>
}
export default class WeaponUpgradeFactory{
    static singleton = new WeaponUpgradeFactory()
    private upgrades: Map<string, upgrade> = new Map()

    /**
     * Loads weapon upgrades from db.json
     */
    async loadUpgrades(){
        let db = await FileUtil.readJSONAsync("assets/db.json")
        for (let upgrade of db.upgrades) {
            this.upgrades.set(upgrade.id, upgrade)
        }
    }

    /**
     * Creates a Node class from a single node from an upgrade from db formatted as a json (does not copy children)
     * @param copy single node from an upgrade in db.json formatted as json
     * @returns 
     */
    private static createNode(copy: Node<WeaponData>){
        let {weaponId, name, description, stat} = copy.data
        stat = new Stat(stat)
        let weaponData = new WeaponData(weaponId, stat, name, description)
        let node = new Node<WeaponData>(weaponData)

        return node
    }

    /**
     * Creates a Node and its children with data from database upgrade
     * @param id id of upgrade from database to create Node from 
     * @returns
     */
    static createUpgrade(id: string, selectRoot: boolean = true){
        let upgrade = WeaponUpgradeFactory.getManager().upgrades.get(id)
        if(!upgrade) return

        let root = WeaponUpgradeFactory.createNode(upgrade.root)
        
        // Takes in a Node class and a db.json nodeToCopy.
        // creates class Nodes from all the children of nodeToCopy(deep copy including children's children etc.) and add to the Node Class
        function dfs(node: Node<WeaponData>, nodeToCopy: Node<WeaponData>){
            nodeToCopy.children.forEach((childToCopy, i)=>{
                // Create Node class from children of nodeToCopy
                let child = WeaponUpgradeFactory.createNode(childToCopy)
                node.children.push(child)

                // Copy the childToCopy's children/descendants also
                dfs(child, childToCopy)
            })
        }

        dfs(root, upgrade.root)

        //select the root node
        if(selectRoot) root.data.setStatus("selected")

        return root
    }

    /**
     * 
     * @returns returns a bow upgrade tree's root to be used by a single player
     */
    static createBowUpgrade(){
        return WeaponUpgradeFactory.createUpgrade('1')
    }

    /**
     * 
     * @returns returns a sword upgrade tree's root to be used by a single player
     */
    static createSwordUpgrade(){
        return WeaponUpgradeFactory.createUpgrade('2')
    }

    static getManager(){
        return WeaponUpgradeFactory.singleton
    }
}