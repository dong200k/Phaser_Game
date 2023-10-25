import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Dropdown from 'react-bootstrap/Dropdown';
import { DataContext } from "../contexts/DataContextProvider.js";

export default function Role(){
    let [weaponUpgrades, setWeaponUpgrades] = useState([])
    let [showZeroStat, setShowZeroStat] = useState(false)
    let [role, setRole] = useState(undefined)
    let id = useParams().id
    let objectKeys = ["stat", "weaponUpgradeId", "abilityId", "id", "coinCost"]

    const {roles, upgrades, abilities, getDocument, saveDocument} = useContext(DataContext)

    useEffect(()=>{
        getDocument(id, "roles")
            .then((document)=>setRole(document))
            
        setWeaponUpgrades(upgrades.filter(upgrade=>upgrade.type==="weapon"))
        
    }, [getDocument, id, upgrades])

    const save = (e)=>{
        e.preventDefault()
        saveDocument(role, "roles")
    }

    const onChange = (name, key)=>{
        return (e)=>{
            console.log(e.target.value)
            e.preventDefault()
            if(name === "stat"){
                setRole(prev=>{
                    let newRole = {...prev}
                    newRole.stat[key] = e.target.value
                    return newRole
                })
            }else{
                setRole(prev=>{
                    let newRole = {...prev}
                    newRole[key] = e.target.value
                    return newRole
                })
            }
        }
    }

    let weaponUpgradeDropDown = 
    <Dropdown className="mb-5">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            Weapon Upgrade: {weaponUpgrades.find((weapon)=>weapon.id===role?.weaponUpgradeId)?.name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {weaponUpgrades.map(weapon=>{
                return <Dropdown.Item onClick={()=>setRole(prev=>{
                    let newRole = {...prev}
                    newRole.weaponUpgradeId = weapon.id
                    return newRole
                })}>{`name: ${weapon.name}`} <span className="text-danger">id: {weapon.id}</span></Dropdown.Item>
            })}
            <Dropdown.Item onClick={()=>setRole(prev=>{
                    let newRole = {...prev}
                    newRole.weaponUpgradeId = ""
                    return newRole
                })}>none</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

    let abilityDropDown = 
    <Dropdown className="mb-5">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            Ability: {abilities.find((ability)=>ability.id===role?.abilityId)?.name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {abilities.map(ability=>{
                return <Dropdown.Item onClick={()=>setRole(prev=>{
                    let newRole = {...prev}
                    newRole.abilityId = ability.id
                    return newRole
                })}>{`name: ${ability.name}`} <span className="text-danger">id: {ability.id}</span></Dropdown.Item>
            })}
            <Dropdown.Item onClick={()=>setRole(prev=>{
                    let newRole = {...prev}
                    newRole.abilityId = ""
                    return newRole
                })}>none</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

    return <div style={{backgroundColor: "lightsteelblue"}}>
        {
            role &&
            <form onSubmit={save}>
                <h3 className="text-center">
                    <span className="text-primary">id:<span className="text-dark">{role.id}</span> </span>
                </h3>
                {
                    Object.entries(role).filter(([key, val])=>!objectKeys.includes(key)).map(([key, val])=>
                        <label key={key} className="d-flex justify-content-center">
                            <span className="text-danger">{key}:</span><input style={{width: "25%"}} type="text" value={val} onChange={onChange("", key)}/>
                        </label>
                    )
                }

                <label className="d-flex justify-content-center">
                    <span className="text-danger">coinCost:</span><input style={{width: "25%"}} type="number" value={role.coinCost} onChange={onChange("", "coinCost")}/>
                </label>


                <div className="d-flex justify-content-center mt-5">
                    {weaponUpgradeDropDown}
                </div>

                <div className="d-flex justify-content-center">
                    {abilityDropDown}
                </div>

                <div className="d-flex flex-row justify-content-center">
                    <h3>Stats</h3>
                    <label className="d-flex justify-content-center">
                        Show Zero
                        <input type="checkbox" onChange={()=>setShowZeroStat((prev)=>!prev)}></input>
                    </label>
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                {
                    Object.keys(role.stat).filter(key=>showZeroStat || role.stat[key]!=0).map(function(key) {
                        let label = key
                        if(key === "critRate" || key === "critDamage") label += " percent"
                        return <label className={role.stat[key]==0? "" : "bg-info"}>
                            <div className={"text-danger"}>{label}:</div>
                            <input type="number" value={role.stat[key]} onChange={onChange("stat", key)}/>
                        </label>
                    })
                } 
                </div> 
                <button className="btn btn-success" style={{display: "block", margin: "auto", width: "200px"}} type="submit">Save</button>
            </form>
        }
    </div>
}