import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import WeaponService from "../services/WeaponService.js"
import { getDefaultWeapon } from "../helpers.js"

export default function Weapon(){
    let [weapon, setWeapon] = useState(undefined)
    let id = useParams().id

    useEffect(()=>{
       WeaponService.getWeapon(id)
        .then(weapon=>setWeapon(weapon))
    }, [id])

    const save = async (e)=>{
        e.preventDefault()
        let success = await WeaponService.saveWeapon(weapon)

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

    return <div>
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