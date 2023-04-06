import Phaser from "phaser";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import { SceneKey } from "../config";
import SceneManager from "../system/SceneManager";
import DataManager from "../system/DataManager";
import TextBox from "../UI/TextBox";

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

        // // Adds Menu Buttons
        // let playButton = new Button(this, "Play", 0, 0, "large", () => SceneManager.getSceneManager().switchToScene("GameModeScene"));
        // let settingsButton = new Button(this, "Settings", 0, 0, "large", () => console.log("Clicked on settings button"));
        // let controlsButton = new Button(this, "Controls", 0, 0, "large", () => console.log("Clicked on controls button"));
        // let creditsButton = new Button(this, "Credits", 0, 0, "large", () => console.log("Clicked on credits button"));
        // let layout = new Layout(this, 120, this.game.scale.width/2, 200);
        // layout.add([playButton, settingsButton, controlsButton, creditsButton]);
        // this.add.existing(layout);
        this.test();
    }

    test() {
        let layout = new Layout(this, 20, this.game.scale.width/2, this.game.scale.height/2);
        let b1 = new Button(this, "Button 1", 0, 0, "small");
        let b2 = new Button(this, "Button 2", 0, 0, "small");
        let b3 = new Button(this, "Hello World", 0, 0, "large");
        let text1 = new TextBox(this, "Where is this?", "h4");

        layout.add([b1, b2, b3, text1]);
        this.add.existing(layout);
    }
}