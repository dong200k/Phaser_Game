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

        // ---------- Form -----------
        this.roomNameTextField = new TextField(this, {textFieldSize:'large'});
        this.numberOfPlayersTextField = new TextField(this, {textFieldSize:'large'});
        this.privateRoomCheckbox = new Checkbox(this, 0, 0);
        
        let formLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2 - 100,
            gap: 10,
            flexDirection: 'col',
            alignItems: 'start',
        });
        formLayout.add([this.roomNameTextField, this.numberOfPlayersTextField, this.privateRoomCheckbox]);
        this.add.existing(formLayout);

        // ----------- Form Buttons ------------ 
        let createRoomButton = new Button(this, "Create room", 0, 0, "regular", () => console.log("Create room onclick"));
        let backButton = new Button(this, "Back", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());
        let buttonLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2,
        });
        buttonLayout.add([createRoomButton, backButton]);
        buttonLayout.setFlexDirection("row");
        
        formLayout.add(buttonLayout);


       
    }

}