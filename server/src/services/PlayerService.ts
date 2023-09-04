export default class PlayerService{
    static baseUrl = "http://localhost:3002"

    static async getPlayerData(idToken: string){
        const url = PlayerService.baseUrl + "/players/" + idToken
        let res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) return json.player
        else {
            console.log(json)
            throw new Error(json.error)
        }
    }
}