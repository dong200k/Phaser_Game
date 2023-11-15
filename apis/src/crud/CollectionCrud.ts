import { getFirestore } from "firebase-admin/firestore";

/** Contains basic crud methods */
export default class CollectionCrud {

    public static async getDocument(id: string, colName: string) {
        const db = getFirestore();
        let docRef = db.collection(colName).doc(id);
        let doc = await docRef.get()
        let docData = doc.data();
        if(docData) docData.id = doc.id;
        return docData;
    }

    public static async saveDocument(id: string, document: any, colName: string) {
        const db = getFirestore();
        let docRef = db.collection(colName).doc(id);
        await docRef.update(document)
    }

    public static async createDocument(id: string, document: any, colName: string) {
        const db = getFirestore();
        let docRef = db.collection(colName).doc(id);
        await docRef.create(document)
    }

    public static async deleteDocument(id: string, colName: string) {
        const db = getFirestore();
        let docRef = db.collection(colName).doc(id);
        await docRef.delete()
    }

    public static async getAllDocuments(colName: string) {
        const db = getFirestore();
        const documents: any[] = []
        let colRef = db.collection(colName)
        let querySnapShot = await colRef.get()
        
        querySnapShot.forEach(snapShot=>{
            let document = snapShot.data()
            // The document's id will be saved inside the document object.
            document.id = snapShot.id;
            documents.push(document)
        })

        return documents
    }
}

