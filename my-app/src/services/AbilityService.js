import { getDefaultAbility } from "../helpers.js"

class AbilitySerice{
    BASEURL = "http://localhost:3010"
    async getAbility(id){
        try{
            let res = await fetch(this.BASEURL + `/abilities/${id}`)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch{
            console.log(`error getting role with the id: ${id}`)
            return null
        }
    }
    async saveAbility(ability){
        try {
            let result = await fetch(this.BASEURL + `/abilities/${ability.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ability)
            })
            return result.status === 200
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async createAbility(){
        let role = getDefaultAbility()
        try {
            let result = await fetch(this.BASEURL + `/abilities`, {
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

    async deleteAbility(id){
        try {
            let result = await fetch(this.BASEURL + `/abilities/${id}`, {
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

    async getAllAbilities(){
        try{
            let res = await fetch(this.BASEURL + "/abilities")
            console.log(res)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            // console.log(e.message)
            console.log("error getting all abilities")
            return []
        }
    }
}

export default new AbilitySerice()