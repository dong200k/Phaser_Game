import FileUtil from "../../../../util/FileUtil"
import { IAbility, IDungeon, IRole, skillTree, upgrade, weapon } from "../interfaces"

export default class DatabaseManager{

    static singleton = new DatabaseManager()

    private weaponUpgrades: Map<string, upgrade> = new Map()
    private artifactUpgrades: Map<string, upgrade> = new Map()
    private weapons: Map<string, weapon> = new Map()
    private skillTrees: Map<string, skillTree> = new Map()
    private abilities: Map<string, IAbility> = new Map()
    private roles: Map<string, IRole> = new Map()

    private dungeons: Map<string, IDungeon> = new Map();

    private constructor() {};

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
            for (let weapon of db.weapons) {
                this.weapons.set(weapon.id, weapon)
            }

            //Load dungeons
            let dungeondb = await FileUtil.readJSONAsync("assets/tilemaps/dungeon.json");
            for(let dungeon of dungeondb) {
                this.dungeons.set(dungeon.id, dungeon);
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
     * Returns json object with basic weapon information such as name, description, sprite, projectile, etc based on the weaponId parameter.
     * @param weaponId 
     * @returns  
     */
    getWeapon(weaponId: string){
        return this.weapons.get(weaponId)
    }

    /**
     * 
     * @param weaponId id of weapon to get projectile of
     * @returns the projectile string of the weapon if it exists else it returns the default demo_hero
     */
    getWeaponProjectile(weaponId: string){
        let weapon = this.weapons.get(weaponId)
        if(weapon) return weapon.projectile
        else return "demo_hero"
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
     * Returns json object with artifact upgrade tree information based on id
     * @param id id of artifact upgrade tree to retrieve, look at the my-app frontend to get ids
     * @returns 
     */
    getArtifactUpgrade(id: string){
        return this.artifactUpgrades.get(id)
    }

    /**
     * Returns json object with weapon upgrade tree information based on id
     * @param id id of weapon upgrade tree to retrieve, look at the my-app frontend to get ids
     * @returns 
     */
    getWeaponUpgrade(id: string){
        return this.weaponUpgrades.get(id)
    }

    /**
     * Returns json object with either weapon or artifact upgrade tree information based on id
     * @param id id of weapon/artifact upgrade tree to retrieve, look at the my-app frontend to get ids
     */
    getUpgrade(id: string){
        let weaponUpgradeTree = this.getWeaponUpgrade(id)
        let artifactUpgradeTree = this.getArtifactUpgrade(id)

        if(weaponUpgradeTree) return weaponUpgradeTree
        else return artifactUpgradeTree
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
     * Returns the dungon data associated with the given id.
     * @param id The dungeon id.
     */
    public getDungeon(id: string) {
        let dungeon = this.dungeons.get(id);
        if(dungeon === undefined) throw new Error(`ERROR: Cannot find dungeon with id: ${id}`);
        return dungeon;
    }

    public getDungeonByName(name: string): IDungeon {
        let dungeon: IDungeon | undefined = undefined;
        this.dungeons.forEach((data) => {
            if(data.name === name) {
                dungeon = data;
            }
        })
        if(dungeon === undefined) throw new Error(`ERROR: Cannot find dungeon with name: ${name}`);
        return dungeon;
    }

    /**
     * Returns a list of all the dungeons.
     */
    public getAllDungeon() {
        let data: IDungeon[] = [];
        this.dungeons.forEach((dungeon) => {
            data.push(dungeon);
        })
        return data;
    }

    static getManager() {
        return DatabaseManager.singleton
    }
    
}


