import Phaser from "phaser";
import Button from "../UI/Button";
import NavButton from "../UI/NavButton";
import Layout from "../UI/Layout";
import { SceneKey } from "../config";
import SceneManager from "../system/SceneManager";

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
        let textPos = {x: this.game.scale.width/2, y: this.game.scale.height/2}
        let sceneManager = SceneManager.getSceneManager();
        sceneManager.setScene(this);
        sceneManager.showNavbar();

        console.log("Menu created again");
        // let rect = {x: this.game.scale.width/2, y: this.game.scale.height/2, width: 200, height: 50, color: 0xAAAAAA}
        // NavButton(this, "Join Lobby", () => this.scene.start('LobbyScene'), textPos, rect)

        let playButton = new Button(this, "Play", 0, 0, "large", () => sceneManager.pushScene("LobbyScene"));
        let settingsButton = new Button(this, "Settings", 0, 0, "large", () => console.log("Clicked on settings button"));
        let controlsButton = new Button(this, "Controls", 0, 0, "large", () => console.log("Clicked on controls button"));
        let creditsButton = new Button(this, "Credits", 0, 0, "large", () => console.log("Clicked on credits button"));
        let layout = new Layout(this, 120, this.game.scale.width/2, 200);
        layout.add([playButton, settingsButton, controlsButton, creditsButton]);
        this.add.existing(layout);
    }
}