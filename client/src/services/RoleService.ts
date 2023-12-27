import { API_SERVER_URL } from "../config";

export default class RoleService {

    static async unlockRole(IdToken: string, role: string){
        const url = API_SERVER_URL + "/roles"
        let res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                IdToken,
                role
            }),
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) return json.message
        else throw new Error(json.error)
    }

    static async getAllRoles(){
        const url = API_SERVER_URL + "/roles"
        console.log(url);
        let res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) {
            console.log(json.roles)
            return json.roles
        }
        else throw new Error("Error getting roles")
    }
}