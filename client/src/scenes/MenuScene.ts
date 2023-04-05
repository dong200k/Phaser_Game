import Phaser from "phaser";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import { SceneKey } from "../config";
import SceneManager from "../system/SceneManager";
import DataManager from "../system/DataManager";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SceneKey.MenuScene);
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
        sceneManager.switchToScene("MenuScene"); // Lets the SceneManager know the current scene.

        // Lets the dataManager know that the current scene is the main menu
        DataManager.getDataManager().setData("navbar", {activeOn: "home"});

        // Adds Menu Buttons
        let playButton = new Button(this, "Play", 0, 0, "large", () => SceneManager.getSceneManager().switchToScene("GameModeScene"));
        let settingsButton = new Button(this, "Settings", 0, 0, "large", () => console.log("Clicked on settings button"));
        let controlsButton = new Button(this, "Controls", 0, 0, "large", () => console.log("Clicked on controls button"));
        let creditsButton = new Button(this, "Credits", 0, 0, "large", () => console.log("Clicked on credits button"));
        let layout = new Layout(this, 120, this.game.scale.width/2, 200);
        layout.add([playButton, settingsButton, controlsButton, creditsButton]);
        this.add.existing(layout);
    }
}