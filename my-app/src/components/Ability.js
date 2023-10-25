import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"
import { sortObject } from "../helpers.js"

export default function Ability(){
    const {getDocument, saveDocument} = useContext(DataContext)
    let [ability, setAbility] = useState(undefined)
    let id = useParams().id
    let objectKeys = ["id"]

    useEffect(()=>{
        getDocument(id, "abilities")
            .then(ability=> setAbility(ability))
    }, [id, getDocument])

    const save = (e)=>{
        e.preventDefault()
        saveDocument(ability, "abilities")
    }

    const onChange = (key)=>{
        return (e)=>{
            console.log(e.target.value)
            e.preventDefault()
            setAbility(prev=>{
                let newAbility = {...prev}
                newAbility[key] = e.target.value
                return newAbility
            })
        }
    }

    return <div style={{backgroundColor: "#ffe6e6"}}>
        {
            ability &&
            <form onSubmit={save}>
                <h3 className="text-center">
                    <span className="text-primary">id:<span className="text-dark">{ability.id}</span> </span>
                </h3>
                {
                    Object.entries(sortObject(ability)).filter(([key, val])=>!objectKeys.includes(key)).map(([key, val])=>
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