import { useState } from "react"
import { getEditForm } from "../helpers.js"

export default function EditNode({node, updateUpgrade, setEditNode, type}){
    let [form, setForm] = useState(getEditForm(node))

    function onChange(type, key){
        return (e)=>{
            if(type === "stat"){
                setForm(prevForm=>{
                    let newForm = {...prevForm}
                    newForm.data.stat = {...prevForm.data.stat}

                    newForm.data.stat[key] = e.target.value

                    return newForm
                })
            }else{
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

        let success = updateUpgrade(form)

        if(success){
            setEditNode(undefined)
            alert("updated tree! not saved yet click save to db to save")
        }

    }

    return (
      <div className="text-center bg-light">
         <form onSubmit={save} className="pt-5 mx-auto">
            <label className="d-flex justify-content-center">
                <span className="text-primary">node name:</span><input style={{width: "25%"}} type="text" value={form.data.name} onChange={onChange("other", "name")}/>
            </label>

            <div className="d-flex justify-content-center">
                <span className="text-primary" style={{display: "inline-block", verticalAlign:"top"}}>description:</span>
                <textarea value={form.data.description} style={{width: "25%"}}  onChange={onChange("other", "description")}/>
            </div>
            
            {type === "upgrade" &&
                <label className="d-flex justify-content-center">
                    <span className="text-primary">weaponId:</span><input type="text" style={{width: "25%"}}  value={form.data.weaponId} onChange={onChange("other", "weaponId")}/>
                </label>
            }
            
            <h3>Stats</h3>
            <div>
            {
                Object.keys(form.data.stat).map(function(key) {
                   return <label>
                        <div className="text-danger">{key}:</div>
                        <input type="number" value={form.data.stat[key]} onChange={onChange("stat",key)}/>
                    </label>
                })
            } 
            </div> 

            <br/><br/>
            <input className="btn btn-success" style={{display: "block", margin: "auto", width: "100px"}} type="submit" value="Save" />
        </form>
        <button className="btn btn-danger" style={{width: "100px"}} onClick={()=>setEditNode(undefined)}>Discard</button>
      </div>
    )
  }