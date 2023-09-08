import Phaser from 'phaser';
import config from './config';
import DataManager from './system/DataManager';
import ClientFirebaseConnection from './firebase/ClientFirebaseConnection';
import { onSubmitLoginForm, onSubmitRegisterForm, toggleForm } from './pregameWebsite/formLogic';

// Connect to firebase
ClientFirebaseConnection.getConnection().startConnection()

let game: Phaser.Game
export const startPhaserGame = ()=>{
    // Hide website forms
    let body = document.getElementById("forms")
    if(body) body.style.display = "none"

    // Show login form when game is closed
    toggleForm(undefined, true)

    // Create a new Phaser game with predefined config.
    game = new Phaser.Game(config);
    
    // Runs the data manager on the game's update loop.
    game.events.on("step", () => DataManager.getDataManager().update());
}

export const stopPhaserGame = ()=>{
    game.destroy(true, false)
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
