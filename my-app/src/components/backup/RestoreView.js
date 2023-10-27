import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FileField from "../forms/FileField";
import JSZip from "jszip";
import { useContext, useState } from "react";
import CollectionService from "../../services/CollectionService";
import { UserContext } from "../../contexts/UserContextProvider";
import { restoreAsset } from "../../services/AssetService";
import { extensionToMime } from "../../util/mimeutil";

export default function RestoreView() {

    const [ fileList, setFileList ] = useState();
    const { user } = useContext(UserContext);

    const onFileUpload = async (e) => {
        let files = e.target.files;
        console.log(files[0]);
        let file = files[0];
        if(!file) return;

        let zip = await JSZip.loadAsync(file);
        let newFileList = [];
        zip.forEach((relativePath, file) => {

            if(!file.dir) {
                newFileList.push({
                    relativePath: relativePath,
                    file: file,
                    selected: true,
                });
            }
            
        })

        setFileList(newFileList);
    }

    const seperateExtensionFromPath = (path = "") => {
        let dotPoint = -1;
        for(let i = path.length - 1; i >= 0; i--) {
            if(path.at(i) === ".") {
                dotPoint = i;
                break;
            }
        }
        if(dotPoint === -1) {
            return {path: path, extension: ""};
        }
        let extension = path.substring(dotPoint, path.length);
        let newPath = path.substring(0, dotPoint);
        return {path: newPath, extension: extension};
    }

    const restoreOnclick = async () => {
        console.log("Restore onclick");
        for(let fileItem of fileList) {
            const firestorePath = "firestore/";
            if(fileItem.relativePath.includes(firestorePath)) {
                let newPath = fileItem.relativePath.substring(firestorePath.length);
                let collection = newPath.replace(".json", "");
                let jsonText = await fileItem.file.async("text");
                let data = JSON.parse(jsonText);
                if(collection !== "players")
                    await CollectionService.restoreCollection(collection, user, data);
                else 
                    console.log("WARNING: player collection will not be restored.");    
            }
            const cloudStoragePath = "cloud_storage/";
            if(fileItem.relativePath.includes(cloudStoragePath)) {
                let newPath = fileItem.relativePath.substring(cloudStoragePath.length);
                let { path, extension } = seperateExtensionFromPath(newPath);

                let value = await fileItem.file.async("blob");
                let fileReader = new FileReader();
                fileReader.readAsDataURL(value);
                fileReader.onload = () => { 
                    let data = fileReader.result;
                    restoreAsset(user, path, data, extensionToMime(extension));
                }
            }
        }
    }

    return (
        <Container style={{marginBottom: 100}}>
            <FileField 
                controlId="zipfile"
                label="Choose backup file..."
                onChange={onFileUpload}
                accept=".zip"
            />
            {
                fileList && <>
                    {
                        fileList.map((fileItem) => {
                            return (
                                <div key={fileItem.relativePath}>
                                    {fileItem.relativePath}
                                </div>
                            )
                        })
                    }
                    <Button variant="primary" onClick={restoreOnclick}>
                        Restore to firebase
                    </Button>
                </>
            }
        </Container>
    )
}
