import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Creates a new monster with a unique id. The user must be authenticated as a game master 
 * for the operation to succeed.
 * @param asepriteKey The aseprite key that this monster will be using.
 * @param name The name of the monster.
 * @param AIKey The ai controller key for the monster.
 * @param stats The stats of the monster.
 * @returns A monster object.
 */
export const CreateMonster = async (asepriteKey: string, name: string, AIKey: string, stats: any) => {
    const db = getFirestore();

    let monster = {
        name: name,
        asepriteKey: asepriteKey,
        AIKey: AIKey,
        stats: {
            hp: stats?.hp ?? 0,
            armor: stats?.armor ?? 0,
            magicResist: stats?.magicResist ?? 0,
            attack: stats?.attack ?? 0,
            armorPen: stats?.armorPen ?? 0,
            magicAttack: stats?.magicAttack ?? 0,
            magicPen: stats?.magicPen ?? 0,
            critRate: stats?.critRate ?? 0,
            critDamage: stats?.critDamage ?? 1,
            attackRange: stats?.attackRange ?? 10,
            attackSpeed: stats?.attackSpeed ?? 0.5,
            speed: stats?.speed ?? 20,
            lifeSteal: stats?.lifeSteal ?? 0,
        }
    }
    let docRef = db.collection("monsters").doc();
    let res = await docRef.set(monster);
    return monster;
}

/**
 * Updates a monster. The user must be authenticated as a game master 
 * for the operation to succeed.
 * @param IdToken The token of the user.
 * @param id The id of the monster.
 * @param asepriteKey The aseprite key that this monster will be using.
 * @param name The name of the monster.
 * @param AIKey The ai controller key for the monster.
 * @param stats The stats of the monster.
 * @returns A monster object.
 */
export const UpdateMonster = async (IdToken: string, id: string, asepriteKey: string, name: string, AIKey: string, stats: any) => {
    let decodedToken = await getAuth().verifyIdToken(IdToken);

    // Get player
    const db = getFirestore();
    let playerRef = db.collection("players").doc(decodedToken.uid);
    let playerSnap = await playerRef.get();

    if(!playerSnap.exists) throw new Error("User doesn't exist.");

    let playerData = playerSnap.data();
    if(playerData?.gameMaster !== true) throw new Error("User is not a game master.");

    let monster = {
        name: name,
        asepriteKey: asepriteKey,
        AIKey: AIKey,
        stats: {
            hp: stats?.hp ?? 0,
            armor: stats?.armor ?? 0,
            magicResist: stats?.magicResist ?? 0,
            attack: stats?.attack ?? 0,
            armorPen: stats?.armorPen ?? 0,
            magicAttack: stats?.magicAttack ?? 0,
            magicPen: stats?.magicPen ?? 0,
            critRate: stats?.critRate ?? 0,
            critDamage: stats?.critDamage ?? 1,
            attackRange: stats?.attackRange ?? 10,
            attackSpeed: stats?.attackSpeed ?? 0.5,
            speed: stats?.speed ?? 20,
            lifeSteal: stats?.lifeSteal ?? 0,
        }
    }
    let docRef = db.collection("monsters").doc(id);
    let res = await docRef.update(monster);
    return monster;
}

/**
 * Deletes a monster. The user must be authenticated as a game master 
 * for the operation to succeed.
 * @param IdToken The token of the user.
 * @param id The id of the monster.
 */
export const DeleteMonster = async (IdToken: string, id: string) => {
    let decodedToken = await getAuth().verifyIdToken(IdToken);

    // Get player
    const db = getFirestore();
    let playerRef = db.collection("players").doc(decodedToken.uid);
    let playerSnap = await playerRef.get();

    if(!playerSnap.exists) throw new Error("User doesn't exist.");

    let playerData = playerSnap.data();
    if(playerData?.gameMaster !== true) throw new Error("User is not a game master.");


    let docRef = db.collection("monsters").doc(id);
    let res = await docRef.delete();
}

export const GetMonster = async (id: string) => {
    const db = getFirestore();
    let docRef = db.collection("monsters").doc(id);
    return (await docRef.get()).data();
}