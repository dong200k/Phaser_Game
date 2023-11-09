import { getFirestore } from "firebase-admin/firestore";
import CollectionCrud from "../crud/CollectionCrud";
import JsonDatabaseManager, { IColNames } from "../skilltree/JsonDatabaseManager";
import { removeD3TreeInfo } from "../util/jsondbutil";

export default class JsonDBController{
    /** This method will move the information from json db to firebase */
    static async portJsonDBToFirebase(req: any, res: any){
        const colNames: IColNames[] = ["skills", "abilities", "roles", "weapons", "upgrades", "nodes"]
        console.log("Attempting to port json assets to firebase")
        try {
            for(let colName of colNames){
                let documents = JsonDatabaseManager.getManager().getAll(colName)
    
                for(let document of documents){
                    // Remove extra info used by d3 library
                    if(["upgrades", "skills"].find(name=>name===colName)){
                        document = removeD3TreeInfo(document)
                    }
                    const db = getFirestore();
                    let docRef = db.collection(colName).doc(document.id);
                    let snapShot = await docRef.get()

                    if(snapShot.exists){
                        await CollectionCrud.saveDocument(document.id, document, colName)
                    }else{
                        await CollectionCrud.createDocument(document.id, document, colName)
                    }
                }
            }
    
            res.status(200).send({message: `successfully moved json db assets to firebase`})
        } catch (e: any) {
            console.log(e.message)
            res.status(400).send({message: e.message})
        }
    }
}