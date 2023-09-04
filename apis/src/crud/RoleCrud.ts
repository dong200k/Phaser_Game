import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import JsonDatabaseManager from "../skilltree/JsonDatabaseManager"

// /**
//  * Changes the player's current role to selected role if role is unlocked.
//  * @param IdToken token from firebase used to verify client side player
//  * @param role id of role player is selecting
//  */
// export const SelectRole = async (IdToken: string, role: string) =>{
//      // Verify IdToken (from client app) validity
//     let decodedToken = await getAuth().verifyIdToken(IdToken)
//     let uid = decodedToken.uid 

//     // Get player
//     const db = getFirestore()
//     let docRef = db.collection("players").doc(uid)
//     let docSnap = await docRef.get()

//     if(!docSnap.exists) throw new Error("Player does not exist yet")

//     // Change to role if it is unlocked 
//     let unlockedRoles: [] = docSnap.data()?.unlockedRoles
//     if(unlockedRoles && unlockedRoles.find(availableRole=>role===availableRole)){
//         return docRef.update({role})
//     }else{
//         throw new Error(`Role: ${role} has not been unlocked yet!`)
//     }
// }

/**
 * Unlocks role if currency is enough.
 * @param IdToken token from firebase used to verify client side player
 * @param role id of role player is selecting
 */
export const UnlockRole = async (IdToken: string, role: string) =>{
    // Verify IdToken (from client app) validity
    let decodedToken = await getAuth().verifyIdToken(IdToken)
    let uid = decodedToken.uid 

    // Get player
    const db = getFirestore()
    let docRef = db.collection("players").doc(uid)
    let docSnap = await docRef.get()
    if(!docSnap.exists) throw new Error("Player does not exist yet")

    let data = docSnap.data()
    let unlockedRoles: [string] = data?.unlockedRoles
    let coins: number = data?.coins
    let coinCost = 0

    // Role is not valid
    let dbRole = JsonDatabaseManager.getManager().getRole(role)
    if(!dbRole) {
        throw new Error(`Role: ${role} was not found!`)
    }

    // Role already unlocked
    if(unlockedRoles && unlockedRoles.find(availableRole=>role===availableRole)){
        throw new Error(`Role: ${role} has already been unlocked!`)
    }

    // Insufficient coins
    if(dbRole.coinCost > coins){
        throw new Error(`Insufficient amount of coins. ${dbRole.name} requires ${dbRole.coinCost} to unlock!`)
    }
    
    // Unlock role and deduct currency
    unlockedRoles.push(dbRole.id)
    return docRef.update({coins: coins - dbRole.coinCost, unlockedRoles})
}
