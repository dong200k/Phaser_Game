import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AbilityService from "../services/AbilityService.js"

export default function Abilities(){
    let [abilities, setAbilities] = useState([])

    useEffect(()=>{
        AbilityService.getAllAbilities()
            .then(abilities=>setAbilities(abilities))
    }, [])

    const createNewAbility = async ()=>{
        let result = await AbilityService.createAbility()

        if(result.status === 201){
            let role = await result.json()
            setAbilities(prev=>[role, ...prev])
        }
    }

    const deleteAbility = async (id)=>{
        let name = abilities.filter(role=>role.id==id)[0].name

        if(window.confirm(`are you sure you want to delete "${name}"`)){
            let result = await AbilityService.deleteAbility(id)

            if(result.status === 200) {
                alert(`deleted ${name} successfully`)
                setAbilities(prev=>prev.filter((ability)=>ability.id !== id))
            }
        }
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