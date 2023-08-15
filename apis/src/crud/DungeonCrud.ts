import { getFirestore } from "firebase-admin/firestore";
import { getIdFromName } from "../util/apputil";

/**
 * Gets the dungeon data from firebase by id or name.
 * @param idOrName The id or name of the dungeon.
 * @returns Dungeon data.
 */
export const getDungeon = async (idOrName: string) => {
    const db = getFirestore();
    let docRef = db.collection("dungeons").doc(getIdFromName(idOrName));
    return (await docRef.get()).data();
}

export const getAllDungeons = async () => {
    const db = getFirestore();
    let dungeonColRef = db.collection("dungeons");
    let q = await dungeonColRef.get();
    let dungeonData: any[] = [];
    q.forEach((doc) => {
        dungeonData.push(doc.data());
    })
    return dungeonData;
}
