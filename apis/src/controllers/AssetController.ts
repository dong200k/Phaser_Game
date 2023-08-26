import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { Stream } from "stream";
import FileUtil from "../util/fileutil";
import { getIdFromName } from "../util/apputil";

export default class AssetController {

    /** Given the locType and type of asset to upload. Create a document entry on firestore. Then upload 
     * the asset's binary file onto cloud storage.
     */
    public static upload(req: any, res: any) {
        AssetController.uploadHelper(req, res).then(() => {
            res.status(200).send({message: "Upload successful!"});
        }).catch((e) => {
            res.status(400).send({message: e.message});
        })
    }

    public static edit(req: any, res: any) {
        console.log("Editing asset: ", req.params.id);
        AssetController.editHelper(req, res).then(() => {
            res.status(200).send({message: "Edit successful!"});
        }).catch((e) => {
            res.status(400).send({message: e.message});
        })
    }

    public static getAllAssets(req: any, res: any) {
        const db = getFirestore();
        let assetColRef = db.collection("assets");
        assetColRef.get().then((data) => {
            let assetData: any[] = [];
            data.forEach((doc) => {
                let docData = doc.data();
                docData.id = doc.id;
                assetData.push(docData);
            })
            res.status(200).send({message: "Retrieved All Assets", assets: assetData});
        }).catch((e) => {
            res.status(400).send({message: e.error});
        });
    }

    /** A helper method for uploading new assets. */
    private static async uploadHelper(req: any, res: any) {
        let { type, name, audio, json, image, locType, locUrl, locUrl2 } = req.body;
        let id = getIdFromName(name);
        let doc = await getFirestore().collection("assets").doc(id).get();
        if(doc.exists) throw new Error(`Asset with id ${name} already exists. Note: The id is created from the name with all spaces removed.`);
        if(locType === "firebaseCloudStorage") {
            // Upload asset binary files on to Firebase Cloud Storage. Upload asset data onto firestore.
            switch(type) {
                case "images": {
                    await AssetController.uploadToCloud(`${type}/${id}`, image);
                    await AssetController.uploadToFirestore({type, name, locType, locData: `${type}/${id}`});
                } break;
                case "audios": {
                    await AssetController.uploadToCloud(`${type}/${id}`, audio);
                    await AssetController.uploadToFirestore({type, name, locType, locData: `${type}/${id}`});
                } break;
                case "aseprite": {
                    await AssetController.uploadToCloud(`aseprite/${id}/image`, image);
                    await AssetController.uploadToCloud(`aseprite/${id}/json`, json);
                    await AssetController.uploadToFirestore({type, name, locType, locData: `aseprite/${id}/image`, locData2: `aseprite/${id}/json`});
                } break;
                default: throw new Error(`Incorrect type: Use 'images', 'audios' or 'aseprite'`);
            }
        } else if(locType === "locally") {
            // If the user choose locally, create an asset document but don't upload any assets to firebase cloud storage.
            switch(type) {
                case "images": // For both images and audios.
                case "audios": await AssetController.uploadToFirestore({type, name, locType, locData: locUrl}); break;
                case "aseprite": await AssetController.uploadToFirestore({type, name, locType, locData: locUrl, locData2: locUrl2}); break;
                default: throw new Error(`Incorrect type: Use 'images', 'audios' or 'aseprite'`);
            }
        } else {
            throw new Error(`Incorrect locType of ${locType}, use 'locally' or 'firebaseCloudStorage'`);
        }
    }

    /** A helper method for editing existing assets. */
    private static async editHelper(req: any, res: any) {
        let { type, name, audio, json, image, locType, locUrl, locUrl2 } = req.body;
        let { id } = req.params;
        let doc = await getFirestore().collection("assets").doc(id).get();
        if(!doc.exists) throw new Error(`Asset with id ${id} does not exist. Cannot complete edit.`);
        if(locType === "firebaseCloudStorage") {
            // Upload asset binary files on to Firebase Cloud Storage. Upload asset data onto firestore.
            switch(type) {
                case "images": {
                    await AssetController.uploadToCloud(`${type}/${id}`, image);
                    await AssetController.updateOnFirestore(id, {type, name, locType, locData: `${type}/${id}`});
                } break;
                case "audios": {
                    await AssetController.uploadToCloud(`${type}/${id}`, audio);
                    await AssetController.updateOnFirestore(id, {type, name, locType, locData: `${type}/${id}`});
                } break;
                case "aseprite": {
                    await AssetController.uploadToCloud(`aseprite/${id}/image`, image);
                    await AssetController.uploadToCloud(`aseprite/${id}/json`, json);
                    await AssetController.updateOnFirestore(id, {type, name, locType, locData: `aseprite/${id}/image`, locData2: `aseprite/${id}/json`});
                } break;
                default: throw new Error(`Incorrect type: Use 'images', 'audios' or 'aseprite'`);
            }
        } else if(locType === "locally") {
            // If the user choose locally, create an asset document but don't upload any assets to firebase cloud storage.
            switch(type) {
                case "images": // For both images and audios.
                case "audios": await AssetController.updateOnFirestore(id, {type, name, locType, locData: locUrl}); break;
                case "aseprite": await AssetController.updateOnFirestore(id, {type, name, locType, locData: locUrl, locData2: locUrl2}); break;
                default: throw new Error(`Incorrect type: Use 'images', 'audios' or 'aseprite'`);
            }
        } else {
            throw new Error(`Incorrect locType of ${locType}, use 'locally' or 'firebaseCloudStorage'`);
        }
    }

    /**
     * Helper method to upload asset data onto firestore.
     * @param data The asset's data.
     * @returns A Promise resolved with the write time of the upload.
     */
    private static uploadToFirestore(data: any) {
        let db = getFirestore();
        let docRef = db.collection("assets").doc(getIdFromName(data.name));
        return docRef.create(data);
    }

    /**
     * Helper method to update the asset data on firestore.
     * @param id The id of the asset.
     * @param data The new data for the asset.
     * @returns A Promise resolved with the write time of the update.
     */
    private static updateOnFirestore(id: string, data: any) {
        let db = getFirestore();
        let docRef = db.collection("assets").doc(id);
        return docRef.update(data);
    }

    /**
     * Helper method to upload asset binary onto firebase cloud storage. If there is already data 
     * in the provided loc, the data will be replaced.
     * @param loc The location to store the file. This location will be used to access the file.
     * @param data The dataURL encoded data with base64.
     * @returns A Promise resolved with void.
     */
    private static uploadToCloud(loc: string, data: any) {
        let bucket = getStorage().bucket();
        let decodedData = FileUtil.decodeDataURL(data);
        let buffer = Buffer.from(decodedData.data, "base64");
        return bucket.file(loc).save(buffer, {
            metadata: {
                contentType: decodedData.mime,
            }
        })
    }

}





