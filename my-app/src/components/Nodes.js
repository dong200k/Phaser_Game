import { useEffect, useState } from "react";
import UpgradeContainer from "./UpgradeContainer.js";
import UpgradeService from "../services/UpgradeService.js";
import SkillService from "../services/SkillService.js";
import SkillContainer from "./SkillContainer.js";
import NodeService from "../services/NodeService.js";
import { Link } from "react-router-dom";

export default function Nodes(props){
    let [nodes, setNodes] = useState([])
    
    useEffect(()=>{
        NodeService.getAllNodes()
        .then(nodes=>setNodes(nodes))
    }, [props])

    async function createNode(type){
        let result = await NodeService.createNode()
        
        if(result.status === 201){
            let node = await result.json()
            setNodes(prevNodes=>[...prevNodes, node])
        }
    }

    function deleteNode(id){
        return async () =>{
            let name = nodes.filter(node=>node.id==id)[0].data.name

            if(window.confirm(`are you sure you want to delete "${name}"`)){
                let result = await NodeService.deleteNode(id)
                
                if(result.status === 200) {
                    alert(`deleted ${name} successfully`)
                    setNodes(prevNodes=>prevNodes.filter((node)=>node.id !== id))
                }
            } 
        }
    }

    function renderNode(node){  
        return <div className="d-flex justify-content-between mb-3" style={{width: "50%"}}>
            <div style={{textAlign: "center", display: "inline-block"}}>
                <h3 style={{display: "inline-block", marginRight: "10px"}}>{node.data.name}</h3> 
                <Link to={`/node/${node.id}`}><button className="btn btn-warning">edit</button></Link>
            </div>
            <button className="btn btn-danger" onClick={deleteNode(node.id)}>delete</button>
        </div>
    }

    return(
        <div style={{backgroundColor: "lightcyan"}}> 
            <h1>Nodes</h1> 
            <button className="btn btn-success" onClick={createNode}>Create New Node</button>
            {nodes.length===0? 
                <div>No default nodes or json server is down</div> 
                : 
                <div>
                    
                    {nodes.map(renderNode)}
                </div>
            }
        </div>
    )
}   