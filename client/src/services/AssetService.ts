import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

export default class AssetService {
    /**
     * Gets the asset document on firestore associated with the assetId.
     * @param assetId The assetId.
     * @returns A promise that resolves to the firestore document snapshot.
     */
    public static getAsset(assetId: string) {
        const db = getFirestore();
        const docRef = doc(db, "assets", assetId);
        return getDoc(docRef);
    }

    /**
     * Gets the url of an image.
     * @param resourcePath The resourcePath found in the asset document.
     * @returns A promise that resolves to the url of the image.
     */
    public static getResourceImage(resourcePath: string) {
        const storage = getStorage();
        const pathReference = ref(storage, resourcePath);
        return getDownloadURL(pathReference);
    }

    /**
     * Gets the url of an audio file.
     * @param audioPath The resoucePath of the audio.
     * @returns A promise that resolves to the url of the audio.
     */
    public static getResourceAudio(audioPath: string) {
        const storage = getStorage();
        const pathReference = ref(storage, audioPath);
        return getDownloadURL(pathReference);
    }

    /**
     * Gets the url of the aseprite image and json.
     * @param imagePath The resource path of the image.
     * @param jsonPath The resource path of the json.
     * @returns A promise that resolves to the url of the image and json.
     */
    public static async getResourceAseprite(imagePath: string, jsonPath: string) {
        const storage = getStorage();
        const imagePathRef = ref(storage, imagePath);
        const jsonPathRef = ref(storage, jsonPath);
        let imageUrl = await getDownloadURL(imagePathRef);
        let jsonUrl = await getDownloadURL(jsonPathRef);
        return {imageUrl, jsonUrl};
    }
}