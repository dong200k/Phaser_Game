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
        this.loadUpgrades()
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

    private createTreeFromUpgrade(upgrade: upgrade){
        let upgradeTree = new StatTree<WeaponData>
        
        function dfs(){
             
        }


    }

    /**
     * 
     * @returns returns a bow upgrade tree to be used by a single player
     */
    createBowUpgradeTree(){
        return this.createTreeFromUpgrade(this.upgrades.get("bow-upgrade") as upgrade)
    }

    getManager(){
        return WeaponUpgradeFactory.singleton
    }
}