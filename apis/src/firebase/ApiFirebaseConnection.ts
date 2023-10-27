import 'dotenv/config'
import { auth } from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import {getFirestore } from "firebase-admin/firestore"

export default class ServerFirebaseConnection{
  static singleton = new ServerFirebaseConnection()

  public initFirebaseApp(env: "dev" | "beta" | "prod"){
    switch(env){
      case "dev":
        // Local emulator
        process.env['FIRESTORE_EMULATOR_HOST'] = "127.0.0.1:8080"
        process.env['FIREBASE_AUTH_EMULATOR_HOST'] = "127.0.0.1:9099"
        process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = "127.0.0.1:9199"
        initializeApp({
          projectId: "phasergame-4f0d6",
          storageBucket: "phasergame-4f0d6.appspot.com"
        })
        break;
      case "beta":
        // Original firebase project
        process.env.GOOGLE_APPLICATION_CREDENTIALS = "./privatekey.json"
        initializeApp({
          credential: applicationDefault(),
          databaseURL: "https://phasergame-4f0d6.firebaseio.com",
          storageBucket: "phasergame-4f0d6.appspot.com"
        });
        break;
      case "prod":
        // Additional/2nd firebase project
        process.env.GOOGLE_APPLICATION_CREDENTIALS = "./privatekey_prod.json"
        initializeApp({
          credential: applicationDefault(),
          databaseURL: "https://phasergame-prod.firebaseio.com",
          storageBucket: "phasergame-prod.appspot.com"
        });
        break;
    }
  }

  /** Initializes FirebaseApp with service account */
  public startConnection(){
    this.initFirebaseApp(process.env.FIREBASE_ENV as "dev" | "beta" | "prod")
    
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