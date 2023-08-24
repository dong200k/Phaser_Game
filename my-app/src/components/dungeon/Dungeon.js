import { useContext } from "react";
import { DataContext } from "../../contexts/DataContextProvider";
import { UserContext } from "../../contexts/UserContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function Dungeon() {

    const { dungeons, refetchAllDungeons } = useContext(DataContext);
    const { user } = useContext(UserContext);
    const { notify } = useContext(NotificationContext);
    const navigate = useNavigate();

    return(
        <Container>
            <h2> List of dungeons </h2>
            <p>You can add and edit dungeons. Deleting dungeons is currently not allowed.</p>
            <Link to={`/dungeon/create`}>
                <button className="btn btn-info" style={{marginBottom: "16px"}}>Create Dungeon</button>
            </Link>
            <Stack gap={3}>
                {
                    (dungeons?.length ?? 0) === 0 ? "There are no dungeons.": 
                    dungeons.map((dungeon) => {
                        return (
                            <div key={dungeon.name} className="d-flex justify-content-between">
                                <div style={{textAlign: "center", display: "inline-block"}}>
                                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{dungeon.name}</h3>    
                                </div>
                                <ButtonGroup>
                                    <Button variant="primary" style={{width:"100px"}} onClick={() => {
                                        navigate(`/dungeon/edit/${dungeon.name}`)
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