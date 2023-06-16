import { useEffect, useState } from "react";
import UpgradeContainer from "./UpgradeContainer.js";
import UpgradeService from "../services/UpgradeService.js";
import SkillService from "../services/SkillService.js";
import SkillContainer from "./SkillContainer.js";
import Dropdown from 'react-bootstrap/Dropdown';

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

    async function createTree(type){
        let result

        if(props.type === "upgrade"){
          result = await UpgradeService.createUpgrade(type)  
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

    function renderUpgrade(upgrade){
        return <div className="d-flex justify-content-between mb-3" style={{width: "50%"}}>
            {props.type === "upgrade"?
                <UpgradeContainer key={upgrade.id} upgrade={upgrade}/>
                :
                <SkillContainer key={upgrade.id} skill={upgrade}/>
            }
            <button className="btn btn-danger" onClick={deleteTree(upgrade.id)}>delete</button>
        </div>
    }

    async function createTreeCopy(tree, type){
        let result

        // Create new tree in db
        if(props.type === "upgrade"){
          result = await UpgradeService.createUpgrade(type)  
        }else if(props.type==="skill"){
            result = await SkillService.createSkill() 
        }
        
        if(result.status === 201){
            let upgrade = await result.json()

            // Init tree info
            upgrade.name = "copy of " + tree.name
            upgrade.description = tree.description
            if(tree.type) upgrade.type = tree.type
            upgrade.root = tree.root

            // Save tree to database
            let success
            if(props.type === "upgrade"){
                success = UpgradeService.saveUpgrade(upgrade)
            }else{
                success = SkillService.saveSkill(upgrade)
            }
            
            if(success) setUpgrades(prevUpgrade=>[...prevUpgrade, upgrade])
        }
    }

    let copyDropDown = (type) =>
    <Dropdown className="mb-5">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            Make Copy
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {upgrades.filter(upgrade=>{
                return !upgrade.type || upgrade.type === type
            }).map(upgrade=>{
                return <Dropdown.Item onClick={()=>createTreeCopy(upgrade, type)}>
                    {upgrade.name}, <span className="text-danger">id: {upgrade.id}</span>
                </Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>

    return(
        <div style={{backgroundColor: props.type==="upgrade"? "lightgreen":"lightblue"}}> 
            <h1>{props.type}s</h1> 
            {upgrades.length===0? 
                <div>No upgrades or json server is down</div> 
                : 
                <div>
                    {props.type==="skill"?
                    <div>
                        <div className="d-flex" style={{height: "40px"}}>
                            <button className="btn btn-success" onClick={createTree}>Create New {props.type}</button>
                            {copyDropDown()}
                        </div>
                       
                        {upgrades.map(renderUpgrade)}
                    </div>
                    :
                    <div>
                        <div style={{backgroundColor: "lightgreen"}}>
                            <h3>Weapon Upgrades</h3>
                            <div className="d-flex" style={{height: "40px"}}>
                                <button className="btn btn-success" onClick={()=>createTree("weapon")}>Create New Weapon Upgrade</button>
                                {copyDropDown("weapon")}
                            </div>
                            
                            {upgrades.filter(upgrade=>upgrade.type==="weapon").map(renderUpgrade)}
                        </div>

                        <br/><br/>
                        
                        <div style={{backgroundColor: "lightpink"}}>
                            <h3>Artifact Upgrades</h3>
                            <div className="d-flex" style={{height: "40px"}}>
                                <button className="btn btn-success" onClick={()=>createTree("artifact")}>Create New Artifact Upgrade</button>
                                {copyDropDown("artifact")}
                            </div>
                            {upgrades.filter(upgrade=>upgrade.type!=="weapon").map(renderUpgrade)}
                        </div>
                    </div>
                    }
                </div>
                    
            }
        </div>
    )
}   