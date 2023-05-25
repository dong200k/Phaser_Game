import { getDefaultNode, getDefaultSkill, getDefaultSkillNode, getDefaultUpgrade, getDefaultUpgradeNode, padUpgradeStat } from "../helpers.js"

class NodeService{
    BASEURL = "http://localhost:3010"
    async getNode(id){
        try{
            let node = await fetch(this.BASEURL + `/nodes/${id}`)
            console.log(node)
            if(node.status !== 200) throw new Error()
            return await node.json()
        }catch{
            console.log(`error getting node with the id: ${id}`)
            return null
        }
        
    }
    async saveNode(node){
        // let paddedUpgrade = padUpgradeStat(upgrade)
        try {
            let result = await fetch(this.BASEURL + `/nodes/${node.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(node)
            })
            return result.status === 200
            
        } catch (error) {
            console.log(error)
        }
    
    }
    async createNode(){
        let node = {
            id: "default-node-" + window.crypto.randomUUID(), ...getDefaultNode(), ...getDefaultSkillNode(), ...getDefaultUpgradeNode(),
        }
        // set nodeId to same value as id or else deleting one node by id will delete everynode for some reason
        node.nodeId = node.id
        try {
            let result = await fetch(this.BASEURL + `/nodes`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(node)
            })
            return result
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteNode(id){
        try {
            let result = await fetch(this.BASEURL + `/nodes/${id}`, {
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

    async getAllNodes(){
        try{
            let res = await fetch(this.BASEURL + "/nodes")
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

export default new NodeService()