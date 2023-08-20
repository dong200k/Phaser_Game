export default class MonsterService {
    static baseUrl = "http://localhost:3002";

    static async getMonsterData(monsterId: string) {
        const url = MonsterService.baseUrl + "/monsters/" + monsterId;
        let res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
        let json = await res.json();
        if(res.status === 200) return json.monster;
        else throw new Error(json.error);
    }

    static getAllMonsterData() {
        const url = MonsterService.baseUrl + "/monsters";
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
    }
}