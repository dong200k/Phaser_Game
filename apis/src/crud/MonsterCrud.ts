import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Convert's a monster's name to its id. This is done by removing whitespaces from the name.
 * If the monster's id is passed in, the resulting id will be the same.
 * @param name The monster's name.
 */
const getIdFromName = (name: string) => {
    let id = "";
    for(let i = 0; i < name.length; i++){
        if(name[i] !== " ") id += name[i];
    }
    return id;
}

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

    let docRef = db.collection("monsters").doc(getIdFromName(name));
    await docRef.create(monster);
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
export const UpdateMonster = async (id: string, asepriteKey: string, name: string, AIKey: string, stats: any) => {
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
    
    let docRef = db.collection("monsters").doc(getIdFromName(name));
    let res = await docRef.update(monster);
    return monster;
}

/**
 * Deletes a monster. The user must be authenticated as a game master 
 * for the operation to succeed.
 * @param IdToken The token of the user.
 * @param id The id of the monster.
 */
export const DeleteMonster = async (id: string) => {
    const db = getFirestore();
    let docRef = db.collection("monsters").doc(getIdFromName(id));
    let res = await docRef.delete();
}

/**
 * Gets a monster by its id.
 * @param id The id of the monster.
 * @returns Monster data or undefined.
 */
export const GetMonster = async (id: string) => {
    const db = getFirestore();
    let docRef = db.collection("monsters").doc(getIdFromName(id));
    return (await docRef.get()).data();
}

/**
 * Gets a monster by its name.
 * @param name The name of the monster.
 * @returns Monster data or undefined.
 */
export const GetMonsterByName = async (name: string) => {
    const db = getFirestore();
    let docRef = db.collection("monsters").doc(getIdFromName(name));
    return (await docRef.get()).data();
}

export const GetAllMonsters = async () => {
    const db = getFirestore();
    let monsterColRef = db.collection("monsters");
    let q = await monsterColRef.get();
    let monsterData: any[] = [];
    q.forEach((doc) => {
        monsterData.push(doc.data());
    })
    return monsterData;
}
