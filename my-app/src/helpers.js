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
    type: "weapon",
    root: getDefaultUpgradeNode()
  }
}

export function getDefaultArtifact(){
  return {
    id: "upgrade-" + window.crypto.randomUUID(),
    name: "auto-generated",
    type: "artifact",
    root: getDefaultUpgradeNode()
  }
}

export function getDefaultSkill(){
  return {
    id: "skill-" + window.crypto.randomUUID(),
    name: "auto-generated",
    root: getDefaultSkillNode()
  }
}

export function getDefaultNode(){
  return {
    id: "node-" + window.crypto.randomUUID(),
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
        chargeAttackSpeed: 0,
        chargeAttackSpeedPercent: 0,
        healthRegen: 0,
        shieldHp: 0,
        shieldMaxHp: 0
      },
      status: "none",
      selectionTime: 0
    }
  }
}

export function getDefaultUpgradeNode(){
  let node = {
    ...getDefaultNode(),
  }
  // If there needs to be Additional key add them below
  node.data.upgradeEffect = {
    effectLogicId: "",
    doesStack: 1, // whether it stacks (1) or overwrites (0) other useAttacks
    cooldown: 1000,
    collisionGroup: -1,
    type: "none"
  }
  return node
}

export function getDefaultSkillNode(){
  let node = {
    ...getDefaultNode(),
  }
  // If there needs to be Additional key add them below
  node.data.coinCost = 0
  return node
}

export function getDefaultWeapon(){
  return {
    id: "weapon-" + window.crypto.randomUUID(),
    name: "name",
    description: "description",
    sprite: "demo_hero",
    projectile: "demo_hero"
  }
}

export function getDefaultRole(){
  return {
    id: "role-" + window.crypto.randomUUID(),
    name: "role-name",
    description: "role-description",
    displaySprite: "sprite",
    spriteKey: "demo_hero",
    abilityId: "",
    weaponUpgradeId: "",
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
      chargeAttackSpeed: 0,
      chargeAttackSpeedPercent: 0,
    },
    coinCost: 1000,
  }
}

export function getDefaultAbility(){
  return {
    id: "ability-" + window.crypto.randomUUID(),
    name: "ability-name",
    description: "ability-description",
    effectLogicId: "",
    displaySprite: "sprite",
    cooldown: 1000
  }
}

export function getEditForm(node, type){
  let nodeCopy = structuredClone(node)
  let defaultNode
  if(type === "skill"){
    defaultNode = getDefaultSkillNode()
  }else if(type === "upgrade"){
    defaultNode = getDefaultUpgradeNode()
  }else{
    defaultNode = getDefaultNode()
  }

  // set node's stat to defaultNodeStat stat, 
  //if nodeCopy's stat has extra properties that default does not have add them to the obj
  //if nodeCopy's stat has the properties that default has overwrite the default ones
  nodeCopy.data.stat = {...defaultNode.data.stat, ...nodeCopy.data.stat}

  // Same for the other categories of nodeCopy.data
  // use the categories from nodeCopy.data if both has the category
  // else include the other/additional categories from defaultNode
  nodeCopy.data = {...defaultNode.data, ...nodeCopy.data}

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

/** Removes the information that the d3 library uses for the tree view. 
 * @returns a new document with the d3 info removed.
 */
export function removeD3TreeInfo(document){
  let newDoc = structuredClone(document)

  function dfsHelper(node){
    if(node === undefined) return

    delete node["__rd3t"]

    for(let child of node.children){
      dfsHelper(child)
    }
  }

  dfsHelper(newDoc.root)
  return newDoc
}

/** Returns a new obj with its property sorted */
export function sortObject(obj){
  let newObj = {}
  let keysSorted = Object.keys(obj).sort((a,b)=>{
    return ('' + a).localeCompare(b);
  })
  keysSorted.forEach(key=>{
    newObj[key] = obj[key]
  })
  // console.log(keysSorted)
  return newObj
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