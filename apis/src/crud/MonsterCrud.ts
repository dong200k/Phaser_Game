import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getIdFromName } from "../util/apputil";

/**
 * Creates a new monster with a unique id. The user must be authenticated as a game master 
 * for the operation to succeed.
 * @param asepriteKey The aseprite key that this monster will be using.
 * @param name The name of the monster.
 * @param AIKey The ai controller key for the monster.
 * @param stats The stats of the monster.
 * @returns A monster object.
 */
export const CreateMonster = async (data: any) => {
    const db = getFirestore();
    let monster = {
        name: data.name ?? "Unnamed",
        asepriteKey: data.asepriteKey ?? "n/a",
        AIKey: data.AIKey ?? "Default",
        stats: {
            hp: data.stats?.hp ?? 0,
            armor: data.stats?.armor ?? 0,
            magicResist: data.stats?.magicResist ?? 0,
            attack: data.stats?.attack ?? 0,
            armorPen: data.stats?.armorPen ?? 0,
            magicAttack: data.stats?.magicAttack ?? 0,
            magicPen: data.stats?.magicPen ?? 0,
            critRate: data.stats?.critRate ?? 0,
            critDamage: data.stats?.critDamage ?? 1,
            attackRange: data.stats?.attackRange ?? 10,
            attackSpeed: data.stats?.attackSpeed ?? 0.5,
            speed: data.stats?.speed ?? 20,
            lifeSteal: data.stats?.lifeSteal ?? 0,
        },
        bounds: {
            type: data.bounds?.type ?? "rect",
            width: data.bounds?.width ?? 10,
            height: data.bounds?.height ?? 10,
        }
    }
    let docRef = db.collection("monsters").doc(getIdFromName(monster.name));
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
export const UpdateMonster = async (id: string, data: any) => {
    const db = getFirestore();
    let monster = {
        name: data.name,
        asepriteKey: data.asepriteKey,
        AIKey: data.AIKey,
        stats: {
            hp: data.stats?.hp ?? 0,
            armor: data.stats?.armor ?? 0,
            magicResist: data.stats?.magicResist ?? 0,
            attack: data.stats?.attack ?? 0,
            armorPen: data.stats?.armorPen ?? 0,
            magicAttack: data.stats?.magicAttack ?? 0,
            magicPen: data.stats?.magicPen ?? 0,
            critRate: data.stats?.critRate ?? 0,
            critDamage: data.stats?.critDamage ?? 1,
            attackRange: data.stats?.attackRange ?? 10,
            attackSpeed: data.stats?.attackSpeed ?? 0.5,
            speed: data.stats?.speed ?? 20,
            lifeSteal: data.stats?.lifeSteal ?? 0,
        },
        bounds: {
            type: data.bounds?.type ?? "rect",
            width: data.bounds?.width ?? 10,
            height: data.bounds?.height ?? 10,
        }
    }
    let docRef = db.collection("monsters").doc(getIdFromName(id));
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
    let doc = (await docRef.get());
    let data = doc.data();
    if(data) data.id = doc.id;
    return data;
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
        let data = doc.data();
        data.id = doc.id;
        monsterData.push(data);
    })
    return monsterData;
}
