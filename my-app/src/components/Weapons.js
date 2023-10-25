import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"

export default function Weapons(){
    const {weapons, createDocument, deleteDocument} = useContext(DataContext)

    const createNewWeapon = ()=>{
        createDocument("weapons")
    }

    const deleteWeapon = (id)=>{
        let name = weapons.filter(weapon=>weapon.id==id)[0].name

        if(window.confirm(`are you sure you want to delete "${name}"`)){
            deleteDocument(id, "weapons")
        }
    }

    return <div style={{backgroundColor: "lightgoldenrodyellow"}}>
        <button className="btn btn-success" onClick={createNewWeapon}>Create New Weapon</button>
        {weapons.map((weapon)=>
            <div className="d-flex justify-content-between mb-3" style={{width: "50%"}} key={weapon.id}>
                <div style={{textAlign: "center", display: "inline-block"}}>
                    <h3 style={{display: "inline-block", marginRight: "10px"}}>{weapon.name}</h3> 
                    <Link to={`/weapon/${weapon.id}`}><button className="btn btn-warning">edit</button></Link>
                </div>
                <button className="btn btn-danger" onClick={()=>deleteWeapon(weapon.id)}>delete</button>
            </div>)}
    </div>
}