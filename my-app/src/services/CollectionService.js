import { BASEURL_API_SERVER } from "../constants.js"
import { getDefaultWeapon } from "../helpers.js"

const BASEURL = BASEURL_API_SERVER + "/col"

export default class CollectionService{
    static async getDocument(id, colName){
        try{
            let res = await fetch(BASEURL + `/${colName}/${id}`)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            console.log(e.message)
            console.log(`error getting upgrade with the id: ${id}`)
            return null
        }
    }
    static async saveDocument(document, colName){
        try {
            let result = await fetch(BASEURL + `/${colName}/${document.id}` + `/save`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({document})
            })
            if(result.status !== 200) throw new Error()
            return true
        } catch (error) {
            console.log(error.message)
        }
    
    }
    static async createDocument(document, colName){
        try {
            let result = await fetch(BASEURL + `/${colName}/${document.id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({document})
            })
            if(result.status !== 200) throw new Error()
            return true
        } catch (error) {
            console.log(error.message)
        }
    }

    static async deleteDocument(id, colName){
        try {
            let result = await fetch(BASEURL + `/${colName}/${id}`, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if(result.status !== 200) throw new Error()
            return true
        } catch (error) {
            console.log(error.message)
        }
    }

    static async getAllDocuments(colName){
        try{
            let res = await fetch(BASEURL + `/${colName}`)
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            console.log(e.message)
            console.log("error getting all upgrades")
            return []
        }
    }
}