import { useContext, useState } from "react";
import DropDown from "react-bootstrap/Dropdown";
import { uploadAsset } from "../../services/AssetService";
import { UserContext } from "../../contexts/UserContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import SubmitButton from "../forms/SubmitButton";

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
    const [ locUrl, setLocUrl ] = useState("");
    const [ sendingRequest, setSendingRequest ] = useState(false);

    // Setup onchange handlers
    const onChangeName = (e) => { setName(e.target.value); }
    const onChangeLocType = (type) => { setLocType(type); }
    const onChangeType = (type) => { setType(type); }
    const onChangeLocUrl = (e) => { setLocUrl(e.target.value); }
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

    // Changes view based on the typeDataView value.
    let typeDataView = ( <div>No data Needed for this asset type</div> )
    switch(type) {
        case "images": {
            typeDataView = ( 
                <div>
                    <label htmlFor="image">Upload Image: </label>
                    <input name="image" type="file" accept="image/*" onChange={onChangeImage}/>
                    <br />
                </div>
            )
        } break;
        case "audios": {
            typeDataView = ( 
                <div>
                    <label htmlFor="image">Upload Audio: </label>
                    <input name="image" type="file" accept="audio/*" onChange={onChangeAudio}/>
                    <br />
                </div>
            )
        } break;
        case "aseprite": {
            typeDataView = ( 
                <div>
                    <label htmlFor="image">Upload Image: </label>
                    <input name="image" type="file" accept="image/*" onChange={onChangeImage}/>
                    <br />
                    <label htmlFor="json">Upload JSON: </label>
                    <input name="json" type="file" accept=".json" onChange={onChangeJson}/>
                    <br />
                </div>
            )
        }
    }

    // Changes view based on the locType value.
    let locData = ( <div>Error no storage location.</div> )
    switch(locType) {
        case "firebaseCloudStorage": {
            locData = (
                <div>
                    <label>
                        Asset Type:
                        <DropDown>
                            <DropDown.Toggle variant="success"> {type} </DropDown.Toggle>
                            <DropDown.Menu>
                                <DropDown.Item onClick={() => onChangeType("images")}>images</DropDown.Item>
                                <DropDown.Item onClick={() => onChangeType("audios")}>audios</DropDown.Item>
                                <DropDown.Item onClick={() => onChangeType("aseprite")}>aseprite</DropDown.Item>
                            </DropDown.Menu>
                        </DropDown>
                    </label>
                    <br />
                    {typeDataView}
                </div>
            )
        } break;
        case "locally": {
            locData = (
                <div>
                    <label htmlFor="locUrl">URL of the locally stored asset data: </label>
                    <input name="locUrl" type="string" onChange={onChangeLocUrl}/>
                </div>
            )
        } break;
    }

    return (
        <Container>
            <h2> Create Asset! </h2>
            <Form onSubmit={onSubmit} id="assetForm">
                <SubmitButton disabled={sendingRequest} variant="primary">
                    Upload Asset
                </SubmitButton>
                <br/>
                <br />

                <label htmlFor="name">Name/Id: </label>
                <input name="name" type="string" onChange={onChangeName}/>
                <br/>
                <br/>

                <label>
                    Where should the asset data be stored?
                    <DropDown>
                        <DropDown.Toggle variant="success"> {locType} </DropDown.Toggle>
                        <DropDown.Menu>
                            <DropDown.Item onClick={() => onChangeLocType("firebaseCloudStorage")}>Firebase Cloud Storage</DropDown.Item>
                            <DropDown.Item onClick={() => onChangeLocType("locally")}>Locally</DropDown.Item>
                        </DropDown.Menu>
                    </DropDown>
                </label>
                <br/> 
                <br/>   

                {locData}

            </Form>
        </Container>
    )
}
