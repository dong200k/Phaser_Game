export type IColNames = "skills" | "abilities" | "roles" | "weapons" | "upgrades" | "nodes"

export default class CollectionService{
    static baseUrl = "http://localhost:3002";

    static async getAllDocuments(colName: IColNames){
        try{
            let res = await fetch(this.baseUrl + `/col/${colName}`, {
                method: "GET",
                headers: {
                    "Authorization" : `${process.env.API_KEY}`,
                }
            })
            if(res.status !== 200) throw new Error()
            let json = await res.json()
            return json.documents
        }catch(e){
            console.log("error getting all documents")
            return []
        }
    }
}