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


    constructor() {
        super(SceneKey.GameScene);
    }

    preload() {
        this.load.image("demo_hero", "images/demo_hero.png");
        this.load.image("dirt_map_tiles", "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png");
        this.load.image("TinyZombie", "images/zombie_1.png");
        this.load.image("frost-glaive", "images/projectiles/frost-glaive.png")
    }

    create() {
        //Initialize fields
        this.initializeUI();
        this.joinGameRoom();
    }

    update(time: number, deltaT: number) {
        this.gameManager?.update(time, deltaT);
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
        this.cameras.main.setZoom(1.5);
    }

    // private initializeInputs() {
    //     this.upKey = this.input.keyboard?.addKey("W");
    //     this.downKey = this.input.keyboard?.addKey("S");
    //     this.rightKey = this.input.keyboard?.addKey("D");
    //     this.leftKey = this.input.keyboard?.addKey("A");
    //     this.spaceKey = this.input.keyboard?.addKey("SPACE");

    //     // Debug controls, not visible by default. Can be disabled in config.ts.
    //     this.debugKey = this.input.keyboard?.addKey("F3");
    //     this.debugKey?.on("down", () => {
    //         this.matter.world.debugGraphic?.setVisible(!this.matter.world.debugGraphic.visible);
    //     })
    //     this.matter.world.debugGraphic?.setVisible(false);
    // }

    // private sendServerInputMessage() {
    //     //[0] up, [1] down, [2] left, [3] right, 
    //     let movementData = [0, 0, 0, 0]
    //     movementData[0] = this.upKey?.isDown? 1 : 0;
    //     movementData[1] = this.downKey?.isDown? 1 : 0;
    //     movementData[2] = this.leftKey?.isDown? 1 : 0;
    //     movementData[3] = this.rightKey?.isDown? 1 : 0;
    //     this.gameRoom?.send("move", movementData)

    //     let special = this.spaceKey?.isDown? true : false;
    //     this.gameRoom?.send("special", special);
        

    //     //[0] mouse click, [1] mousex, [2] mousey.
    //     let mouseData = [0, 0, 0]
    //     mouseData[0] = this.input.mousePointer.isDown? 1 : 0;
    //     this.input.mousePointer.updateWorldPoint(this.cameras.main);
    //     mouseData[1] = this.input.mousePointer.worldX;
    //     mouseData[2] = this.input.mousePointer.worldY;
    //     this.gameRoom?.send("attack", mouseData);
    // }

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
