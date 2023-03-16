import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import ClientManager from '../colyseus/ClientManager';
import GameManager from '../system/GameManager';

/**
 * The GameScene will be responsive for rendering the core gameplay. 
 */
export default class GameScene extends Phaser.Scene {

    private gameRoom: Colyseus.Room | null = null;
    private gameManager: GameManager | null = null;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image("demo_hero", "images/demo_hero.png");
    }

    create() {
        //Initialize fields
        this.gameRoom = null;
        
        this.initializeUI();
        this.joinGameRoom();
    }

    /** Runs when the player successfully joined the game room */
    private onJoin() {
        if(this.gameRoom != null)
            this.gameManager = new GameManager(this,this.gameRoom);
        else
            console.log("ERROR: Game Room not initialized");
    }

    private initializeUI() {
        
    }

    private joinGameRoom() {
        ClientManager.getClient().joinGameRoom().then((room) => {
            this.gameRoom = room;
            this.onJoin();
            console.log("Joined Game Room!");
        }).catch((e) => {
            console.log("Join Game Error: ", e);
        });
    }
}
