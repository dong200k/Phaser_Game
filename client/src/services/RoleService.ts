import { APIServerURL } from "../config";

export default class RoleService {

    static async unlockRole(IdToken: string, role: string){
        const url = APIServerURL + "/roles"
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
        const url = APIServerURL + "/roles"
        console.log(url);
        let res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        });
        let json = await res.json()
        if(res.status === 200) return json.roles
        else throw new Error("Error getting roles")
    }
}