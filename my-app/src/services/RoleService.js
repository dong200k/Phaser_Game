import { getDefaultRole } from "../helpers.js"

class RoleService{
    BASEURL = "http://localhost:3010"
    async getRole(id){
        try{
            let res = await fetch(this.BASEURL + `/roles/${id}`)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch{
            console.log(`error getting role with the id: ${id}`)
            return null
        }
    }
    async saveRole(role){
        try {
            let result = await fetch(this.BASEURL + `/roles/${role.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(role)
            })
            return result.status === 200
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async createRole(){
        let role = getDefaultRole()
        try {
            let result = await fetch(this.BASEURL + `/roles`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(role)
            })
            return result
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRole(id){
        try {
            let result = await fetch(this.BASEURL + `/roles/${id}`, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async getAllRoles(){
        try{
            let res = await fetch(this.BASEURL + "/roles")
            console.log(res)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            // console.log(e.message)
            console.log("error getting all roles")
            return []
        }
    }
}

export default new RoleService()