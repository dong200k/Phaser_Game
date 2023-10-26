import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { DataContext } from "../../contexts/DataContextProvider";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import CollectionService from "../../services/CollectionService";
import { UserContext } from "../../contexts/UserContextProvider";
import { getBlob, getMetadata, getStorage, list, listAll, ref } from "firebase/storage";

export default function BackupView() {

    let { monsters, dungeons, assets, roles, abilities, nodes, upgrades, skills, weapons } = useContext(DataContext);
    let { user } = useContext(UserContext);

    let [firestoreBackupList, setFireStoreBackupList] = useState([
        { name: "monsters", type: "json", data: monsters, selected: true },
        { name: "dungeons", type: "json", data: dungeons, selected: true },
        { name: "assets", type: "json", data: assets, selected: true },
        { name: "roles", type: "json", data: roles, selected: true },
        { name: "abilities", type: "json", data: abilities, selected: true },
        { name: "nodes", type: "json", data: nodes, selected: true },
        { name: "upgrades", type: "json", data: upgrades, selected: true },
        { name: "skills", type: "json", data: skills, selected: true },
        { name: "weapons", type: "json", data: weapons, selected: true },
    ]);

    const addCloudStorageDirectoryToJSZip = async (directoyPath = "", zip) => {
        let storage = getStorage();

        console.log("Getting data from cloud storage: ", directoyPath);

        let directoryContentsRef = ref(storage, directoyPath);
        let directoryList = await listAll(directoryContentsRef);
        for(let file of directoryList.items) {
            let fileRef = ref(storage, file.fullPath);
            let fileBlob = await getBlob(fileRef);
            let metaData = await getMetadata(fileRef);
            let extension = "";
            switch(metaData.contentType) {
                case "image/png": extension = "png"; break;
                case "application/json": extension = "json"; break;
            }
            if(extension !== "") 
                zip.file(`${file.name}.${extension}`, fileBlob);
            else
                zip.file(`${file.name}`, fileBlob);
        }
        for(let folder of directoryList.prefixes) {
            await addCloudStorageDirectoryToJSZip(directoyPath+"/"+folder.name, zip.folder(folder.name));
        }
    }

    const backupNowOnclick = async () => {
        console.log("Staring backup...");

        let zip = new JSZip();
        
        // Backup firestore data.
        let firestoreZip = zip.folder("firestore");
        firestoreBackupList.forEach((backupItem) => {
            console.log(`Getting data from firestore: ${backupItem.name}`);
            firestoreZip.file(`${backupItem.name}.${backupItem.type}`, JSON.stringify(backupItem.data));
        })
        console.log(`Getting data from firestore: players`);
        let playerDocuments = (await CollectionService.getAllDocuments("players", user)).documents;
        firestoreZip.file("players.json", JSON.stringify(playerDocuments));

        let cloudStorageZip = zip.folder("cloud_storage");
        await addCloudStorageDirectoryToJSZip("", cloudStorageZip);
        
        let date = new Date();
        zip.file("README.txt", 
`Please do not modify the contents of this backup.
This backup should be restored through the my-app tool.
Backup Date: ${date.toString()}
Backup Date V2: ${date.toLocaleString()}`
        );

        let blobContent = await zip.generateAsync({type: "blob"});
        saveAs(blobContent, `db_${date.toLocaleDateString()}.zip`);

    }

    return (
        <Container>
            <Button variant="primary" onClick={backupNowOnclick}>
                Download backup file
            </Button>
        </Container>
    )
}
