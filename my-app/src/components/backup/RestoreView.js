import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FileField from "../forms/FileField";
import JSZip from "jszip";
import { useState } from "react";

export default function RestoreView() {

    const [ fileList, setFileList ] = useState();

    const onFileUpload = async (e) => {
        let files = e.target.files;
        console.log(files[0]);
        let file = files[0];
        if(!file) return;

        let zip = await JSZip.loadAsync(file);
        let newFileList = [];
        zip.forEach((relativePath, file) => {
            newFileList.push({
                relativePath: relativePath,
                fileObject: file,
                selected: true,
            });

            if(relativePath === "firestore/monsters.json") {
                file.async("string").then((value) => {
                    console.log(JSON.parse(value));
                })
                file.async("blob").then((value) => {
                    console.log(value);
                })
                
            }
        })

        setFileList(newFileList);
    }

    const restoreOnclick = () => {
        console.log("Restore onclick");
    }

    return (
        <Container>
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
