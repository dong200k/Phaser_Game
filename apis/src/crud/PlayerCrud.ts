import { getFirestore } from "firebase-admin/firestore"
import {getAuth} from "firebase-admin/auth"
import Node from "../../../server/src/rooms/game_room/schemas/Trees/Node/Node"
import SkillData from "../../../server/src/rooms/game_room/schemas/Trees/Node/Data/SkillData"
import JsonDatabaseManager from "../skilltree/JsonDatabaseManager"

/**
 * Creates new player if it doesnt exist. Requires IdToken from client side to verify user's permission.
 * @param playerId uid of the user creating a player
 * @param IdToken token from firebase used to verify client side player
 * @param username name of user to be created
 */
export const CreatePlayer = async (IdToken: string, username: string)=>{
  // Verify IdToken (from client app) validity
  let decodedToken = await getAuth().verifyIdToken(IdToken)
  let uid = decodedToken.uid 

  // Create new player
  const db = getFirestore()
  let docRef = db.collection("players").doc(uid)
  let docSnap = await docRef.get()
  if(!docSnap.exists) {
    let player = {
      gems: 10000,
      coins: 10000,
      pets: [],
      abilities: [],
      level: 1,
      username: username,
      skillTree: JsonDatabaseManager.getManager().getSkill("skill-bd5a5c20-d375-46eb-a2dc-dace60afbab9"),
      unlockedRoles: ["ranger"]
    }
    let res = await docRef.set(player)
    return player
  }else{
    throw new Error("Player already exist")
  }
}

/**
 * Updates player's currency and skill tree based on the upgrades selected
 * @param IdToken 
 * @param upgrades 
 */
export const updatePlayerSkillTree = async (IdToken: string, upgrades: string[])=>{
  // Verify IdToken (from client app) validity
  let decodedToken = await getAuth().verifyIdToken(IdToken)
  let uid = decodedToken.uid 

  // Get player
  const db = getFirestore()
  let docRef = db.collection("players").doc(uid)
  let docSnap = await docRef.get()

  if(!docSnap.exists) throw new Error("Player does not exist yet")
  
  // Apply all upgrades in order.
  let upgradedCount = 0
  let data = docSnap.data()
  let skillTree = data?.skillTree
  let coins = data?.coins

  // Dfs to apply upgrades
  function applyUpgrades(node: Node<SkillData>){
    let upgrade = upgrades.find(upgrade => upgrade === node.id)

    // Select upgrade if it is found and coins are enough and it has not been selected
    if(upgrade && node.data.status === "none" && coins > node.data.coinCost){
      coins -= node.data.coinCost
      node.data.status = "selected"
      upgradedCount += 1
    }

    // If upgrade already selected, later upgrades can be upgraded
    if(node.data.status === "selected"){
      node.children.forEach(child=>{
        applyUpgrades(child)
      })
    }
  }

  applyUpgrades(skillTree.root)
  // console.log("upgrade count:", upgradedCount)
  // console.log("upgrade length:", upgrades.length)
  // Upgrades must all go through to save
  if(upgradedCount === upgrades.length) {
    return docRef.update({skillTree: skillTree, coins: coins})
  }else{
    throw new Error("Invalid upgrades selected or coins insufficient")
  }
}

/**
 * Removes upgrades from player skill tree
 * @param IdToken 
 * @param upgrades 
 */
export const unUpgradePlayerSkillTree = async (IdToken: string, upgrades: string[])=>{
  // Verify IdToken (from client app) validity
  let decodedToken = await getAuth().verifyIdToken(IdToken)
  let uid = decodedToken.uid 

  // Get player
  const db = getFirestore()
  let docRef = db.collection("players").doc(uid)
  let docSnap = await docRef.get()

  if(!docSnap.exists) throw new Error("Player does not exist yet")
  
  // Remove upgrades in order (last upgrade first, using postorder traversal)
  let removedCount = 0
  let data = docSnap.data()
  let skillTree = data?.skillTree
  let coins = data?.coins

  // Postorder to apply upgrades
  function removeUpgrades(node: Node<SkillData>){
    // If upgrade already selected, remove later upgrades first then remove it
    if(node.data.status === "selected"){
      node.children.forEach(child=>{
        removeUpgrades(child)
        if(child.data.status === "selected") return // later upgrade still selected so we cant remove this upgrade
      })

      let upgrade = upgrades.find(upgrade => upgrade === node.id)

      // remove upgrade and refund coins
      if(upgrade && node.data.status === "selected"){
        coins += node.data.coinCost
        node.data.status = "none"
        removedCount += 1
      }
    }
  }

  removeUpgrades(skillTree.root)

  // Upgrades must all go through to save
  if(removedCount === upgrades.length) {
    return docRef.update({skillTree: skillTree, coins: coins})
  }else{
    throw new Error("Invalid upgrades selected for removal")
  }
}

/**
 * Retrieves data of a player with uid == playerId.
 * 
 * Note: Probably not needed as firebase on client and server side can directly get player info
 * @param playerId 
 */
export const getPlayerData = async (IdToken: string)=>{
  // Verify IdToken (from client app) validity
  let decodedToken = await getAuth().verifyIdToken(IdToken)
  let uid = decodedToken.uid 

  const db = getFirestore()
  const docSnap = await db.collection("players").doc(uid).get()
  
  if(docSnap.exists){
    return {...docSnap.data(), uid: uid};
  }
}

