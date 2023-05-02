import { useEffect, useState } from "react";
import UpgradeContainer from "./UpgradeContainer.js";
import UpgradeService from "../services/UpgradeService.js";

export default function Upgrades(){
    let [upgrades, setUpgrades] = useState([])
    useEffect(()=>{
        UpgradeService.getAllUpgrades()
          .then((upgrades)=>{
            setUpgrades(upgrades)
          })
    }, [])

    async function createUpgrade(){
        let result = await UpgradeService.createUpgrade()
        console.log(result)
        if(result.status === 201){
            let upgrade = await result.json()
            setUpgrades(prevUpgrade=>[...prevUpgrade, upgrade])
        }
    }

    function deleteUpgrade(id){
        return async () =>{
            let result = await UpgradeService.deleteUpgrade(id)
            if(result.status === 200) {
                alert(`delete upgrade with id ${id} successfully`)
                setUpgrades(prevUpgrade=>prevUpgrade.filter((upgrade)=>upgrade.id !== id))
            }
        }
    }

    return(
        <div>   
            <button onClick={createUpgrade}>Create New Upgrade</button>
            {upgrades.length===0? 
                <div>No upgrades or json server is down</div> 
                : 
                upgrades.map(upgrade => 
                    <div className="flex-row">
                        <UpgradeContainer key={upgrade.id} upgrade={upgrade}/>
                        <button  className="btn btn-danger" onClick={deleteUpgrade(upgrade.id)}>delete</button>
                    </div>
                )
            }
        </div>
    )
}   