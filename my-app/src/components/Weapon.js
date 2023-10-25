import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"

export default function Weapon(){
    let [weapon, setWeapon] = useState(undefined)
    let id = useParams().id

    const {getDocument, saveDocument} = useContext(DataContext)

    useEffect(()=>{
       getDocument(id, "weapons")
        .then(weapon=>setWeapon(weapon))
    }, [getDocument, id])

    const save = async (e)=>{
        e.preventDefault()
        let success = await saveDocument(weapon, "weapons")

        if(success) alert("saved to db successfully")
        else alert("failed to save")
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
                    Object.entries(weapon).filter(([key, val])=>key!=="id").map(([key, val])=>
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