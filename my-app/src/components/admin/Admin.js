import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContextProvider";
import { adminAssignRole, adminGetRole, adminRemoveRole } from "../../services/AdminService";


export default function Admin() {
    const { user } = useContext(UserContext);

    const [uid, setUid] = useState("");
    const [getuid, setGetuid] = useState("");
    const [role, setRole] = useState("");
    const [removeUID, setRemoveUID] = useState("");

    const onChangeUID = (e) => { setUid(e.target.value); } 
    const onChangeRole = (e) => { setRole(e.target.value); }
    const onChangeRemoveUID = (e) => { setRemoveUID(e.target.value); }
    const onChangeGetuid = (e) => { setGetuid(e.target.value); }

    const onAssignRoleSubmit = (e) => {
        e.preventDefault();
        let data = { uid, role };
        adminAssignRole(user, data).then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
        }).catch(e => {
            console.log(e);
        })
    }

    const onSubmitRemoveRole = (e) => {
        e.preventDefault();
        let data = { uid: removeUID };
        adminRemoveRole(user, data).then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
        }).catch(e => {
            console.log(e);
        })
    }

    const onSubmitGetRole = (e) => {
        e.preventDefault();
        let data = { uid: getuid };
        adminGetRole(user, data).then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
        }).catch(e => {
            console.log(e);
        })
    }

    return (
        <div>
            <form onSubmit={onSubmitGetRole}>
                <h3>Get Role: </h3>
                <label htmlFor="getuid">User ID: </label>
                <input name="getuid" type="text" defaultValue={getuid} onChange={onChangeGetuid} />
                <button className="btn btn-primary" type="sumbit">Get Role</button>
            </form>
            <form onSubmit={onAssignRoleSubmit}>
                <h3>Assign Role: </h3>
                <label htmlFor="uid">User ID: </label>
                <input name="uid" type="text" defaultValue={uid} onChange={onChangeUID} />
                <label htmlFor="role">Role: </label>
                <input name="role" type="text" defaultValue={role} onChange={onChangeRole} />
                <button className="btn btn-primary" type="sumbit">Assign Role</button>
            </form>
            <form onSubmit={onSubmitRemoveRole}>
                <h3>Remove Role: </h3>
                <label htmlFor="uid">User ID:</label>
                <input name="uid" type="text" defaultValue={removeUID} onChange={onChangeRemoveUID} />
                <button className="btn btn-danger" type="submit">Remove Role</button>
            </form>
        </div>
    )
}