import { API_SERVER_URL } from "../config";

export default class PlayerService{

    static async createPlayer(username: string | null, IdToken?: string){
        const url = API_SERVER_URL + "/players"
        let res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                IdToken,
                username
            }),
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) return json.player
        else throw new Error(json.error)
    }

    static async updatePlayerSkillTree(upgrades: string[], IdToken: string){
        const url = API_SERVER_URL + "/players/skillTree"
        let res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                IdToken,
                upgrades
            }),
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) return
        else throw new Error(json.error)
    }

    static async unUpgradePlayerSkillTree(upgrades: string[], IdToken: string){
        const url = API_SERVER_URL + "/players/skillTree/remove"
        let res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                IdToken,
                upgrades
            }),
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) return
        else throw new Error(json.error)
    } 
}