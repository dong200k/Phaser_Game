import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"

export default function Abilities(){
    const {abilities, createDocument, deleteDocument} = useContext(DataContext)

    const createNewAbility = ()=>{
        createDocument("abilities")
    }

    const deleteAbility = async (id)=>{
        deleteDocument(id, "abilities")
    }

    return <div style={{backgroundColor: "#ff8080"}}>
        <button className="btn btn-success" onClick={createNewAbility}>Create New Ability</button>
        {abilities.map((ability)=>
            <div className="d-flex justify-content-between mb-3" style={{width: "50%"}} key={ability.id}>
                <div style={{textAlign: "center", display: "inline-block"}}>
                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{ability.name}</h3> 
                    <Link to={`/abilities/${ability.id}`}><button className="btn btn-warning">edit</button></Link>
                </div>
                <button className="btn btn-danger" onClick={()=>deleteAbility(ability.id)}>delete</button>
            </div>)}
    </div>
}