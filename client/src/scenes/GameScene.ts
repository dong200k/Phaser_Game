import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import ClientManager from '../colyseus/ClientManager';
import GameManager from '../system/GameManager';

/**
 * The GameScene will be responsive for rendering the core gameplay. 
 */
export default class GameScene extends Phaser.Scene {

    private gameRoom?: Colyseus.Room;
    private gameManager?: GameManager;

    private upKey?: Phaser.Input.Keyboard.Key;
    private downKey?: Phaser.Input.Keyboard.Key;
    private leftKey?: Phaser.Input.Keyboard.Key;
    private rightKey?: Phaser.Input.Keyboard.Key;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image("demo_hero", "images/demo_hero.png");
    }

    create() {
        //Initialize fields
        this.initializeUI();
        this.initializeInputs();
        this.joinGameRoom();
    }

    update() {
        this.sendServerInputMessage();
    }

    /** Runs when the player successfully joined the game room */
    private onJoin() {
        if(this.gameRoom) {
            this.gameManager = new GameManager(this,this.gameRoom);
        }
        else
            console.log("ERROR: Game Room not initialized");
    }

    private initializeInputs() {
        this.upKey = this.input.keyboard.addKey("W");
        this.downKey = this.input.keyboard.addKey("S");
        this.rightKey = this.input.keyboard.addKey("D");
        this.leftKey = this.input.keyboard.addKey("A");
    }

    private initializeUI() {
        
    }

    private sendServerInputMessage() {
        //[0] up, [1] down, [2] left, [3] right, [4] special, [5] mouse click, [6] mousex, [7] mousey.
        let inputMesg = [0, 0, 0, 0, 0, 0, 0, 0];
        inputMesg[0] = this.upKey?.isDown? 1: 0;
        inputMesg[1] = this.downKey?.isDown? 1: 0;
        inputMesg[2] = this.leftKey?.isDown? 1: 0;
        inputMesg[3] = this.rightKey?.isDown? 1: 0;
        this.gameRoom?.send("input", inputMesg);
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
