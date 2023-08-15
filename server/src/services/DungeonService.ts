
export default class DungeonService {
    static baseUrl = "http://localhost:3002";

    /**
     * Gets the dungeon data by name or id.
     * @param dungeonNameOrId The name or id of the dungeon.
     * @returns A promise from the fetch function.
     */
    static getDungeonData(dungeonNameOrId: string) {
        const url = DungeonService.baseUrl + "/dungeons/" + dungeonNameOrId;
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
    }


    static getAllDungeons() {
        const url = DungeonService.baseUrl + "/dungeons/";
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
    }
}