import { useContext, useEffect, useState } from "react"
import { getEditForm } from "../helpers.js"
import Dropdown from 'react-bootstrap/Dropdown';
import effectTypes from "../effectTypes.js";
import { DataContext } from "../contexts/DataContextProvider.js";

export default function EditNode({node, updateUpgrade, setEditNode, type}){
    let [form, setForm] = useState(getEditForm(node, type))
    let dataKeys = ["name", "description", "stat", "weaponId", "upgradeEffect", "status", "selectionTime"]
    let nodeStatuses = ["none", "selected", "skipped"]
    let [showZeroStat, setShowZeroStat] = useState(false)

    const {nodes, weapons} = useContext(DataContext)

    function loadDefaultNode(node){
        setForm(prevForm=>{
            let newForm = getEditForm(node, type)
            
            if(type === "upgrade"){
                delete newForm.data.coinCost
            }else if(type === "skill"){
                delete newForm.data.upgradeEffect
            }

            newForm.id = prevForm.id

            return newForm
        })
    }

    function onChange(type, key){
        return (e)=>{
            console.log(key)
            if(type === "stat"){
                setForm(prevForm=>{
                    let newForm = {...prevForm}
                    newForm.data = {...prevForm.data}
                    newForm.data.stat = {...prevForm.data.stat}

                    newForm.data.stat[key] = e.target.value

                    return newForm
                })
            }else if(type === "upgradeEffect"){
                setForm(prevForm=>{
                    let newForm = {...prevForm}
                    newForm.data = {...prevForm.data}
                    newForm.data.upgradeEffect = {...prevForm.data.upgradeEffect}

                    if(key === "doesStack"){
                        let val = prevForm.data.upgradeEffect[key] === 1? 0 : 1
                        newForm.data.upgradeEffect[key] = val
                    }else{
                        newForm.data.upgradeEffect[key] = e.target.value
                    }

                    return newForm
                })
            }
            else{
                setForm(prevForm=>{
                    let newForm = {...prevForm}
                    newForm.data = {...prevForm.data}
                    newForm.data[key] = String(e.target.value)
                    return newForm
                })
            }
        }
    }

    function save(e){
        e.preventDefault()
        Object.entries(form.data.stat).forEach(([key,val])=>{
            form.data.stat[key] = Number(val)
        })

        if(type === "upgrade" && typeof form.data.upgradeEffect.cooldown !== typeof number){
            form.data.upgradeEffect.cooldown = Number(form.data.upgradeEffect.cooldown)
        }

        if(type === "upgrade" && typeof form.data.selectionTime !== typeof number){
            form.data.selectionTime = Number(form.data.selectionTime)
        }

        if(type === "upgrade" ){
            form.data.doesStack = form.data.doesStack === 1? true:false
            if(form.data.collisionGroup) form.data.collisionGroup = Number(form.data.collisionGroup)
        }

        if(type === "skill"){
            form.data.coinCost = Number(form.data.coinCost)
        }

        let success = updateUpgrade(form)

        if(success){
            setEditNode(undefined)
            alert("updated tree! not saved yet click save to db to save")
        }

    }

    let dropDown =
    <Dropdown className="mb-5">
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
            Select default node to load
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {nodes.map(node=>{
                return <Dropdown.Item onClick={()=>loadDefaultNode(node)}>{node.data.name}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>

    let weaponDropDown = 
    <Dropdown className="mb-5">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            Weapon: {weapons.find((weapon)=>weapon.id===form.data.weaponId)?.name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {weapons.map(weapon=>{
                return <Dropdown.Item onClick={()=>setForm(prev=>{
                    let newForm = {...prev}
                    newForm.data['weaponId'] = weapon.id
                    return newForm
                })}>{weapon.name}</Dropdown.Item>
            })}
            <Dropdown.Item onClick={()=>setForm(prev=>{
                    let newForm = {...prev}
                    newForm.data['weaponId'] = ""
                    return newForm
                })}>none</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

    let effectTypeDropDown
    if(type==="upgrade"){
        effectTypeDropDown =  
        <Dropdown className="mb-5">
            <Dropdown.Toggle variant="info" id="dropdown-basic">
                Type: {form.data.upgradeEffect.type}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {effectTypes.map(type=>{
                    return <Dropdown.Item onClick={()=>setForm(prev=>{
                        let newForm = {...prev}
                        newForm.data.upgradeEffect.type = type
                        return newForm
                    })}>{type}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    }
    

    let statusDropDown = 
    <Dropdown className="mb-5">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            Status: {form.data.status}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {nodeStatuses.map(status=>{
                return <Dropdown.Item onClick={()=>setForm(prev=>{
                    let newForm = {...prev}
                    newForm.data.status = status
                    return newForm
                })}>{status}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>

    return (
      <div className="text-center bg-light">
         <form onSubmit={save} className="pt-5 mx-auto">
            {dropDown}
            <label className="d-flex justify-content-center">
                <span className="text-primary">node name:</span><input style={{width: "25%"}} type="text" value={form.data.name} onChange={onChange("other", "name")}/>
            </label>

            <div className="d-flex justify-content-center">
                <span className="text-primary" style={{display: "inline-block", verticalAlign:"top"}}>description:</span>
                <textarea value={form.data.description} style={{width: "25%"}}  onChange={onChange("other", "description")}/>
            </div>

            <h3>Selection Status: <span className="">{form.data.status}</span></h3>
            {statusDropDown}

            {
                form.data.status === "selected" && type === "upgrade" &&
                <label className="d-flex justify-content-center">
                    <div>
                        <span className="text-danger">Selection Time/Order</span>
                        <input type="number" value={form.data.selectionTime} onChange={onChange("other", "selectionTime")}></input>
                    </div>
                </label> 
            }
            

            <br/><br/>

            {type === "upgrade" &&
                <div>
                    <h3>BaseWeapon</h3>
                    {form.data.weaponId? <div>WeaponId: {form.data.weaponId}</div>: <></>}
                    {weaponDropDown}

                    <h3>Upgrade Effect</h3>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">effectLogicId:</span><input type="text" style={{width: "25%"}}  value={form.data.upgradeEffect.effectLogicId} onChange={onChange("upgradeEffect", "effectLogicId")}/>
                    </label>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">cooldown(ms):</span>
                        <input type="number" value={form.data.upgradeEffect.cooldown} onChange={onChange("upgradeEffect", "cooldown")}></input>
                    </label>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">collisionGroup:</span>
                        <input type="number" value={form.data.upgradeEffect.collisionGroup} onChange={onChange("upgradeEffect", "collisionGroup")}></input>
                    </label>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">doesStack: {form.data.upgradeEffect.doesStack} </span>
                        <input type="checkbox" checked={form.data.upgradeEffect.doesStack} onChange={onChange("upgradeEffect", "doesStack")}></input>
                    </label>
                    {effectTypeDropDown}
                    <br></br>
                </div>
            }
            
            <div className="d-flex flex-row justify-content-center">
                <h3>Stats</h3>
                <label className="d-flex justify-content-center">
                    Show Zero
                    <input type="checkbox" onChange={()=>setShowZeroStat((prev)=>!prev)}></input>
                </label>
            </div>
            <div>
            {
                Object.keys(form.data.stat).filter(key=>showZeroStat || form.data.stat[key]!=0).map(function(key) {
                    let label = key
                    if(key === "critRate" || key === "critDamage") label += " percent"
                    return <label className={form.data.stat[key]==0? "" : "bg-info"}>
                        <div className={"text-danger"}>{label}:</div>
                        <input type="number" value={form.data.stat[key]} onChange={onChange("stat",key)}/>
                    </label>
                })
            } 
            </div> 

            <br/><br/>
            <h3>Other:</h3>
            {
            Object.keys(form.data)
                .filter((key)=>!dataKeys.includes(key))
                .map(function(key) {
                    return <label>
                         <div className="text-danger">{key}:</div>
                         <input type="number" value={form.data[key]} onChange={onChange("other",key)}/>
                     </label>
                 })
            }   

            <br/><br/>
            <input className="btn btn-success" style={{display: "block", margin: "auto", width: "100px"}} type="submit" value="Save" />
        </form>
        <button className="btn btn-danger" style={{width: "100px"}} onClick={()=>setEditNode(undefined)}>Discard</button>
      </div>
    )
  }