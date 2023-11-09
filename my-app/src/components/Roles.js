import { useContext } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"

export default function Roles(){
    const {roles, createDocument, deleteDocument} = useContext(DataContext)

    const createNewRole = async ()=>{
        createDocument("roles")
    }

    const deleteRole = async (id)=>{
        let name = roles.filter(role=>role.id==id)[0].name

        if(window.confirm(`are you sure you want to delete "${name}"`)){
            deleteDocument(id, "roles")
        }
    }

    return <div style={{backgroundColor: "lightsteelblue"}}>
        <button className="btn btn-success" onClick={createNewRole}>Create New Role</button>
        {roles.map((role)=>
            <div className="d-flex justify-content-between mb-3" style={{width: "50%"}} key={role.id}>
                <div style={{textAlign: "center", display: "inline-block"}}>
                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{role.name}</h3> 
                    <Link to={`/role/${role.id}`}><button className="btn btn-warning">edit</button></Link>
                </div>
                <button className="btn btn-danger" onClick={()=>deleteRole(role.id)}>delete</button>
            </div>)}
    </div>
}