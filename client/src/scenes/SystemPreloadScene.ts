import Phaser from "phaser";
import { SceneKey, StartScene } from "../config";
import SceneManager from "../system/SceneManager";

/**
 * The purpose of this Scene is to preload important managers such as the SceneManager. 
 * It has no other gameplay or menu purpose. It also contains the switch to the first scene.
 */
export default class SystemPreloadScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.SystemPreloadScene);
    }

    preload() {
        this.load.image("button_small_active", "images/button/button_small_active.png");
        this.load.image("button_small_deactive", "images/button/button_small_deactive.png");
        this.load.image("button_small_default", "images/button/button_small_default.png");
    }

    create() {
        /** Initialize the SceneManager and sets this scene as the current scene. */
        let sceneManager = SceneManager.getSceneManager();
        sceneManager.setScene(this);
        sceneManager.switchToScene("SystemPreloadScene"); // Lets the SceneManager know the current scene.
        sceneManager.switchToScene(StartScene);
    }

}