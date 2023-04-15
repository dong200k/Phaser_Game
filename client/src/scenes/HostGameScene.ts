import Phaser from "phaser";
import { SceneKey } from "../config";
import Checkbox from "../UI/Checkbox";
import TextField from "../UI/TextField";
import Layout from "../UI/Layout";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import { bakeBorderGraphicsFromLayout } from "../UI/Layoutable";
import NavButton from "../UI/NavButton";
import RoomPost from "../UI/RoomPost";
import TextBox from "../UI/TextBox";

export default class HostGameScene extends Phaser.Scene {
    
    private roomNameTextField: TextField | null = null;
    private numberOfPlayersTextField: TextField | null = null;
    private privateRoomCheckbox: Checkbox | null = null;

    constructor() {
        super(SceneKey.HostGameScene)
    }

    create() {

        // // ---------- Form -----------
        // this.roomNameTextField = new TextField(this, 0, 0, "large");
        // this.numberOfPlayersTextField = new TextField(this, 0, 0, "large");
        // this.privateRoomCheckbox = new Checkbox(this, 0, 0);
        
        // let formLayout = new Layout(this, 10, this.game.scale.width / 2, this.game.scale.height / 2 - 100);
        // formLayout.add([this.roomNameTextField, this.numberOfPlayersTextField, this.privateRoomCheckbox]);
        // formLayout.setFlexDirection("col");
        // formLayout.setAlignItems("start");
        // this.add.existing(formLayout);

        // // ----------- Form Buttons ------------ 
        // let createRoomButton = new Button(this, "Create room", 0, 0, "regular", () => console.log("Create room onclick"));
        // let backButton = new Button(this, "Back", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());
        // let buttonLayout = new Layout(this, 20, this.game.scale.width / 2, this.game.scale.height / 2);
        // buttonLayout.add([createRoomButton, backButton]);
        // buttonLayout.setFlexDirection("row");
        // this.add.existing(buttonLayout);


        //---------- Debug graphics ------------
        let x = this.game.scale.width / 2;
        let y = this.game.scale.height / 2;
        let button = new Button(this, "Text Button 1", x, y, "regular", () => console.log("Lp gain"));
        let button2 = new Button(this, "Text Button 2", x, y, "regular", () => console.log("Lp gain2"));
        let button3 = new Button(this, "Text Button 3", x, y, "regular", () => console.log("Lp gain"));
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
        let layout = new Layout(this, 0, x, y);
        let layout2 = new Layout(this, 0, x, y);
        let layout3 = new Layout(this, 0, x, y);
        layout2.add([text1, text2]);
        layout2.setFlexDirection("col-reverse");
        layout2.setAlignItems("start");
        layout3.add([button3, button4]);
        layout3.setFlexDirection("col-reverse");
        layout3.setAlignItems("start");

        // layout.add([layout2, layout3]);
        // layout.setFlexDirection("col-reverse");
        // layout.setAlignItems("start");
        this.add.existing(layout2);
        // this.add.rectangle(x, y, 10, 10, 0x000000, 0.1);
        
        let debugBorder = new Phaser.GameObjects.Graphics(this);
        debugBorder.setPosition(x, y);
        this.add.existing(debugBorder);

        bakeBorderGraphicsFromLayout(layout2, debugBorder, 0x0000dd);
    }

}