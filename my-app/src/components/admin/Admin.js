import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContextProvider";
import { adminAssignRole, adminGetRole, adminRemoveRole } from "../../services/AdminService";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Container from 'react-bootstrap/Container';
import SubmitButton from "../forms/SubmitButton";
import Form from "react-bootstrap/Form";

export default function Admin() {
    const { user } = useContext(UserContext);
    const { notifyResponse } = useContext(NotificationContext);

    const [uid, setUid] = useState("");
    const [getuid, setGetuid] = useState("");
    const [role, setRole] = useState("");
    const [removeUID, setRemoveUID] = useState("");
    const [ sendingRequestGet, setSendingRequestGet ] = useState(false);
    const [ sendingRequestAssign, setSendingRequestAssign ] = useState(false);
    const [ sendingRequestRemove, setSendingRequestRemove ] = useState(false);


    const onChangeUID = (e) => { setUid(e.target.value); } 
    const onChangeRole = (e) => { setRole(e.target.value); }
    const onChangeRemoveUID = (e) => { setRemoveUID(e.target.value); }
    const onChangeGetuid = (e) => { setGetuid(e.target.value); }

    const onAssignRoleSubmit = (e) => {
        e.preventDefault();
        setSendingRequestAssign(true);
        let data = { uid, role };
        adminAssignRole(user, data).then(res => {
            notifyResponse(res);
            setSendingRequestAssign(false);
        })
    }

    const onSubmitRemoveRole = (e) => {
        e.preventDefault();
        setSendingRequestRemove(true);
        let data = { uid: removeUID };
        adminRemoveRole(user, data).then(res => {
            notifyResponse(res);
            setSendingRequestRemove(false);
        })
    }

    const onSubmitGetRole = (e) => {
        e.preventDefault();
        setSendingRequestGet(true);
        let data = { uid: getuid };
        adminGetRole(user, data).then(res => {
            notifyResponse(res);
            setSendingRequestGet(false);
        })
    }

    return (
        <Container>
            
            <Form onSubmit={onSubmitGetRole} className="mb-5 mt-3">
                <h3>Get Role: </h3>
                <Form.Group className="mb-3" controlId="getRoleUID">
                    <Form.Label>User ID:</Form.Label>
                    <Form.Control type="text" placeholder="Enter user id..." onChange={onChangeGetuid}/>
                    <Form.Text>Enter user ID that is found on firebase.</Form.Text>
                </Form.Group>
                <SubmitButton variant="primary" disabled={sendingRequestGet}>
                    Get Role
                </SubmitButton>
            </Form>
            
            <Form onSubmit={onAssignRoleSubmit} className="mb-5">
                <h3>Assign Role: </h3>
                <Form.Group className="mb-3" controlId="assignRoleUID">
                    <Form.Label>User ID: </Form.Label>
                    <Form.Control type="text" placeholder="Enter user id..." onChange={onChangeUID} />
                    <Form.Text>Enter user ID that is found on firebase.</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="assignRoleType">
                    <Form.Label>Role Name: </Form.Label>
                    <Form.Control type="text" placeholder="Enter user id..." onChange={onChangeRole} />
                    <Form.Text>Avaliable roles: 'gamemaster'</Form.Text>
                </Form.Group>

                <SubmitButton variant="primary" disabled={sendingRequestAssign}>
                    Assign Role
                </SubmitButton>
            </Form>

            <Form onSubmit={onSubmitRemoveRole}>
                <h3>Remove Role: </h3>
                <Form.Group className="mb-3" controlId="removeRoleUID">
                    <Form.Label>User ID: </Form.Label>
                    <Form.Control type="text" placeholder="Enter user id..." onChange={onChangeRemoveUID} />
                    <Form.Text>Enter the ID of the user that will have their roles removed.</Form.Text>
                </Form.Group>
                
                <SubmitButton variant="danger" disabled={sendingRequestRemove}>
                    Remove Role
                </SubmitButton>
            </Form>
        </Container>
    )
}