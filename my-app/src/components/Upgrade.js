import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { getDefaultNode, useCenteredTree } from "../helpers.js";
import { useParams } from "react-router";
import UpgradeService from "../services/UpgradeService.js";
import EditNode from "./EditNode.js";
import NodeDetails from "./NodeDetails.js";
import { getDeepCopy } from "../util.js";

const containerStyles = {
  width: "100vw",
  height: "100vh"
};

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  setEdit,
  addChild, 
  deleteNode
}) => {
  return (
    <g>
      
      <circle r={15}></circle>
      <foreignObject {...foreignObjectProps}>
        <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
          <NodeDetails nodeDatum = {nodeDatum} />

          <button className="btn btn-warning" style={{ width: "100%" }} onClick={setEdit(nodeDatum)}>Edit</button>
          <button className="btn btn-light" style={{ width: "100%" }} onClick={()=>addChild(nodeDatum)}>Add children</button>
          <button className="btn btn-danger" style={{ width: "100%" }} onClick={()=>deleteNode(nodeDatum)}>Delete</button>
        </div>
      </foreignObject>
    </g>
  )
}

export default function Upgrade(props) {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 500, y: 700 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y };
  
  const id = useParams().id
  let [upgrade, setUpgrade] = useState(undefined)
  let [editNode, setEditNode] = useState(undefined)

  useEffect(()=>{
    UpgradeService.getUpgrade(id)
      .then((data)=>{
        setUpgrade(data)
      })
  }, [id])

  const setEdit = (node)=>{
    return () => {
      if(!editNode) setEditNode(node)
      else setEditNode(undefined)
    }
  }

  const updateUpgrade = (node)=>{
    setUpgrade(prevUpgrade=>{
      let newUpgrade = getDeepCopy(prevUpgrade)

      function dfs(root){
        if(!root) return

        console.log(root.nodeId)

        root.children.forEach((child, i)=>{
          if(child.nodeId === node.nodeId) {
            root.children[i] = node
            return
          }
          dfs(child)
        })
      }

      if(newUpgrade.root.nodeId === node.nodeId){
        newUpgrade.root = node
      }else{
        dfs(newUpgrade.root)
      }
      
      return newUpgrade
    })
    return true
  }

  function onChange(e){
    setUpgrade(prevUpgrade=>({...prevUpgrade, upgradeName: e.target.value}))
  }

  async function saveUpgrade(){
    let success = await UpgradeService.saveUpgrade(upgrade)
    if(success) alert("saved")
  }

  function addChild(node){
    setUpgrade(prevUpgrade=>{
      let newUpgrade = getDeepCopy(prevUpgrade)

      function dfs(root){
        if(!root) return

        if(root.nodeId === node.nodeId){
          let newNode = getDefaultNode()
          root.children.push(newNode)
          return
        }

        root.children.forEach((child, i)=>{
          dfs(child)
        })
      }
      
      dfs(newUpgrade.root)
      return newUpgrade
    })
  }

  function deleteNode(node){
    setUpgrade(prevUpgrade=>{
      let newUpgrade = getDeepCopy(prevUpgrade)

      function dfs(root){
        if(!root) return

        root.children.forEach((child, i)=>{
          if(child.nodeId === node.nodeId) {
            //remove node
            root.children.splice(i, 1)
            return
          }
          dfs(child)
        })
      }

      if(newUpgrade.root.nodeId === node.nodeId){
        alert("cannot delete the root node")
      }else{
        dfs(newUpgrade.root)
      }
      
      return newUpgrade
    })
  }

  return (
    <div>
      {!upgrade? 
        <div>invalid upgrade id!</div>
        :
        <div>
          <button className="btn btn-success" style={{width: "30%", height: "50px", marginLeft: "auto"}} onClick={saveUpgrade}>SAVE TO DATABASE!!!</button>

          <div className="text-center">
            <h1 className="text-center" style={{display:"inline-block"}}>Upgrade Name:</h1>
            <h1 style={{display:"inline-block"}}><input type="text" value={upgrade.upgradeName} onChange={onChange}/></h1>
            <h1 className="text-center">id: {upgrade.id}</h1>
          </div>

          {editNode && <EditNode node={editNode} updateUpgrade={updateUpgrade} setEditNode={setEditNode}/>}

          <div style={containerStyles} ref={containerRef}>
            <Tree
              data={upgrade.root}
              translate={translate}
              nodeSize={nodeSize}
              renderCustomNodeElement={(rd3tProps) =>
                renderForeignObjectNode({ ...rd3tProps, foreignObjectProps, setEdit, addChild, deleteNode})
              }
              orientation="vertical"
            />
          </div>
        </div>
        }
    </div>
  );
}
