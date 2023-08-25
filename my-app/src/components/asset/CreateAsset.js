import { useContext, useState } from "react";
import DropDown from "react-bootstrap/Dropdown";
import { uploadAsset } from "../../services/AssetService";
import { UserContext } from "../../contexts/UserContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import SubmitButton from "../forms/SubmitButton";
import TextField from "../forms/TextField";
import FileField from "../forms/FileField";
import DropDownField from "../forms/DropDownField";

export default function CreateAsset() {

    // Load contexts
    const { user } = useContext(UserContext);
    const { refetchAllAssets } = useContext(DataContext);
    const { notifyResponse } = useContext(NotificationContext);

    const navigate = useNavigate();
    // Load states
    const [ type, setType ] = useState("images");
    const [ name, setName ] = useState("");
    const [ image, setImage ] = useState("");
    const [ json, setJson ] = useState("");
    const [ audio, setAudio ] = useState("");
    const [ locType, setLocType ] = useState("firebaseCloudStorage");
    const [ locUrl, setLocUrl ] = useState(""); // Local url 1.
    const [ locUrl2, setLocUrl2 ] = useState(""); // Local url 2.
    const [ sendingRequest, setSendingRequest ] = useState(false); // Flag for if a request is being sent.

    // Setup onchange handlers
    const onChangeName = (e) => { setName(e.target.value); }
    const onChangeLocType = (type) => { setLocType(type); }
    const onChangeType = (type) => { setType(type); }
    const onChangeLocUrl = (e) => { setLocUrl(e.target.value); }
    const onChangeLocUrl2 = (e) => { setLocUrl2(e.target.value); } 
    const onChangeImage = (e) => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => { setImage(fileReader.result); }
    }
    const onChangeJson = (e) => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => { setJson(fileReader.result); }
    }
    const onChangeAudio = (e) => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => { setAudio(fileReader.result); }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setSendingRequest(true);
        let data = {
            name: name,
            type: type,
            image: image,
            json: json,
            audio: audio,
            locType: locType,
            locUrl: locUrl,
            locUrl2: locUrl2,
        }
        uploadAsset(user, data).then((res) => {
            if(res.status === 200) {
                refetchAllAssets();
                navigate("/asset");
            }
            notifyResponse(res);
            setSendingRequest(false);
        })
    }

    // The view of the assets
    let assetInfoView = ( <div>No data Needed for this asset type</div> )
    switch(type) {
        case "images": {
            assetInfoView = ( 
                locType === "firebaseCloudStorage" ?
                <FileField 
                    controlId="image"
                    label="Upload Image:"
                    onChange={onChangeImage}
                    accept="image/*"
                />
                : <TextField 
                    controlId="locUrl" 
                    label="URL of the locally stored image:" 
                    text="E.g. images/button/button_small_active.png"
                    value={locUrl} 
                    onChange={onChangeLocUrl} 
                />
            )
        } break;
        case "audios": {
            assetInfoView = ( 
                locType === "firebaseCloudStorage" ?
                <FileField 
                    controlId="audio"
                    label="Upload Audio:"
                    onChange={onChangeAudio}
                    accept="audio/*"
                />
                : 
                <TextField 
                    controlId="locUrl" 
                    label="URL of the locally stored audio:" 
                    text="E.g. audio/button_click1.mp3"
                    value={locUrl} 
                    onChange={onChangeLocUrl} 
                />
            )
        } break;
        case "aseprite": {
            assetInfoView = ( 
                locType === "firebaseCloudStorage" ?
                <>
                    <FileField 
                        controlId="image"
                        label="Upload Image:"
                        onChange={onChangeImage}
                        accept="image/*"
                    />
                    <FileField 
                        controlId="json"
                        label="Upload JSON:"
                        onChange={onChangeJson}
                        accept=".json"
                    />
                </>
                : <>
                    <TextField 
                        controlId="locUrl"
                        label="URL of the locally stored aseprite image:"
                        value={locUrl}
                        onChange={onChangeLocUrl}
                    />
                    <TextField 
                        controlId="locUrl2"
                        label="URL of the locally stored aseprite json:"
                        value={locUrl2}
                        onChange={onChangeLocUrl2}
                    />
                </>
            )
        }
    }

    return (
        <Container>
            <h2> Create Asset! </h2>
            <Form onSubmit={onSubmit} id="assetForm">
                <SubmitButton disabled={sendingRequest} variant="primary">
                    Upload Asset
                </SubmitButton>
                <br/>
                <br/>

                <TextField 
                    controlId="name" 
                    label="Name/Id:" 
                    value={name} 
                    onChange={onChangeName}
                    text="Names should be unique."
                />

                <br/>
                <br/>

                <DropDownField 
                    controlId={"storageLocation"} 
                    onChange={(e) => onChangeLocType(e.target.value)} 
                    value={locType}
                    label="Storage Location: "
                >
                    <option>firebaseCloudStorage</option>
                    <option>locally</option>
                </DropDownField>

                <DropDownField 
                    controlId={"assetType"} 
                    onChange={(e) => onChangeType(e.target.value)} 
                    value={type}
                    label="Asset Type: "
                >
                    <option>images</option>
                    <option>audios</option>
                    <option>aseprite</option>
                </DropDownField>
                    
                <br/>
                <br/>
                <h2>Asset Data</h2>
                {assetInfoView}
            </Form>
        </Container>
    )
}
