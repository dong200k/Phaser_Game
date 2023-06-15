import FileUtil from "../../../../util/FileUtil"
import { skillTree, upgrade, weapon } from "../interfaces"

export default class DatabaseManager{
    static singleton = new DatabaseManager()

    private weaponUpgrades: Map<string, upgrade> = new Map()
    private artifactUpgrades: Map<string, upgrade> = new Map()
    private weapons: Map<string, weapon> = new Map()
    private skillTrees: Map<string, skillTree> = new Map()


    /**
     * Loads weapon upgrades, artifact upgrades, and weapons from server/assets/db.json
     */
    async loadData(){
        try {
            let db = await FileUtil.readJSONAsync("assets/db.json")

            //Load artifact and weapon upgrades
            for (let upgrade of db.upgrades) {
                if(upgrade.type === "weapon"){
                    this.weaponUpgrades.set(upgrade.id, upgrade)
                }else{
                    this.artifactUpgrades.set(upgrade.id, upgrade)
                }
            }

            //Load skill trees
            for (let skillTree of db.skills) {
                this.skillTrees.set(skillTree.id, skillTree)
            }

            //Load weapons
            for (let weapon of db.skills) {
                this.weapons.set(weapon.id, weapon)
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }

    static getManager(){
        return DatabaseManager.singleton
    }

    /**
     * Returns json object with basic weapon information such as name, description, sprite, projectile, etc based on the weaponId parameter.
     * @param weaponId 
     * @returns 
     */
    getWeapon(weaponId: string){
        return DatabaseManager.getManager().weapons.get(weaponId)
    }

    /**
     * Returns json object with skill tree information based on id
     * @param id id of skill tree to retrieve, look at the my-app frontend to get ids
     * @returns 
     */
    getSkill(id: string){
        return DatabaseManager.getManager().skillTrees.get(id)
    }

    /**
     * Returns json object with artifact upgrade tree information based on id
     * @param id id of artifact upgrade tree to retrieve, look at the my-app frontend to get ids
     * @returns 
     */
    getArtifactUpgrade(id: string){
        return DatabaseManager.getManager().artifactUpgrades.get(id)
    }

    /**
     * Returns json object with weapon upgrade tree information based on id
     * @param id id of weapon upgrade tree to retrieve, look at the my-app frontend to get ids
     * @returns 
     */
    getWeaponUpgrade(id: string){
        return DatabaseManager.getManager().weaponUpgrades.get(id)
    }

    /**
     * Returns json object with either weapon or artifact upgrade tree information based on id
     * @param id id of weapon/artifact upgrade tree to retrieve, look at the my-app frontend to get ids
     */
    getUpgrade(id: string){
        let weaponUpgradeTree = DatabaseManager.getManager().getWeaponUpgrade(id)
        let artifactUpgradeTree = DatabaseManager.getManager().getArtifactUpgrade(id)

        if(weaponUpgradeTree) return weaponUpgradeTree
        else return artifactUpgradeTree
    }
    
}


