import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../../contexts/DataContextProvider";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export default function Asset() {

    const { assets } = useContext(DataContext);
    const { notify } = useContext(NotificationContext);
    const navigate = useNavigate();

    return (
        <Container>
            <h2>List of Assets</h2>
            <p> Assets contains infomation that can retrieve a certain image, audio, or aseprite data. You can add assets. Deleting assets is currently not allowed.</p>
            <Link to={`/asset/create`}>
                <button className="btn btn-info" style={{marginBottom: "16px"}}>Upload Asset</button>
            </Link> 
            <Stack gap={3}>
            {
                (assets?.length ?? 0) === 0 ? "There are no assets.": 
                    assets.map((asset) => {
                        return (
                            <div key={asset.name} className="d-flex justify-content-between">
                                <div style={{textAlign: "center", display: "inline-block"}}>
                                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{asset.name}</h3> 
                                </div>
                                <ButtonGroup>
                                    <Button variant="primary" style={{width:"100px"}} onClick={() => {
                                        navigate(`/asset/edit/${asset.name}`)
                                    }}>
                                            Edit
                                    </Button>
                                    <Button variant="danger" style={{width:"100px"}} onClick={() => {
                                        notify({message: "Cannot delete on my-app. Please manually delete on firebase."})
                                    }}>
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </div>
                        )
                    })
            }
            </Stack>
        </Container>
    )

}
