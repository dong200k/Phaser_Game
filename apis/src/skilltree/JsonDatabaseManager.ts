import FileUtil from "../util/fileutil"
import { IAbility, IRole, skillTree, weapon } from "../../../server/src/rooms/game_room/system/interfaces"

/** */
export default class JsonDatabaseManager{

    static singleton = new JsonDatabaseManager()

    private skillTrees: Map<string, skillTree> = new Map()
    private abilities: Map<string, IAbility> = new Map()
    private roles: Map<string, IRole> = new Map()
    private weapons: Map<string, weapon> = new Map()

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

    static getManager() {
        return JsonDatabaseManager.singleton
    }
    
}


