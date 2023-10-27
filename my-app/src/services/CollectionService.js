import { BASEURL_API_SERVER } from "../constants.js"

const BASEURL = BASEURL_API_SERVER + "/col"

export default class CollectionService{
    static async getDocument(id, colName, user){
        let IdToken = await user.getIdToken();
        try{
            let res = await fetch(BASEURL + `/${colName}/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': IdToken,
                },
            })
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            console.log(e.message)
            console.log(`error getting document with the id: ${id}`)
            return null
        }
    }
    static async saveDocument(document, colName, user){
        let IdToken = await user.getIdToken();
        try {
            let result = await fetch(BASEURL + `/${colName}/${document.id}` + `/save`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': IdToken,
                },
                body: JSON.stringify({document})
            })
            if(result.status !== 200) throw new Error()
            return true
        } catch (error) {
            console.log(error.message)
        }
    
    }
    static async createDocument(document, colName, user){
        let IdToken = await user.getIdToken();
        try {
            let result = await fetch(BASEURL + `/${colName}/${document.id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': IdToken,
                },
                body: JSON.stringify({document})
            })
            if(result.status !== 200) throw new Error()
            return true
        } catch (error) {
            console.log(error.message)
        }
    }

    static async deleteDocument(id, colName, user){
        let IdToken = await user.getIdToken();
        try {
            let result = await fetch(BASEURL + `/${colName}/${id}`, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': IdToken,
                },
            })
            if(result.status !== 200) throw new Error()
            return true
        } catch (error) {
            console.log(error.message)
        }
    }

    static async getAllDocuments(colName, user){
        let IdToken = await user.getIdToken();
        try{
            let res = await fetch(BASEURL + `/${colName}`, {
                method: "GET",
                headers: {
                    'Authorization': IdToken,
                }
            })
            if(res.status !== 200) throw new Error()
            return await res.json()
        }catch(e){
            console.log(e.message)
            console.log("error getting all documents")
            return []
        }
    }
}