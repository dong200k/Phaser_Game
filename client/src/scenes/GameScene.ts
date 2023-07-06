import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import ClientManager from '../system/ClientManager';
import GameManager from '../system/GameManager';
import { SceneKey } from '../config';
import SceneManager from '../system/SceneManager';
import EventManager from '../system/EventManager';

interface MobAsset {
    key: string;
    png: string;
    json: string;
}

// Server -> MobAssets -> Load on client.

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
        //this.load.image("TinyZombieOld", "images/zombie_1.png");
        this.load.image("frost-glaive", "images/projectiles/frost-glaive.png");

        // Load animations 
        /**
         * What we need. We need to be able to run the animation based on the state of the server.
         * - The player should face the direction of the mouse. The server can keep the state of this.
         * - When the player moves the walking animation should play.
         * - when the player shoots the fire animation should play, need to figure out a way to time the animation with the shot.
         */

        this.load.aseprite("TinyZombie", "images/mobs/zombie_1.png", "images/mobs/zombie_1.json");
        this.load.aseprite("Ranger", "images/roles/ranger.png", "images/roles/ranger.json");
    }

    create() {
        //Initialize fields
        this.anims.createFromAseprite("TinyZombie");
        this.anims.createFromAseprite("Ranger");
        // this.anims.remove()
        this.initializeListeners();
        this.joinGameRoom();
        
        this.showHUD();
        this.cameras.main.setZoom(2);
    }

    public initializeListeners() {
        
        EventManager.eventEmitter.on(EventManager.GameEvents.LEAVE_GAME, this.leaveGame, this);
        this.events.on("shutdown", () => {
            EventManager.eventEmitter.off(EventManager.GameEvents.LEAVE_GAME, this.leaveGame, this);
            this.events.removeAllListeners();
            this.hideHUD();
            
            console.log("Onshutdown!!!");
        });
        this.events.on("sleep", () => {
            this.hideHUD();
        })
        // When waking this scene (When sceneManager switches back to this scene) join game room and show hud.
        this.events.on("wake", () => {
            this.joinGameRoom();
            this.showHUD();
        })
    }

    public leaveGame() {
        if(this.scene.isActive(SceneKey.GameScene)) {
            this.gameRoom?.leave();
            this.children.getAll().forEach((obj) => {
                obj.destroy();
            })
            this.gameManager = undefined;
            this.gameRoom = undefined;
            let switchToSceneKey = SceneKey.MenuScene;
            if(ClientManager.getClient().isConnectedToWaitingRoom())
                switchToSceneKey = SceneKey.RoomScene;
            SceneManager.getSceneManager().switchToScene(switchToSceneKey);
        }
    }

    update(time: number, deltaT: number) {
        this.gameManager?.update(time, deltaT);
    }

    public showHUD() {
        SceneManager.getSceneManager().showHUD();
    }

    public hideHUD() {
        SceneManager.getSceneManager().hideHUD();
    }

    private joinGameRoom() {
        ClientManager.getClient().joinGameRoom().then((room) => {
            this.gameRoom = room;
            this.gameRoom.onLeave(() => {
                this.gameRoom = undefined;
            });
            EventManager.eventEmitter.emit(EventManager.HUDEvents.RESET_HUD);
            this.gameManager = new GameManager(this,this.gameRoom);
        }).catch((e) => {
            console.log("Join Game Error: ", e);
        });
    }
}
