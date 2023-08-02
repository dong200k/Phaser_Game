import 'dotenv/config'
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import {getFirestore} from "firebase-admin/firestore"

export default class ServerFirebaseConnection{
  static singleton = new ServerFirebaseConnection()

  /** Initializes FirebaseApp with service account */
  public startConnection(){

    initializeApp({
      credential: applicationDefault(),
      databaseURL: "https://phasergame-4f0d6.firebaseio.com"
    });

    // return this.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
  }

  // private static login(email?: string, password?: string){
  //   if(!email || !password) return

  //   const auth = getAuth()
    
  //   return signInWithEmailAndPassword(auth, email, password)
  //     .then(cred=>{
  //       console.log(`user signed in`, cred.user.email)
  //     })
  //     .catch((err: any)=>{
  //       console.log(err.message)
  //     })
  // }

  /**
   * Gets player data by their user id
   * @param id user id 
   * @returns 
   */
  public async getPlayerData(id: string){
    const db = getFirestore()
    const docSnap = await db.doc("players/"+id).get()
    
    if(docSnap.exists){
      return docSnap.data()
    }

  }

  /**
   * Saves player's data.
   * @param playerData 
   * @returns 
   */
  public async savePlayerData(playerData: IFirestorePlayerData){
    const db = getFirestore()
    const docRef = db.doc("players/" + playerData.id)

    try {
      const updatedDoc = await docRef.update(docRef, {
        gems: playerData.gems,
        coins: playerData.coins,
        level: playerData.level,
        skillTree: playerData.skillTree,
        pets: playerData.pets,
        abilities: playerData.abilities
      });
      console.log(`player ${playerData.username}'s data saved successfully`);
      console.log(updatedDoc);
      return true;
    } catch (err) {
      console.log(err, `player ${playerData.username}'s data did not save!`);
      return false;
    }
  }

  static getConnection() {
    return this.singleton
  }
}

export type IFirestorePlayerData = {
  id: string,
  username: string,
  gems: number,
  coins: number,
  level: number,
  skillTree: {
    name: string,
    upgrades: Array<{
      nodeId: string,
      level: number
    }>
  },
  pets: Array<{
    speciesName: string,
    level: number,
    nickName: string
  }>
  abilities: [string]
}