import { getDefaultSkill, getDefaultUpgrade, padUpgradeStat } from "../helpers.js"

class SkillService{
    BASEURL = "http://localhost:3010"
    async getSkill(id){
        try{
            let skill = await fetch(this.BASEURL + `/skills/${id}`)
            console.log(skill)
            if(skill.status !== 200) throw new Error()
            return await skill.json()
        }catch{
            console.log(`error getting skill with the id: ${id}`)
            return null
        }
        
    }
    async saveSkill(skill){
        // let paddedUpgrade = padUpgradeStat(upgrade)
        try {
            let result = await fetch(this.BASEURL + `/skills/${skill.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(skill)
            })
            return result.status === 200
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async createSkill(){
        let skill = getDefaultSkill()
        try {
            let result = await fetch(this.BASEURL + `/skills`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(skill)
            })
            return result
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteSkill(id){
        try {
            let result = await fetch(this.BASEURL + `/skills/${id}`, {
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

    async getAllSkills(){
        try{
            let res = await fetch(this.BASEURL + "/skills")
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

export default new SkillService()