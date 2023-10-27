import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Form from 'react-bootstrap/Form';
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
    let [cloudStorageBackupList, setCloudStorageBackupList] = useState([
        
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

        // Do not indent the following readme lines. Will show indents inside readme.
        zip.file("README.txt", 
`Please do not modify the contents of this backup.
This backup should be restored through the my-app tool.
Backup Date: ${date.toString()}
Backup Date V2: ${date.toLocaleString()}
Backup environment: ${process.env.REACT_APP_FIREBASE_ENV}`
        );

        let blobContent = await zip.generateAsync({type: "blob"});
        saveAs(blobContent, `db_${date.toLocaleDateString()}_${process.env.REACT_APP_FIREBASE_ENV}.zip`);

    }

    return (
        <Container>
            <Button variant="primary" onClick={backupNowOnclick}>
                Download backup file
            </Button>
            {/* <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            aria-label="option 1" 
                            style={{marginRight: 20, fontSize: 20}}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onChange={(e) => {
                                console.log("Value", e.target.checked);
                            }}
                        />
                        Accordion Item #1
                    </Accordion.Header>
                    <Accordion.Body>
                        {
                            firestoreBackupList.map((backupItem) => {
                                return (
                                    <div>
                                        <Form.Check aria-label={`option ${backupItem.name}`} style={{marginRight: 20, fontSize: 20, display:"inline"}}/>
                                        {backupItem.name}
                                    </div>
                                )
                            })
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                    <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion> */}
        </Container>
    )
}
