import { useEffect, useState } from "react";
import UpgradeContainer from "./UpgradeContainer.js";
import UpgradeService from "../services/UpgradeService.js";
import SkillService from "../services/SkillService.js";
import SkillContainer from "./SkillContainer.js";

export default function Upgrades(props){
    let [upgrades, setUpgrades] = useState([])
    useEffect(()=>{
        if(props.type==="upgrade"){
            UpgradeService.getAllUpgrades()
            .then((upgrades)=>{
              setUpgrades(upgrades)
            })
        }else if(props.type==="skill"){
            SkillService.getAllSkills()
            .then((upgrades)=>{
                setUpgrades(upgrades)
            })
        }
        
    }, [props])

    async function createTree(){
        let result

        if(props.type === "upgrade"){
          result = await UpgradeService.createUpgrade()  
        }else if(props.type==="skill"){
            result = await SkillService.createSkill() 
        }
        
        
        if(result.status === 201){
            let upgrade = await result.json()
            setUpgrades(prevUpgrade=>[...prevUpgrade, upgrade])
        }
    }

    function deleteTree(id){
        return async () =>{
            let name = upgrades.filter(upgrade=>upgrade.id==id)[0].name

            if(window.confirm(`are you sure you want to delete "${name}"`)){
                let result
                if(props.type==="upgrade"){
                    result = await UpgradeService.deleteUpgrade(id)
                }else if(props.type==="skill"){
                    result = await SkillService.deleteSkill(id)
                }
                
                if(result.status === 200) {
                    alert(`deleted ${name} successfully`)
                    setUpgrades(prevUpgrade=>prevUpgrade.filter((upgrade)=>upgrade.id !== id))
                }
            } 
        }
    }

    return(
        <div style={{backgroundColor: props.type==="upgrade"? "lightgreen":"lightblue"}}> 
            <h1>{props.type}s</h1> 
            <button className="btn btn-success" onClick={createTree}>Create New {props.type}</button>
            {upgrades.length===0? 
                <div>No upgrades or json server is down</div> 
                : 
                upgrades.map(upgrade => 
                    <div className="d-flex justify-content-between mb-3" style={{width: "50%"}}>
                        {props.type === "upgrade"?
                            <UpgradeContainer key={upgrade.id} upgrade={upgrade}/>
                            :
                            <SkillContainer key={upgrade.id} skill={upgrade}/>
                        }
                        <button className="btn btn-danger" onClick={deleteTree(upgrade.id)}>delete</button>
                    </div>
                )
            }
        </div>
    )
}   