import { getDefaultArtifact, getDefaultUpgrade, padUpgradeStat } from "../helpers.js"

class UpgradeService{
    BASEURL = "http://localhost:3010"
    async getUpgrade(id){
        try{
            let upgrade = await fetch(this.BASEURL + `/upgrades/${id}`)
            if(upgrade.status !== 200) throw new Error()
            return await upgrade.json()
        }catch{
            console.log(`error getting upgrade with the id: ${id}`)
            return null
        }
    }
    async saveUpgrade(upgrade){
        // let paddedUpgrade = padUpgradeStat(upgrade)
        try {
            let result = await fetch(this.BASEURL + `/upgrades/${upgrade.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(upgrade)
            })
            return result.status === 200
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async createUpgrade(type){
        let upgrade
        if(type === "artifact") upgrade = getDefaultArtifact()
        else upgrade = getDefaultUpgrade()
        console.log("create upgrade ", upgrade.type, type)
        try {
            let result = await fetch(this.BASEURL + `/upgrades`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(upgrade)
            })
            return result
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteUpgrade(id){
        try {
            let result = await fetch(this.BASEURL + `/upgrades/${id}`, {
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

    async getAllUpgrades(){
        try{
            let res = await fetch(this.BASEURL + "/upgrades")
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

export default new UpgradeService()