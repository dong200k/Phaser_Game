import Phaser from 'phaser';
import config from './config';
import DataManager from './system/DataManager';
import ClientFirebaseConnection from './firebase/ClientFirebaseConnection';
import { onSubmitLoginForm, onSubmitRegisterForm } from './pregameWebsite/formLogic';

// Connect to firebase
ClientFirebaseConnection.getConnection().startConnection()

let game: Phaser.Game
export const startPhaserGame = ()=>{
    // Create a new Phaser game with predefined config.
    game = new Phaser.Game(config);
    
    // Runs the data manager on the game's update loop.
    game.events.on("step", () => DataManager.getDataManager().update());
}

export const stopPhaserGame = ()=>{
    game.destroy(true, false)
}

// Init Login and Signup forms
window.onload = ()=>{
    document.getElementById("loginForm")?.addEventListener("submit", onSubmitLoginForm)
    document.getElementById("signupForm")?.addEventListener("submit", onSubmitRegisterForm)
}
