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
