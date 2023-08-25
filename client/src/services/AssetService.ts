import { doc, getDoc, getFirestore } from "firebase/firestore";

export default class AssetService {

    public static getAsset(assetId: string) {
        const db = getFirestore();
        const docRef = doc(db, "assets", assetId);
        return getDoc(docRef);
    }
}