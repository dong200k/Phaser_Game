import FileUtil from "../util/fileutil"
import { IAbility, IRole, skillTree, upgrade, weapon } from "../../../server/src/rooms/game_room/system/interfaces"

export type IColNames = "skills" | "abilities" | "roles" | "weapons" | "upgrades" | "nodes"

/** */
export default class JsonDatabaseManager{

    static singleton = new JsonDatabaseManager()

    private skillTrees: Map<string, skillTree> = new Map()
    private abilities: Map<string, IAbility> = new Map()
    private roles: Map<string, IRole> = new Map()
    private weapons: Map<string, weapon> = new Map()
    private ugprades: Map<string, upgrade> = new Map()
    private nodes: Map<string, any> = new Map()

    /**
     * Loads weapon upgrades, artifact upgrades, and weapons from server/assets/db.json
     */
    async loadData(){
        try {
            let db = await FileUtil.readJSONAsync("assets/db.json")

            //Load skill trees
            for (let skillTree of db.skills) {
                this.skillTrees.set(skillTree.id, skillTree)
            }

            //Load weapons
            for (let weapon of db.weapons) {
                this.weapons.set(weapon.id, weapon)
            }

            //Load abiities
            for (let ability of db.abilities) {
                this.abilities.set(ability.id, ability)
            }

            //Load roles
            for (let role of db.roles) {
                this.roles.set(role.id, role)
            }

            // Load reusable nodes
            for (let node of db.nodes) {
                this.nodes.set(node.id, node)
            }

            // Load artifact/weapon ugprades
            for (let upgrade of db.upgrades) {
                this.ugprades.set(upgrade.id, upgrade)
            }

        } catch (error: any) {
            console.log(error.message)
        }
    }

    /**
     * Returns json object with skill tree information based on id
     * @param id id of skill tree to retrieve, look at the my-app frontend to get ids
     * @returns 
     */
    getSkill(id: string){
        return this.skillTrees.get(id)
    }

    /**
     * Returns ability json object associated with given id.
     * @param id id of ability
     * @returns 
     */
    getAbility(id: string){
        return this.abilities.get(id)
    }

    /**
     * Returns role json object associated with given id.
     * @param id id of role
     * @returns 
     */
    getRole(id: string){
        return this.roles.get(id)
    }

    /**
     * Returns json object with basic weapon information such as name, description, sprite, projectile, etc based on the weaponId parameter.
     * @param weaponId 
     * @returns 
     */
    getWeapon(weaponId: string){
        return this.weapons.get(weaponId)
    }

    getAllRoles(){
        return this.roles
    }

    getAll(colName: IColNames){
        switch(colName){
            case "abilities":
                return this.abilities.values()
            case "nodes":
                return this.nodes.values()
            case "roles":
                return this.roles.values()
            case "skills":
                return this.skillTrees.values()
            case "upgrades":
                return this.ugprades.values()
            case "weapons":
                return this.weapons.values()
        }
    }

    static getManager() {
        return JsonDatabaseManager.singleton
    }
    
}


