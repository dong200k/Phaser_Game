import { useState } from "react";

export default function CreateAsset() {

    const [ type, setType ] = useState("");
    const [ name, setName ] = useState("");
    const [ image, setImage ] = useState("");
    const [ json, setJson ] = useState("");
    const [ audio, setAudio ] = useState("");

    const onChangeName = (e) => { setName(e.target.value); }
    const onChangeType = (e) => { setType(e.target.value); }
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
        let data = {
            name: name,
            type: type,
            image: image,
            json: json,
            audio: audio,
        }
        console.log(image);
    }

    return (
        <div>
            <h2> Create Asset! </h2>
            <form onSubmit={onSubmit} id="assetForm">
                <label htmlFor="type">Asset Type: </label>
                <input name="type" type="string" onChange={onChangeType}/>
                <br />
                <label htmlFor="name">Name/Id: </label>
                <input name="name" type="string" onChange={onChangeName}/>
                <br />
                <label htmlFor="image">Upload Image: </label>
                <input name="image" type="file" accept="image/*" onChange={onChangeImage}/>
                <br />
                <label htmlFor="json">Upload JSON: </label>
                <input name="json" type="file" accept=".json" onChange={onChangeJson}/>
                <br />
                <button className="btn btn-primary">Upload Asset</button>
            </form>
        </div>
    )
}
