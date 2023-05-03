import { useCallback, useState } from "react";
import { getDeepCopy } from "./util.js";

export const useCenteredTree = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return [translate, containerRef];
};

export function getDefaultUpgrade(){
  return {
    id: "upgrade-" + window.crypto.randomUUID(),
    name: "auto-generated",
    root: getDefaultNode()
  }
}

export function getDefaultSkill(){
  return {
    id: "skill-" + window.crypto.randomUUID(),
    name: "auto-generated",
    root: getDefaultNode()
  }
}

export function getDefaultNode(){
  return {
    nodeId: "node-" + window.crypto.randomUUID(),
    children: [],
    data: {
      name: "auto-generated",
      description: "auto-generated",
      stat: {
        maxHp: 0,
        maxMana: 0,
        hp:0,
        mana:0,
        armor:0,
        magicResist:0,
        damagePercent:0,
        attack:0,
        attackPercent:0,
        armorPen:0,
        magicAttack:0,
        magicAttackPercent:0,
        magicPen:0,
        critRate:0,
        critDamage:0,
        attackRange:0,
        attackRangePercent:0,
        attackSpeed:0,
        attackSpeedPercent:0,
        speed:0,
        lifeSteal:0,
        lifeStealPercent: 0,
        level:0,
      }
    }
  }
}

export function getEditForm(node){
  let nodeCopy = getDeepCopy(node)
  let defaultNodeStat = getDefaultNode().data.stat

  // set node's stat to defaultNodeStat stat, 
  //if nodeCopy's stat has extra properties that default does not have add them to the obj
  //if nodeCopy's stat has the properties that default has overwrite the default ones
  nodeCopy.data.stat = {...defaultNodeStat, ...nodeCopy.data.stat}

  return nodeCopy 
}

export function padUpgradeStat(upgrade){
  let zeroStat = getDefaultNode().data.stat
  let newUpgrade = getDeepCopy(upgrade)

  function dfs(root){
    if(!root) return

    let newStat = {...zeroStat}
    Object.entries(root.data.stat).forEach(([key, val])=>{
      newStat[key] = val
    })

    root.data.stat = newStat

    root.children.forEach((child, i)=>{
      dfs(child)
    })
  }

  dfs(newUpgrade.root)

  return newUpgrade
}

// export default function isValidStat(stat){
//   let message = ""
//   Object.entries(stat).forEach(([key, val])=>{
//     switch(key){
//       case "critRate":
//         break;
//       default: 
//         break;
//     }        

//   })
// }