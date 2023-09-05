export default class RoleService{
    static baseUrl = "http://localhost:3002"

    static async unlockRole(IdToken: string, role: string){
        const url = RoleService.baseUrl + "/roles"
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
        const url = RoleService.baseUrl + "/roles"
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