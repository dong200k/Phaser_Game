import { useEffect, useState } from "react"
import { getEditForm } from "../helpers.js"
import Dropdown from 'react-bootstrap/Dropdown';
import NodeService from "../services/NodeService.js";
import WeaponService from "../services/WeaponService.js"

export default function EditNode({node, updateUpgrade, setEditNode, type}){
    let [form, setForm] = useState(getEditForm(node, type))
    let [nodes, setNodes] = useState([])
    let [weapons, setWeapons] = useState([])
    let dataKeys = ["name", "description", "stat", "weaponId", "effect"]
    let [showZeroStat, setShowZeroStat] = useState(false)
    

    useEffect(()=>{
        NodeService.getAllNodes()
        .then(nodes=>setNodes(nodes))
    },[])

    useEffect(()=>{
        WeaponService.getAllWeapons()
            .then(weapons=>setWeapons(weapons))
    }, [])

    function loadDefaultNode(node){
        setForm(prevForm=>{
            let newForm = getEditForm(node, type)
            
            if(type === "upgrade"){
                delete newForm.data.coinCost
            }else if(type === "skill"){
                delete newForm.data.effect
            }

            newForm.id = prevForm.id

            return newForm
        })
    }

    useEffect(()=>{
        console.log(form)
    }, [form])

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
            }else if(type === "effect"){
                setForm(prevForm=>{
                    let newForm = {...prevForm}
                    newForm.data = {...prevForm.data}
                    newForm.data.effect = {...prevForm.data.effect}

                    if(key === "doesStack"){
                        let val = prevForm.data.effect[key] === 1? 0 : 1
                        newForm.data.effect[key] = val
                    }else{
                        newForm.data.effect[key] = e.target.value
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

        if(typeof form.data.effect.cooldown !== typeof number){
            form.data.effect.cooldown = Number(form.data.effect.cooldown)
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

            {type === "upgrade" &&
                <div>
                    <h3>BaseWeapon</h3>
                    {weaponDropDown}

                    <h3>Effect</h3>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">effectId:</span><input type="text" style={{width: "25%"}}  value={form.data.effect.effectId} onChange={onChange("effect", "effectId")}/>
                    </label>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">cooldown(ms):</span>
                        <input type="number" value={form.data.effect.cooldown} onChange={onChange("effect", "cooldown")}></input>
                    </label>
                    <label className="d-flex justify-content-center">
                        <span className="text-danger">doesStack: {form.data.effect.doesStack} </span>
                        <input type="checkbox" checked={form.data.effect.doesStack} onChange={onChange("effect", "doesStack")}></input>
                    </label>
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