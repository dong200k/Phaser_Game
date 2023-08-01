import FileUtil from "../util/fileutil"
import { skillTree } from "../../../server/src/rooms/game_room/system/interfaces"

export default class JsonDatabaseManager{

    static singleton = new JsonDatabaseManager()

    private skillTrees: Map<string, skillTree> = new Map()

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

    static getManager() {
        return JsonDatabaseManager.singleton
    }
    
}


