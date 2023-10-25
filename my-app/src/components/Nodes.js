import { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../contexts/DataContextProvider.js";

export default function Nodes(props){
    const {nodes, createDocument, deleteDocument} = useContext(DataContext)

    async function createNode(type){
        createDocument("nodes")
    }

    function deleteNode(id){
        return async () =>{
            let name = nodes.filter(node=>node.id==id)[0].data.name

            if(window.confirm(`are you sure you want to delete "${name}"`)){
                let success = await deleteDocument(id, "nodes")
                if(success) {
                    alert(`deleted ${name} successfully`)
                }
            } 
        }
    }

    function renderNode(node){  
        return <div key={node.id} className="d-flex justify-content-between mb-3" style={{width: "50%"}}>
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