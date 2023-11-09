import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"
import { sortObject } from "../helpers.js"

export default function Weapon(){
    let [weapon, setWeapon] = useState(undefined)
    let id = useParams().id

    const {getDocument, saveDocument} = useContext(DataContext)

    useEffect(()=>{
       getDocument(id, "weapons")
        .then(weapon=>setWeapon(weapon))
    }, [getDocument, id])

    const save = (e)=>{
        e.preventDefault()
        saveDocument(weapon, "weapons")
    }

    const onChange = (key)=>{
        return (e)=>{
            console.log(e.target.value)
            e.preventDefault()
            setWeapon(prev=>{
                let newWeapon = {...prev}
                newWeapon[key] = e.target.value
                return newWeapon
            })
        }
    }

    return <div style={{backgroundColor: "lightgoldenrodyellow"}}>
        {
            weapon &&
            <form onSubmit={save}>
                <h3 className="text-center">
                    <span className="text-primary">id:<span className="text-dark">{weapon.id}</span> </span>
                </h3>
                {
                    Object.entries(sortObject(weapon)).filter(([key, val])=>key!=="id").map(([key, val])=>
                        <label key={key} className="d-flex justify-content-center">
                            <span className="text-danger">{key}:</span><input style={{width: "25%"}} type="text" value={val} onChange={onChange(key)}/>
                        </label>
                    )
                }
                <button className="btn btn-success" style={{display: "block", margin: "auto", width: "200px"}} type="submit">Save</button>
            </form>
        }
    </div>
}