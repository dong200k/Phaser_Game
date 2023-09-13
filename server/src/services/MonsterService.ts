export default class MonsterService {

    static async getMonsterData(monsterId: string) {
        const url = process.env.API_SERVER + "/monsters/" + monsterId;
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
        const url = process.env.API_SERVER + "/monsters";
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization" : `${process.env.API_KEY}`,
            }
        });
    }
}