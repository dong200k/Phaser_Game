import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { getDefaultNode, getDefaultSkillNode, getDefaultUpgradeNode, useCenteredTree } from "../helpers.js";
import { useParams } from "react-router";
import UpgradeService from "../services/UpgradeService.js";
import EditNode from "./EditNode.js";
import NodeDetails from "./NodeDetails.js";
import { getDeepCopy } from "../util.js";
import SkillService from "../services/SkillService.js";

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
  deleteNode,
  type
}) => {
  return (
    <g>
      
      <circle r={15}></circle>
      <foreignObject {...foreignObjectProps}>
        <div style={{ border: "1px solid black", backgroundColor: "#dedede" }}>
          <NodeDetails nodeDatum = {nodeDatum} type={type}/>

          <button className="btn btn-warning" style={{ width: "100%" }} onClick={setEdit(nodeDatum)}>Edit</button>
          <button className="btn btn-light" style={{ width: "100%" }} onClick={()=>addChild(nodeDatum)}>Add children</button>
          <button className="btn btn-danger" style={{ width: "100%"}} onClick={()=>deleteNode(nodeDatum)}>Delete</button>
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
    if(props.type === "upgrade"){
      UpgradeService.getUpgrade(id)
      .then((data)=>{
        setUpgrade(data)
      })
    }else if(props.type === "skill"){
      SkillService.getSkill(id)
      .then((data)=>{
        setUpgrade(data)
      })
    }
    
  }, [id, props])

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

        console.log(root.id)

        root.children.forEach((child, i)=>{
          if(child.id === node.id) {
            root.children[i] = node
            return
          }
          dfs(child)
        })
      }

      if(newUpgrade.root.id === node.id){
        newUpgrade.root = node
      }else{
        dfs(newUpgrade.root)
      }
      
      return newUpgrade
    })
    return true
  }

  function onChange(e){
    setUpgrade(prevUpgrade=>({...prevUpgrade, name: e.target.value}))
  }

  async function saveUpgrade(){
    let success
    if(props.type === "upgrade"){
      success = await UpgradeService.saveUpgrade(upgrade)
    }else if(props.type==="skill"){
      success = await SkillService.saveSkill(upgrade)
    }

    
    if(success) alert(`saved ${props.type} successfully!`)
  }

  function addChild(node){
    setUpgrade(prevUpgrade=>{
      let newUpgrade = getDeepCopy(prevUpgrade)

      function dfs(root){
        if(!root) return

        if(root.id === node.id){
          let newNode 
          if(props.type === "upgrade") newNode = getDefaultUpgradeNode()
          else newNode = getDefaultSkillNode()

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
          if(child.id === node.id) {
            //remove node
            root.children.splice(i, 1)
            return
          }
          dfs(child)
        })
      }

      if(newUpgrade.root.id === node.id){
        alert(`Cannot delete the root node! To delete this whole tree do it from the ${props.type} page`)
      }else{
        dfs(newUpgrade.root)
      }
      
      return newUpgrade
    })
  }

  return (
    <div>
      {!upgrade? 
        <div>invalid {props.type} id!</div>
        :
        <div>
          <div className="text-center" style={{backgroundColor: props.type==="upgrade"? upgrade.type==="weapon"? "lightgreen":"lightpink" : "lightblue"}}>
            <h1 className="text-center" style={{display:"inline-block"}}>{props.type==="upgrade"? upgrade.type==="weapon"? "Weapon":"Artifact" : "Skill"} Name:</h1>
            <h1 style={{display:"inline-block"}}><input type="text" value={upgrade.name} onChange={onChange}/></h1>
            <h1 className="text-center">id: {upgrade.id}</h1>
          </div>

          <button className="btn btn-success" style={{width: "30%", height: "50px", marginLeft: "35%"}} onClick={saveUpgrade}>SAVE TO DATABASE!!!</button>

          {editNode && <EditNode type={props.type} node={editNode} updateUpgrade={updateUpgrade} setEditNode={setEditNode}/>}

          <div style={containerStyles} ref={containerRef}>
            <Tree
              data={upgrade.root}
              translate={translate}
              nodeSize={nodeSize}
              renderCustomNodeElement={(rd3tProps) =>
                renderForeignObjectNode({ ...rd3tProps, foreignObjectProps, setEdit, addChild, deleteNode, type: props.type})
              }
              orientation="vertical"
            />
          </div>
        </div>
        }
    </div>
  );
}
