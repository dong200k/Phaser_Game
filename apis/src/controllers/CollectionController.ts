import { getFirestore } from "firebase-admin/firestore";
import CollectionCrud from "../crud/CollectionCrud";

export default class CollectionController {

    public static async getDocument(req: any, res: any) {
        const {id, colName} = req.params

        try {
            let document = await CollectionCrud.getDocument(id, colName)
            res.status(200).send({message: `document ${id} retrieved successfully`, document})
        } catch (error: any) {
            res.status(400).send({message: error.message})
        }
    }

    public static async saveDocument(req: any, res: any) {
        const {id, colName} = req.params
        const {document} = req.body

        try {
            await CollectionCrud.saveDocument(id, document, colName)
            res.status(200).send({message: `document ${id} updated successfully`})
        } catch (error: any) {
            console.log(error.message)
            res.status(400).send({message: error.message})
        }
    }

    public static async createDocument(req: any, res: any) {
        const {document} = req.body
        let {id, colName} = req.params
        try {
            await CollectionCrud.createDocument(id, document, colName)
            res.status(200).send({message: `document ${id} created successfully`})
        } catch (error: any) {
            console.log(error.message)
            res.status(400).send({message: error.message})
        }
    }

    public static async deleteDocument(req: any, res: any) {
        const {id, colName} = req.params

        try {
            await CollectionCrud.deleteDocument(id, colName)
            res.status(200).send({message: `document ${id} deleted successfully`})
        } catch (error: any) {
            res.status(400).send({message: error.message})
        }
    }

    public static async getAllDocuments(req: any, res: any) {
        let {colName} = req.params
        try {
            let documents = await CollectionCrud.getAllDocuments(colName)

            res.status(200).send({message: `successfully retrieved weapons`, documents})
        } catch (error: any) {
            res.status(400).send({message: error.message})
        }
    }

    public static async restoreCollection(req: any, res: any) {
        let {data, override} = req.body;
        let {colName} = req.params;
        // finish restore collection.
        
        try {
            for(let i = 0; i < data.length; i++) {
                let document = data[i];
                let documentId = document.id;
                delete document.id;
                const db = getFirestore();
                let docRef = db.collection(colName).doc(documentId);
                let snapShot = await docRef.get();
    
                if(snapShot.exists){
                    if(override)
                        await CollectionCrud.saveDocument(documentId, document, colName)
                }else{
                    await CollectionCrud.createDocument(documentId, document, colName)
                }
            }
            res.status(200).send({message: `successfully restored collection ${colName}`});
        } catch(e: any) {
            res.status(400).send({message: e.message});
        }
    }
}

