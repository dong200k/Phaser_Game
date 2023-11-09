
export default class DungeonService {
    /**
     * Gets the dungeon data by name or id.
     * @param dungeonNameOrId The name or id of the dungeon.
     * @returns A promise from the fetch function.
     */
    static getDungeonData(dungeonNameOrId: string) {
        const url = process.env.API_SERVER + "/dungeons/" + dungeonNameOrId;
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
    }


    static getAllDungeons() {
        const url = process.env.API_SERVER + "/dungeons/";
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
    }
}