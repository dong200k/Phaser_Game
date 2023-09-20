import Phaser from 'phaser';
import config from './config';
import DataManager from './system/DataManager';
import ClientFirebaseConnection from './firebase/ClientFirebaseConnection';
import { onSubmitLoginForm, onSubmitRegisterForm, toggleForm } from './pregameWebsite/formLogic';
import SceneManager from './system/SceneManager';

// Connect to firebase
ClientFirebaseConnection.getConnection().startConnection()
let game: Phaser.Game | undefined = undefined;

/** Begins a phaser game. If a game is already created resume that game. */
export const startPhaserGame = ()=>{
    // Hide website forms
    let body = document.getElementById("forms")
    if(body) body.style.display = "none"

    // Show login form when game is closed
    toggleForm(undefined, true)

    if(!game) {
        // Create a new Phaser game with predefined config.
        game = new Phaser.Game(config);
        // Runs the data manager on the game's update loop.
        game.events.on("step", () => DataManager.getDataManager().update());
    } else {
        // New user logged in! Resume game and switch to the splash scene.
        game.resume();
        SceneManager.getSceneManager().switchToScene("SplashScene");
    }

    // Shows the game-div.
    document.getElementById("game")?.classList.remove("display-none");
}

/** Pauses the phaser game. Hides the game canvas from view. */
export const stopPhaserGame = ()=> {    
    game?.pause();
    document.getElementById("game")?.classList.add("display-none");
    // show website forms
    let body = document.getElementById("forms")
    if(body) body.style.display = "block"
}

// Init Login and Signup forms
window.onload = ()=>{
    document.getElementById("loginForm")?.addEventListener("submit", onSubmitLoginForm);
    document.getElementById("signupForm")?.addEventListener("submit", onSubmitRegisterForm);
    (<HTMLInputElement>document.getElementById("showregister")).onclick = toggleForm;
    (<HTMLInputElement>document.getElementById("showlogin")).onclick = toggleForm;
}
