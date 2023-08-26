import AssetService from "../services/AssetService";


export default class AssetManager {

    /**
     * Given a list of assetId's, for each assetId grab the asset document from firebase. Then using the asset
     * document, figure out where the asset binary file is located. Once the url of the binary file
     * is retrieved, add the assetId and the url to scene.load.
     * @param scene The Phaser Scene.
     * @param assets The list of assets to load.
     * @returns A promise that resolves to void.
     */
    public static async putAssetsInLoad(scene: Phaser.Scene, assets: string[]) {
        for(let i = 0; i < assets.length; i++) {
            let assetId = assets[i];
            let docSnap = await AssetService.getAsset(assetId);
            let assetDoc = docSnap.data();
            if(assetDoc) {
                if(assetDoc.locType === "locally") {
                    if(assetDoc.type === "images") {
                        scene.load.image(assetId, assetDoc.locData);
                    } else if(assetDoc.type === "aseprite") {
                        scene.load.aseprite(assetId, assetDoc.locData, assetDoc.locData2);
                    } else if(assetDoc.type === "audios") {
                        scene.load.audio(assetId, assetDoc.locData);
                    }
                }
                if(assetDoc.locType === "firebaseCloudStorage") {
                    if(assetDoc.type === "images") {
                        let url = await AssetService.getResourceImage(assetDoc.locData);
                        scene.load.image(assetId, url);
                    } else if(assetDoc.type === "aseprite") {
                        let urls = await AssetService.getResourceAseprite(assetDoc.locData, assetDoc.locData2);
                        scene.load.aseprite(assetId, urls.imageUrl, urls.jsonUrl);
                    } else if(assetDoc.type === "audio") {
                        let url = await AssetService.getResourceAudio(assetDoc.locData);
                        scene.load.audio(assetId, url);
                    }
                }
            }
        }
    }
}
