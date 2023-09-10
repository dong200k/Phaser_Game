import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import ClientManager from '../system/ClientManager';
import GameManager from '../system/GameManager';
import { ColorStyle, SceneKey } from '../config';
import SceneManager from '../system/SceneManager';
import EventManager from '../system/EventManager';
import LoadingScreen from '../UI/gameuis/LoadingScreen';
import AssetService from '../services/AssetService';
import AssetManager from '../system/AssetManager';
import LoadSystem from '../system/LoadSystem';

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

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;
    private gameRoom?: Colyseus.Room;
    private gameManager?: GameManager;

    // ------- loading screen -------
    private loadSystem!: LoadSystem;

    constructor() {
        super(SceneKey.GameScene);
    }

    init () {
        this.cameras.main.setBackgroundColor(ColorStyle.neutrals[800]);
    }

    create() {
        this.loadSystem = new LoadSystem(this);
        this.initializeListeners();
        this.joinGameRoom();
    }

    public initializeListeners() {
        EventManager.eventEmitter.on(EventManager.GameEvents.LEAVE_GAME, this.leaveGame, this);
        EventManager.eventEmitter.on(EventManager.GameEvents.SPECTATATE, this.spectate, this);
        this.events.on("shutdown", () => {
            EventManager.eventEmitter.off(EventManager.GameEvents.LEAVE_GAME, this.leaveGame, this);
            EventManager.eventEmitter.off(EventManager.GameEvents.SPECTATATE, this.spectate, this);
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
        })
    }

    /** Clean up the resources used by this GameScene. 
     * This will allow the GameScene to be reused the next time it is open. */
    public leaveGame() {
        if(this.scene.isActive(SceneKey.GameScene)) {
            this.gameRoom?.leave();
            this.children.getAll().forEach((obj) => {
                obj.destroy();
            })
            this.tweens.killAll();
            this.gameManager = undefined;
            this.gameRoom = undefined;
            let switchToSceneKey = SceneKey.MenuScene;
            if(ClientManager.getClient().isConnectedToWaitingRoom())
                switchToSceneKey = SceneKey.RoomScene;
            SceneManager.getSceneManager().switchToScene(switchToSceneKey);
        }
    }

    /** Changes the game manager to spectate mode. 
     * In spectate mode the player can left click to follow another player.
    */
    public spectate() {
        if(this.gameManager) {
            this.gameManager.setSpectating(true);
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

            // Reset the HUD.
            EventManager.eventEmitter.emit(EventManager.HUDEvents.RESET_HUD);

            // Create listeners for the new gameroom.
            this.initializeGameRoomListeners(this.gameRoom);

            this.gameManager = new GameManager(this, this.gameRoom);
            
        }).catch((e) => {
            console.log("Join Game Error: ", e);
        });
    }

    private initializeGameRoomListeners(gameRoom: Colyseus.Room) {
        gameRoom.onMessage("loadAssets", (assets) => {
            console.log(assets);
            // Create load item for grabbing online asset documents.
            this.loadSystem.addLoadItem({
                name: "Grabbing Assets...",
                loadFunction: () => AssetManager.putAssetsInLoad(this, assets),
            })
            // Create load item for running the phaser loader.
            this.loadSystem.addLoadItemPhaserLoader(this, "Loading Assets...");
            this.loadSystem.startLoad().then(() => {
                // Done Loading! We can start the game.
                if(this.gameRoom) {
                    this.gameRoom.send("loadAssetComplete");
                    this.cameras.main.setZoom(2);
                    this.showHUD();
                }
            })
        })

        gameRoom.onLeave((code) => this.onLeaveHandler(code));
        gameRoom.onError((code, message) => this.onErrorHandler(code, message));
    }

    /** Handles the cleanup of the game room when the client leaves the game. */ 
    private onLeaveHandler(code: number) {
        console.log(`Client left the game room! Code: ${code}`);
        this.leaveGame();
    }

    /** Handles the cleanup of the game room when the server crashes. */ 
    private onErrorHandler(code: number, message: string | undefined) {
        console.log(`Error Code: ${code} Message: ${message}`);
        this.leaveGame();
    }
}
