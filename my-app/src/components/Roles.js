import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import RoleService from "../services/RoleService.js"

export default function Roles(){
    let [roles, setRoles] = useState([])

    useEffect(()=>{
        RoleService.getAllRoles()
            .then(roles=>setRoles(roles))
    }, [])

    const createNewRole = async ()=>{
        let result = await RoleService.createRole()

        if(result.status === 201){
            let role = await result.json()
            setRoles(prev=>[role, ...prev])
        }
    }

    const deleteRole = async (id)=>{
        let name = roles.filter(role=>role.id==id)[0].name

        if(window.confirm(`are you sure you want to delete "${name}"`)){
            let result = await RoleService.deleteRole(id)

            if(result.status === 200) {
                alert(`deleted ${name} successfully`)
                setRoles(prev=>prev.filter((role)=>role.id !== id))
            }
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