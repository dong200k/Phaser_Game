import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { Stream } from "stream";
import FileUtil from "../util/fileutil";
import { getIdFromName } from "../util/apputil";

export default class AssetController {

    public static upload(req: any, res: any) {
        let { type, name, audio, json, image, locType, locUrl } = req.body;
        let id = getIdFromName(name);
        if(locType === "firebaseCloudStorage") {
            getFirestore().collection("assets").doc(id).get().then((doc) => {
                if(doc.exists) throw new Error(`Asset with id ${name} already exists. Note: The id is created from the name with all spaces removed.`);
                
                // Step 1: Upload assets to firebase cloud storage.
                if(type === "images") return AssetController.uploadToCloud(`${type}/${id}`, image);
                if(type === "audios") return AssetController.uploadToCloud(`${type}/${id}`, audio);
                if(type === "aseprite") return AssetController.uploadToCloud(`aseprite/${id}/image`, image).then(() => {
                    return AssetController.uploadToCloud(`aseprite/${id}/json`, json);
                });
                
                throw new Error(`Incorrect type: Use 'images', 'audios' or 'aseprite'`);
            }).then(() => {
                // Step 2: Upload asset metadata to firestore. The metadata can be used to access the asset on firebase cloud storage.
                if(type === "images") return AssetController.uploadToFirestore({type, name, locType, locData: `${type}/${id}`});
                if(type === "audios") return AssetController.uploadToFirestore({type, name, locType, locData: `${type}/${id}`});
                if(type === "aseprite") return AssetController.uploadToFirestore({type, name, locType, locData: `aseprite/${id}/image`, locData2: `aseprite/${id}/json`});

            }).then(() => {
                res.status(200).send({message: "Upload successful!"});
            }).catch((e) => {
                res.status(400).send({message: e.message});
            });
        } else if(locType === "locally") {
            AssetController.uploadToFirestore({type, name, locType, locData: locUrl}).then(() => {
                res.status(200).send({message: "Upload successful!"});
            }).catch((e) => {
                res.status(400).send({message: e.message});
            });
        } else {
            res.status(400).send({message: `Incorrect locType of ${locType}, use 'locally' or 'firebaseCloudStorage'`});
        }
    }

    public static getAllAssets(req: any, res: any) {
        const db = getFirestore();
        let assetColRef = db.collection("assets");
        assetColRef.get().then((data) => {
            let assetData: any[] = [];
            data.forEach((doc) => {
                assetData.push(doc.data());
            })
            res.status(200).send({message: "Retrieved All Assets", assets: assetData});
        }).catch((e) => {
            res.status(400).send({message: e.error});
        });
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
     * Helper method to upload asset binary onto firebase cloud storage.
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





