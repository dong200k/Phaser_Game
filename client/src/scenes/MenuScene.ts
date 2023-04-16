import Phaser from "phaser";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import { SceneKey } from "../config";
import SceneManager from "../system/SceneManager";
import DataManager from "../system/DataManager";
import TextBox from "../UI/TextBox";
import TextField from "../UI/TextField";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super(SceneKey.MenuScene);
    }

    preload() {
        
    }

    create() {
        // Lets the dataManager know that the current scene is the main menu
        DataManager.getDataManager().setData("navbar", {activeOn: "home"});

        // Adds Menu Buttons
        let playButton = new Button(this, "Play", 0, 0, "large", () => SceneManager.getSceneManager().switchToScene("GameModeScene"));
        let settingsButton = new Button(this, "Settings", 0, 0, "large", () => SceneManager.getSceneManager().pushScene("SettingsScene"));
        let controlsButton = new Button(this, "Controls", 0, 0, "large", () => SceneManager.getSceneManager().pushScene("ControlsScene"));
        let creditsButton = new Button(this, "Credits", 0, 0, "large", () => SceneManager.getSceneManager().pushScene("CreditsScene"));
        let layout = new Layout(this, this.game.scale.width/2, this.game.scale.height/2, {
            gap:24
        });
        layout.add([playButton, settingsButton, controlsButton, creditsButton]);
        this.add.existing(layout);

        

        // this.test();
        // this.test2();
    }

    test() {
        let mainLayout = new Layout(this, this.game.scale.width/2, this.game.scale.height/2);
        let layout1 = new Layout(this, this.game.scale.width/2, this.game.scale.height/2);
        let b1 = new Button(this, "L1 BTN", 0, 0, "regular");
        let b2 = new Button(this, "L1 BTN", 0, 0, "small");
        let b3 = new Button(this, "L1 Hello World", 0, 0, "large");
        let text1 = new TextBox(this, "L1 Where this?", "h4");

        layout1.add([b1, b2, b3, text1]);
        layout1.setFlexDirection('col');
        layout1.setAlignItems('center');
        layout1.setGap(0);
        
        let layout2 = new Layout(this, 0, 0);
        let b4 = new Button(this, "L2 BTN", 0, 0, "regular");
        let b5 = new Button(this, "L2 BTN", 0, 0, "small");
        let b6 = new Button(this, "L2 Hello World", 0, 0, "large");
        let text2 = new TextBox(this, "L2 Where this?", "h4");

        layout2.add([b4,b5,b6,text2]);
        layout2.setFlexDirection('row');
        layout2.setAlignItems('center');
        layout2.setGap(0);


        mainLayout.add([layout1, layout2]);
        mainLayout.setFlexDirection('row');
        mainLayout.setAlignItems('start');
        mainLayout.setGap(0);
    
        this.add.existing(mainLayout);
    }

    test2() {
        let input = new TextField(this, this.game.scale.width / 2, this.game.scale.height / 2, "large");
        this.add.existing(input);
        input.setText('Hello');
        input.setLabelVisible(true);
        input.setLabel("Username");
        input.setAssistTextVisible(true);
        input.setAssistText('5-16 characters');
        input.setFeedbackTextVisible(true);
        input.setFeedbackText("Too little characters!");
    }
}