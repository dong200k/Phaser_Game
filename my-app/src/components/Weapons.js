import { useEffect, useState } from "react"
import WeaponService from "../services/WeaponService.js"
import { Link } from "react-router-dom"

export default function Weapons(){
    let [weapons, setWeapons] = useState([])

    useEffect(()=>{
        WeaponService.getAllWeapons()
            .then(weapons=>setWeapons(weapons))
    }, [])

    const createNewWeapon = async ()=>{
        let result = await WeaponService.createWeapon()

        if(result.status === 201){
            let weapon = await result.json()
            setWeapons(prev=>[weapon, ...prev])
        }
    }

    const deleteWeapon = async (id)=>{
        let name = weapons.filter(weapon=>weapon.id==id)[0].name

        if(window.confirm(`are you sure you want to delete "${name}"`)){
            let result = await WeaponService.deleteWeapon(id)

            if(result.status === 200) {
                alert(`deleted ${name} successfully`)
                setWeapons(prev=>prev.filter((weapon)=>weapon.id !== id))
            }
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