import { useContext, useEffect, useState } from "react";
import UpgradeContainer from "./UpgradeContainer.js";
import SkillContainer from "./SkillContainer.js";
import Dropdown from 'react-bootstrap/Dropdown';
import { DataContext } from "../contexts/DataContextProvider.js";

export default function Upgrades(props){
    let [upgrades, setUpgrades] = useState([])
    const {skills, upgrades: upgradeData, createDocument, deleteDocument, saveDocument} = useContext(DataContext)
    
    useEffect(()=>{
        if(props.type==="upgrade"){
            setUpgrades(upgradeData)
        }else if(props.type==="skill"){
            setUpgrades(skills)
        }
    }, [props.type, skills, upgradeData])

    async function createTree(type){
        if(props.type === "upgrade"){
            createDocument("upgrades", type)
        }else if(props.type==="skill"){
            createDocument("skills")
        }
    }

    function deleteTree(id){
        return async () =>{
            let name = upgrades.filter(upgrade=>upgrade.id==id)[0].name

            if(window.confirm(`are you sure you want to delete "${name}"`)){
                let success = await deleteDocument(id, props.type + 's')
                
                if(success) {
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
        let document
        // Create new tree in db
        if(props.type === "upgrade"){
            document = await createDocument("upgrades", type)
        }else if(props.type==="skill"){
            document = await createDocument("skills")
        }

        // Save the tree over new tree
        let docToSave = {...tree, id: document.id, name: "copy of " + tree.name}
        let success = await saveDocument(docToSave, props.type + "s", false)
        if(success) alert("Successfully copied tree")
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
            {/* {upgrades.length===0? 
                <div>No upgrades or json server is down</div> 
                :  */}
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
                    
            {/* } */}
        </div>
    )
}   