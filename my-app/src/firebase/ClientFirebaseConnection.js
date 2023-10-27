import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { User, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
// import SceneManager from "../system/SceneManager";
// import { SceneKey, StartScene } from "../config";

export default class ClientFirebaseConnection{
  static singleton = new ClientFirebaseConnection()

  playerData
  /** JSON Web Token (JWT) used to identify the user to backend server. */
  user

  onUserStateChange = (user) => {console.log(user)}
//   /** Listeners are called when player data updates */
//   private playerDataListeners: Array<{key: string, f: (playerData: any)=>void}> = []


initFirebaseApp(env){
  switch(env){
    case "dev":
      initializeApp({
        apiKey: "AIzaSyARha5xMck2m4eOv4-gK8iTifHOZz_ZQJs",
        authDomain: "phasergame-4f0d6.firebaseapp.com",
        projectId: "phasergame-4f0d6",
        storageBucket: "phasergame-4f0d6.appspot.com",
        messagingSenderId: "410346722096",
        appId: "1:410346722096:web:baedc46c90bc962b4faef5",
        measurementId: "G-0S480400G3",
      })

      // Local emulator
      const db = getFirestore()
      connectFirestoreEmulator(db, '127.0.0.1', 8080)

      const auth = getAuth()
      connectAuthEmulator(auth, "http://127.0.0.1:9099")
      
      break;
    case "beta":
      // Original firebase project
      initializeApp({
        apiKey: "AIzaSyARha5xMck2m4eOv4-gK8iTifHOZz_ZQJs",
        authDomain: "phasergame-4f0d6.firebaseapp.com",
        projectId: "phasergame-4f0d6",
        storageBucket: "phasergame-4f0d6.appspot.com",
        messagingSenderId: "410346722096",
        appId: "1:410346722096:web:baedc46c90bc962b4faef5",
        measurementId: "G-0S480400G3",
      })
      break;
    case "prod":
      // Additional/2nd firebase project
      initializeApp({
        apiKey: "AIzaSyBgu0CiSN1qNFEoj-XCGdy-uv6HE0kAwL4",
        authDomain: "phasergame-prod.firebaseapp.com",
        projectId: "phasergame-prod",
        storageBucket: "phasergame-prod.appspot.com",
        messagingSenderId: "135671222671",
        appId: "1:135671222671:web:b9e01f69bbd8ab0aa0fbfa",
        measurementId: "G-Y2RFKDFYNS"
      })
      break;
    default:
      break;
  }
}

  /** Initializes FirebaseApp */
  startConnection(){
    this.initFirebaseApp(process.env.REACT_APP_FIREBASE_ENV)

    const auth = getAuth()
    const db = getFirestore()

    // Listen and update user data when user changes from login, logout, signup
    onAuthStateChanged(auth, async (user) => {
      // console.log(`user: ${user?.email}`);
      this.user = user;
      this.onUserStateChange(user);
    //   if(!user) {
    //     console.log("No user, switching to login scene")
    //     return SceneManager.getSceneManager().switchToScene(SceneKey.LoginScene)
    //   }

    //   this.idToken = await user.getIdToken()

      // retrieve player data
    //   const docRef = doc(db, "players", user.uid);
      // When player data updates
    //   onSnapshot(docRef, (docSnap)=>{
    //     this.playerData = docSnap.data()

    //     // Call listeners
    //     this.playerDataListeners.forEach(({key, f})=>{
    //       f(this.playerData)
    //     })

    //     // let currentScene = SceneManager.getSceneManager().getCurrentScene()
    //     // if(this.playerData && (currentScene === "LoginScene" || currentScene === "SignupScene")) {
    //     // //   console.log("Switching to start scene", this.playerData)
    //     // //   SceneManager.getSceneManager().switchToScene(StartScene)
    //     // }
    //   })
    })
  }


//   async signup(email: string, username: string, password: string){
//     const auth = getAuth()
//     const cred = await createUserWithEmailAndPassword(auth, email, password);
//     // await updateProfile(cred.user, {displayName: username})
//     // let player = await PlayerService.createPlayer(cred.user.displayName, await cred.user.getIdToken())
//     //   .catch(e=>console.log(e.message))
//     console.log(`created new user and signed in`, cred.user, player)
//     // this.playerData = player
//   }

  async login(email, password){
    const auth = getAuth()
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log(`user signed in`, cred.user.displayName);
  }

  async logout(){
    const auth = getAuth()

    await signOut(auth)
  }

//   addPlayerDataListener(key: string, f: (playerData: any)=>void){
//     this.playerDataListeners.push({
//       key, f
//     })
//   }

//   removePlayerDataListener(key: string){
//     this.playerDataListeners = this.playerDataListeners.filter(({key, f})=>key !== key)
//   }

  static getConnection(){
    return ClientFirebaseConnection.singleton
  }
}

