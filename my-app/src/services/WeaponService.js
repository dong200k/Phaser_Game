import { getDefaultWeapon } from "../helpers.js"

class WeaponService{
    BASEURL = "http://localhost:3010"
    async getWeapon(id){
        try{
            let res = await fetch(this.BASEURL + `/weapons/${id}`)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch{
            console.log(`error getting upgrade with the id: ${id}`)
            return null
        }
    }
    async saveWeapon(weapon){
        try {
            let result = await fetch(this.BASEURL + `/weapons/${weapon.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(weapon)
            })
            return result.status === 200
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async createWeapon(){
        let weapon = getDefaultWeapon()
        try {
            let result = await fetch(this.BASEURL + `/weapons`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(weapon)
            })
            return result
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteWeapon(id){
        try {
            let result = await fetch(this.BASEURL + `/weapons/${id}`, {
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

    async getAllWeapons(){
        try{
            let res = await fetch(this.BASEURL + "/weapons")
            console.log(res)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            // console.log(e.message)
            console.log("error getting all upgrades")
            return []
        }
    }
}

export default new WeaponService()