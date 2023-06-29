import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import ClientManager from '../system/ClientManager';
import GameManager from '../system/GameManager';
import { SceneKey } from '../config';
import SceneManager from '../system/SceneManager';
import EventManager from '../system/EventManager';

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
