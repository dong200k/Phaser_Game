import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { deleteMonster, getAllMonsters } from "../../services/MonsterService";
import { UserContext } from "../../contexts/UserContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export default function Monster() {

    const { monsters, refetchAllMonsters } = useContext(DataContext);
    const { user } = useContext(UserContext);
    const { notify } = useContext(NotificationContext);
    const navigate = useNavigate();

    return(
        <Container>
            <h2> List of monsters </h2>
            <p> You can add and edit monsters. Deleting monsters is currently not allowed.</p>
            <Link to={`/monster/create`}>
                <button className="btn btn-info" style={{marginBottom: "16px"}}>Create New Monster</button>
            </Link>
            
            <Stack gap={3}>
                {
                    (monsters?.length ?? 0) === 0 ? "There are no monsters.": 
                    monsters.map((monster) => {
                        return (
                            <div key={monster.name} className="d-flex justify-content-between">
                                <div style={{textAlign: "center", display: "inline-block"}}>
                                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{monster.name}</h3> 
                                </div>
                                <ButtonGroup>
                                    <Button variant="primary" style={{width:"100px"}} onClick={() => {navigate(`/monster/edit/${monster.name}`)}}>
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