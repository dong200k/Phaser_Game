import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import SceneManager from "../system/SceneManager";
import { SceneKey, StartScene } from "../config";
import PlayerService from "../services/PlayerService";

export default class ClientFirebaseConnection{
  private static singleton = new ClientFirebaseConnection()

  public onlineMode = true
  public roleId: string = ""
  public playerData: any
  /** JSON Web Token (JWT) used to identify the user to backend server. */
  public idToken?: string
  /** Listeners are called when player data updates */
  private playerDataListeners: Array<{key: string, f: (playerData: any)=>void}> = []


  /** Initializes FirebaseApp */
  startConnection(){
    const firebaseConfig = {
      apiKey: "AIzaSyARha5xMck2m4eOv4-gK8iTifHOZz_ZQJs",
      authDomain: "phasergame-4f0d6.firebaseapp.com",
      projectId: "phasergame-4f0d6",
      storageBucket: "phasergame-4f0d6.appspot.com",
      messagingSenderId: "410346722096",
      appId: "1:410346722096:web:baedc46c90bc962b4faef5",
      measurementId: "G-0S480400G3",
    };
    
    initializeApp(firebaseConfig);

    const auth = getAuth()
    const db = getFirestore()

    // Listen and update user data when user changes from login, logout, signup
    onAuthStateChanged(auth, async user=>{
      console.log(`user: ${user?.email}`)
      if(!user) {
        console.log("No user, switching to login scene")
        return SceneManager.getSceneManager().switchToScene(SceneKey.LoginScene)
      }

      this.idToken = await user.getIdToken()

      // retrieve player data
      const docRef = doc(db, "players", user.uid);
      // When player data updates
      onSnapshot(docRef, (docSnap)=>{
        this.playerData = docSnap.data()

        // Call listeners
        this.playerDataListeners.forEach(({key, f})=>{
          f(this.playerData)
        })

        let currentScene = SceneManager.getSceneManager().getCurrentScene()
        if(this.playerData && (currentScene === "LoginScene" || currentScene === "SignupScene")) {
          console.log("Switching to start scene", this.playerData)
          SceneManager.getSceneManager().switchToScene(StartScene)
        }
      })
    })
  }


  async signup(email: string, username: string, password: string,){
    const auth = getAuth()
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, {displayName: username})
    let player = await PlayerService.createPlayer(cred.user.displayName, await cred.user.getIdToken())
      .catch(e=>console.log(e.message))
    console.log(`created new user and signed in`, cred.user, player)
    // this.playerData = player
  }

  async login(email: string, password: string){
    const auth = getAuth()
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log(`user signed in`, cred.user);
  }

  async logout(){
    const auth = getAuth()

    await signOut(auth)
  }

  addPlayerDataListener(key: string, f: (playerData: any)=>void){
    this.playerDataListeners.push({
      key, f
    })
  }

  removePlayerDataListener(key: string){
    this.playerDataListeners = this.playerDataListeners.filter(({key, f})=>key !== key)
  }

  setOnlineMode(mode: boolean){
    this.onlineMode = mode
  }

  setRole(roleId: string){
    this.roleId = roleId
  }

  /**
   * Returns options used when a colyseus room is created
   */
  getOptions(){
    return {IdToken: this.idToken, onlineMode: this.onlineMode, roleId: this.roleId}
  }

  static getConnection(){
    return ClientFirebaseConnection.singleton
  }
}

