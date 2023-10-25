import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DataContext } from "../contexts/DataContextProvider.js"

export default function Ability(){
    const {getDocument, saveDocument} = useContext(DataContext)
    let [ability, setAbility] = useState(undefined)
    let id = useParams().id
    let objectKeys = ["id"]

    useEffect(()=>{
        getDocument(id, "abilities")
    }, [id, getDocument])

    const save = async (e)=>{
        e.preventDefault()
        let success = await saveDocument(ability, "abilities")

        if(success) alert("saved to db successfully")
        else alert("failed to save")
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
                    Object.entries(ability).filter(([key, val])=>!objectKeys.includes(key)).map(([key, val])=>
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