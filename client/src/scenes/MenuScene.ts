import Phaser from "phaser";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import { SceneKey } from "../config";
import SceneManager from "../system/SceneManager";
import DataManager from "../system/DataManager";
import TextBox from "../UI/TextBox";
import TextField from "../UI/TextField";
import { bakeBorderGraphicsFromLayout } from "../UI/Layoutable";

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
        let layout = new Layout(this, {
            x:this.game.scale.width/2,
            y:this.game.scale.height/2,
            gap:24
        });
        layout.add([playButton, settingsButton, controlsButton, creditsButton]);
        this.add.existing(layout);

        // this.test();
        // this.test2();
        // this.sampleSound = this.sound.add("button_click1");
    }

    // count = 1;
    // sampleSound!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    update(time: number, delta: number): void {
        
    }

    test() {
        let mainLayout = new Layout(this, {x:this.game.scale.width/2, y:this.game.scale.height/2});
        let layout1 = new Layout(this, {x:this.game.scale.width/2, y:this.game.scale.height/2});
        let b1 = new Button(this, "L1 BTN", 0, 0, "regular");
        let b2 = new Button(this, "L1 BTN", 0, 0, "small");
        let b3 = new Button(this, "L1 Hello World", 0, 0, "large");
        let text1 = new TextBox(this, "L1 Where this?", "h4");

        layout1.add([b1, b2, b3, text1]);
        layout1.setFlexDirection('col');
        layout1.setAlignItems('center');
        layout1.setGap(0);
        
        let layout2 = new Layout(this);
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
        let input = new TextField(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2,
            textFieldSize:"large",
        });
        this.add.existing(input);
        input.setText('Hello');
        input.setLabelVisible(true);
        input.setLabel("Username");
        input.setAssistTextVisible(true);
        input.setAssistText('5-16 characters');
        input.setFeedbackTextVisible(true);
        input.setFeedbackText("Too little characters!");
    }

    test3() {
        //---------- Debug graphics ------------
        let x = this.game.scale.width / 2;
        let y = this.game.scale.height / 2;
        let button = new Button(this, "Text Button 1", x, y, "regular", () => console.log("Lp gain"));
        let button2 = new Button(this, "Text Button 2", x, y, "regular", () => console.log("Lp gain2"));
        let button3 = new Button(this, "Text Button 3", x, y, "large", () => console.log("Lp gain"));
        let button4 = new Button(this, "Text Button 4", x, y, "regular", () => console.log("Lp gain2"));
        let text1 = new TextBox(this, "Text 1", "h1");
        let text2 = new TextBox(this, "Text 2", "h1"); 
        let text3 = new TextBox(this, "Text 3", "h1");
        
        let text4 = new TextBox(this, "Text 4", "h1");
        //let checkbox = new Checkbox(this, x, y);
        // let textField = new TextField(this, x, y);
        // textField.setLabelVisible(true);
        // textField.setLabel("Hello Test");
        // textField.setFeedbackTextVisible(true);
        // textField.setFeedbackText("Boom BANG Banw!!");
        // let navButton = new NavButton(this, "Not A NAV", x, y, () => console.log("doesn't nav"));
        // let roomPost = new RoomPost(this, x, y);
        // let textBox = new TextBox(this, "Where are the cookies now???", "l6");
        // textBox.setPosition(x, y);
        let layout = new Layout(this, {x,y});
        let layout2 = new Layout(this, {x,y});
        let layout3 = new Layout(this, {x,y});
        layout2.add([text1, text2]);
        layout2.setFlexDirection("row");
        layout2.setAlignItems("center");
        layout3.add([button3, button4]);
        layout3.setFlexDirection("row");
        layout3.setAlignItems("start");
        layout3.setGap(20);

        layout.add([text3, layout3]);
        layout.setFlexDirection("col");
        layout.setAlignItems("center");
        this.add.existing(layout);
        // this.add.rectangle(x, y, 10, 10, 0x000000, 0.1);
        
        let debugBorder = new Phaser.GameObjects.Graphics(this);
        debugBorder.setPosition(x, y);
        this.add.existing(debugBorder);

        text3.setOrigin(0, 0);
        layout.updateLayoutDisplay();

        bakeBorderGraphicsFromLayout(layout, debugBorder, 0x0000dd);
    }
}