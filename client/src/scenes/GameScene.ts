import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import ClientManager from '../system/ClientManager';
import GameManager from '../system/GameManager';
import { SceneKey } from '../config';

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
    private spaceKey?: Phaser.Input.Keyboard.Key;
    private debugKey?: Phaser.Input.Keyboard.Key;

    constructor() {
        super(SceneKey.GameScene);
    }

    preload() {
        this.load.image("demo_hero", "images/demo_hero.png");
        this.load.image("dirt_map_tiles", "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png");
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

    private initializeUI() {
        // this.cameras.main.setZoom(2);
    }

    private initializeInputs() {
        this.upKey = this.input.keyboard.addKey("W");
        this.downKey = this.input.keyboard.addKey("S");
        this.rightKey = this.input.keyboard.addKey("D");
        this.leftKey = this.input.keyboard.addKey("A");
        this.spaceKey = this.input.keyboard.addKey("SPACE");

        // Debug controls, not visible by default. Can be disabled in config.ts.
        this.debugKey = this.input.keyboard.addKey("F3");
        this.debugKey.on("down", () => {
            this.matter.world.debugGraphic?.setVisible(!this.matter.world.debugGraphic.visible);
        })
        this.matter.world.debugGraphic?.setVisible(false);
    }

    private sendServerInputMessage() {
        //[0] up, [1] down, [2] left, [3] right, [4] special, [5] mouse click, [6] mousex, [7] mousey.
        let inputMesg = [0, 0, 0, 0, 0, 0, 0, 0];
        inputMesg[0] = this.upKey?.isDown? 1 : 0;
        inputMesg[1] = this.downKey?.isDown? 1 : 0;
        inputMesg[2] = this.leftKey?.isDown? 1 : 0;
        inputMesg[3] = this.rightKey?.isDown? 1 : 0;
        inputMesg[4] = this.spaceKey?.isDown? 1 : 0;

        
        inputMesg[5] = this.input.mousePointer.isDown? 1 : 0;
        inputMesg[6] = this.input.mousePointer.worldX;
        inputMesg[7] = this.input.mousePointer.worldY;

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
