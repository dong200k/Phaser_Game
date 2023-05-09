import FileUtil from "../../../../../util/FileUtil"
import SkillData from "../../../schemas/Trees/Node/Data/SkillData"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import StatTree from "../../../schemas/Trees/StatTree"

type upgrade = {
    id: string,
    upgradeName: string,
    root: Node<WeaponData>
}
export default class WeaponUpgradeFactory{
    static singleton = new WeaponUpgradeFactory()
    private upgrades: Map<string, upgrade> = new Map()

    constructor(){
    }

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
     * Creates a Node with data from database upgrade
     * @param id id of upgrade from database to create Node from 
     * @returns
     */
    static createUpgrade(id: string){
        let upgrade = WeaponUpgradeFactory.getManager().upgrades.get(id)

        if(!upgrade) return

        let root = new Node<WeaponData>(upgrade.root.data)
        
        // copy upgrade's data and children into StatTree
        function dfs(node: Node<WeaponData>, nodeToCopy: Node<WeaponData>){
            nodeToCopy.children.forEach(childToCopy=>{
                let child = new Node<WeaponData>({...childToCopy.data} as WeaponData)
                node.children.push(child)

                dfs(child, childToCopy)
            })
        }

        dfs(root, upgrade.root)
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