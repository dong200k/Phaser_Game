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
     private loadingScreen?: LoadingScreen;
     private loading: boolean;
     private loadingProgress: number;

    constructor() {
        super(SceneKey.GameScene);
        this.loading = true;
        this.loadingProgress = 0;
    }

    init () {
        this.cameras.main.setBackgroundColor(ColorStyle.neutrals[800]);
        //this.cameras.main.setZoom(2);
    }

    preload() {
        // this.loadingScreen = new LoadingScreen(this);
    }

    create() {
        //Initialize fields
        //this.anims.createFromAseprite("TinyZombie");
        //this.anims.createFromAseprite("Ranger");
        //this.anims.createFromAseprite("RangerArrow");
        
        // this.anims.remove()
        this.initializeListeners();
        this.joinGameRoom();
        //this.showHUD();
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
            //this.showHUD();
        })
        this.load.on("progress", (value: number) => {
            console.log(value);
            this.loadingScreen?.updateProgressBarValue(value);
        })
        this.load.on("fileprogress", (file: Phaser.Loader.File) => {
            console.log(file.src);
            this.loadingScreen?.updateProgressBarText(file.src);
        })
        this.load.on("complete", () => {
            console.log("loading complete");
            if(this.gameRoom) {
                this.gameRoom.send("loadAssetComplete");
                // Process game start.
                this.loadingScreen?.setVisible(false);
                this.cameras.main.setZoom(2);
                this.showHUD();
            }
        })
    }


    public leaveGame() {
        if(this.scene.isActive(SceneKey.GameScene)) {
            this.gameRoom?.leave();
            this.children.getAll().forEach((obj) => {
                obj.destroy();
            })
            this.tweens.killAll();
            this.gameManager = undefined;
            this.gameRoom = undefined;
            this.loadingScreen = undefined;
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

            // Show loading screen when loading assets.
            this.cameras.main.setZoom(1);
            this.cameras.main.stopFollow();
            this.cameras.main.setScroll(0, 0);
            this.loadingScreen = new LoadingScreen(this);
            this.loadingScreen.setVisible(true);

            this.gameRoom.onMessage("loadAssets", async (assets) => {
                console.log(assets);
                await AssetManager.putAssetsInLoad(this, assets);
                this.load.start();
            })

            this.gameManager = new GameManager(this, this.gameRoom);
            
        }).catch((e) => {
            console.log("Join Game Error: ", e);
        });
    }
}
