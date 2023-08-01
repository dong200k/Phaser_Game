import Phaser from 'phaser';
import config from './config';
import DataManager from './system/DataManager';
import ClientFirebaseConnection from './firebase/ClientFirebaseConnection';

// Connect to firebase
ClientFirebaseConnection.getConnection().startConnection()

// Create a new Phaser game with predefined config.
const game = new Phaser.Game(config);

// Runs the data manager on the game's update loop.
game.events.on("step", () => DataManager.getDataManager().update());
