import React, { useContext, useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { getDefaultSkillNode, getDefaultUpgradeNode, useCenteredTree, getDefaultUpgrade, getDefaultArtifact } from "../helpers.js";
import { useParams } from "react-router";
import EditNode from "./EditNode.js";
import NodeDetails from "./NodeDetails.js";
import Dropdown from 'react-bootstrap/Dropdown';
import { DataContext } from "../contexts/DataContextProvider.js";
import { usageTypes } from "../effectTypes.js";


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
  let bgColor = nodeDatum.data.status==="selected"? "lightgreen" : nodeDatum.data.status==="skipped"? "lightyellow" : ""
  return (
    <g>
      
      <circle r={15}></circle>
      <foreignObject {...foreignObjectProps}>
        <div style={{ border: "1px solid black", backgroundColor: bgColor}}>
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
  const nodeSize = { x: 500, y: 1000 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y };
  
  const id = useParams().id
  let [upgrade, setUpgrade] = useState(undefined)
  let [editNode, setEditNode] = useState(undefined)
  let statuses = ["selected", "none", "skipped"]

  const {getDocument, saveDocument} = useContext(DataContext)

  useEffect(()=>{
    getDocument(id, props.type + "s")
      .then(doc=>{
        if(doc.type === "weapon")
          setUpgrade({...getDefaultUpgrade(), ...doc})
        else
          setUpgrade({...getDefaultArtifact(), ...doc})
      })
  }, [getDocument, id, props])

  const setEdit = (node)=>{
    return () => {
      if(!editNode) setEditNode(node)
      else setEditNode(undefined)
    }
  }

  const updateUpgrade = (node)=>{
    setUpgrade(prevUpgrade=>{
      let newUpgrade = structuredClone(prevUpgrade)

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

  function onChange(attribute){
    return (e) => {
      setUpgrade(prevUpgrade=>{
        let newUpgrade = {...prevUpgrade}
        newUpgrade[attribute] = e.target.value
        return newUpgrade
      })
    }
  }

  async function saveUpgrade(){
    saveDocument(upgrade, props.type + 's')
  }

  function addChild(node){
    setUpgrade(prevUpgrade=>{
      let newUpgrade = structuredClone(prevUpgrade)

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
      let newUpgrade = structuredClone(prevUpgrade)

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

  // Should only be used in skill tree as selection order matters for Artifact/Weapon tree
  async function setAllStatus(status = "selected"){
    if(props.type !== "skill") return

    let newUpgrade = structuredClone(upgrade)
    function dfs(root){
      root.data.status = status

      for(let node of root.children){
          dfs(node)
      }
    }

    dfs(newUpgrade.root)
    setUpgrade(newUpgrade)
  }

  let setAllStatusDropdown =
  <Dropdown className="mb-5">
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
            Set All Status
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {statuses.map(status=>{
                return <Dropdown.Item key={status} onClick={()=>setAllStatus(status)}>{status}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>

  
  const setUsage = (usage)=>{
    setUpgrade(prevUpgrade=>({...prevUpgrade, usage: usage !== "none"? usage : ""}))
  }
  let usageDropdown =
  <Dropdown className="mb-5">
        <Dropdown.Toggle variant="info" id="dropdown-basic">
            {upgrade?.usage? upgrade.usage : "Select usage"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {usageTypes.map(usage=>{
                return <Dropdown.Item key={usage} onClick={()=>setUsage(usage)}>{usage}</Dropdown.Item>
            })}
        </Dropdown.Menu>
    </Dropdown>

  return (
    <div>
      {!upgrade? 
        <div>invalid {props.type} id!</div>
        :
        <div>
          <div className="text-center" style={{backgroundColor: props.type==="upgrade"? upgrade.type==="weapon"? "lightgreen":"lightpink" : "lightblue"}}>
            <h1 className="text-center">id: {upgrade.id}</h1>
            <div>
              <h1 className="text-center" style={{display:"inline-block"}}>{props.type==="upgrade"? upgrade.type==="weapon"? "Weapon":"Artifact" : "Skill"} Name:</h1>
              <h1 style={{display:"inline-block"}}><input type="text" value={upgrade.name} onChange={onChange("name")}/></h1>
            </div>
            <div>
              <h1 className="text-center" style={{display:"inline-block"}}>description:</h1>
              <textarea value={upgrade.description} style={{width: "25%"}}  onChange={onChange("description")}/>

            </div>
            <div>
              <h1 className="text-center" style={{display:"inline-block"}}>imageKey:</h1>
              <h1 style={{display:"inline-block"}}><input type="text" value={upgrade.imageKey} onChange={onChange("imageKey")}/></h1>
            </div>
            {usageDropdown}            

            {
              props.type === "skill" && 
              <div>
                {setAllStatusDropdown}
              </div>
            }
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
