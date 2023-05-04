import { useState } from "react"
import { getDeepCopy } from "../util.js"

export default function EditNode({node, updateUpgrade, setEditNode}){
    let [form, setForm] = useState(getDeepCopy(node))

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
                    newForm.data[key] = e.target.value
                    return newForm
                })
            }
        }
    }

    function save(e){
        e.preventDefault()
        let success = updateUpgrade(form)

        if(success){
            setEditNode(undefined)
            alert("updated tree! not saved yet click save to db to save")
        }

    }

    return (
      <div className="text-center bg-light">
         <form onSubmit={save}>
            <label style={{display:"inline-block"}}>
                <span className="text-primary">node name:</span><input type="text" value={form.data.name} onChange={onChange("other", "name")}/>
            </label>

            <div className="flex-row">
                <h3 className="text-primary" style={{display: "inline-block", marginTop: 0}}>description</h3>
                <textarea value={form.data.description} onChange={onChange("other", "description")}/>
            </div>
                        
            <label style={{display:"block"}}>
               <span className="text-danger">weaponId:</span><input type="text" value={form.data.weaponId} onChange={onChange("other", "weaponId")}/>
            </label>

            {
                Object.keys(form.data.stat).map(function(key) {
                   return <label style={{display:"block"}}>
                        <span className="text-danger">{key}:</span><input type="text" value={form.data.stat[key]} onChange={onChange("stat",key)}/>
                    </label>
                })
            }  

            
            <input className="btn btn-success" type="submit" value="Save" />
        </form>
        <button className="btn btn-danger" onClick={()=>setEditNode(undefined)}>Discard</button>
      </div>
    )
  }