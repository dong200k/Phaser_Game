import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIFactory from "../UI/UIFactory";
import SettingsManager from "../system/SettingsManager";
import SettingsScreen from "../UI/SettingsScreen";



export default class SettingsScene extends Phaser.Scene {
    
    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;

    constructor() {
        super(SceneKey.SettingsScene)
    }

    create() {
        this.initializeUI();
        this.initializeListeners();
    }

    private initializeUI() {
        // ------- Title --------
        let title = new TextBox(this, "Settings", "h3");
        title.setPosition(this.game.scale.width / 2, 150);
        title.setColor(ColorStyle.neutrals[900]);
        this.add.existing(title);

        // ------- Settings --------

        let settingsScreen = new SettingsScreen(this, this.game.scale.width, 450);
        let settingsPanel = settingsScreen.getSettingsPanel();
        settingsPanel.setPosition(this.game.scale.width / 2, this.game.scale.height / 2);
        settingsPanel.layout();

        // ------ Back Button --------
        let backButton = new Button(this, "Back", this.game.scale.width / 2, 680, "large", () => {
            //TODO: Save settings onto database.
            SceneManager.getSceneManager().popScene();
            let settingsString = JSON.stringify(SettingsManager.getManager().getSettingsAsObject());
            window.localStorage.setItem("settings", settingsString);
        });
        this.add.existing(backButton);
    }

    private initializeListeners() {
        // this.events.on("shutdown", () => {
        //     console.log("Settings Scene Shutdown");
        // });
        // this.events.on("sleep", () => {
        //     console.log("Settings Scene Sleep");
        // });
        // this.events.on("wake", () => {
        //     console.log("Settings Scene Wake");
        // });
    }
}