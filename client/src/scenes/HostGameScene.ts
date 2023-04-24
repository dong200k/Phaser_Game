import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
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
        // -------- Background Box ---------
        this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2 - 12, 550, 490, ColorStyle.neutrals.hex[400]);

        // ------- Title --------
        let title = new TextBox(this, "Host Game", "h3");
        title.setColor(ColorStyle.neutrals[900]);
        title.setPosition(this.game.scale.width / 2, 220);
        this.add.existing(title);

        // ---------- TextFields -----------
        this.roomNameTextField = new TextField(this, {
            textFieldSize:'large',
            label: 'Room name',
            labelVisible: true,
            assistText: '6-20 characters',
            assistTextVisible: true,
        });
        this.numberOfPlayersTextField = new TextField(this, {
            textFieldSize:'large',
            label: 'Number of players',
            labelVisible: true,
            assistText: '1-10 players',
            assistTextVisible: true,
        });
        let textFieldLayout = new Layout(this, {
            flexDirection: 'col',
        });
        textFieldLayout.add([this.roomNameTextField, this.numberOfPlayersTextField]);

        // ---------- Private Checkbox -----------
        this.privateRoomCheckbox = new Checkbox(this, 0, 0);
        let privateRoomText = new TextBox(this, "Private room", 'l6');
        privateRoomText.setColor(ColorStyle.neutrals[900]);
        let privateRoomLayout = new Layout(this, {
            flexDirection: 'row',
            gap: 10,
        })
        privateRoomLayout.add([this.privateRoomCheckbox, privateRoomText]);
        
        // ----------- Buttons ------------ 
        let createRoomButton = new Button(this, "Create room", 0, 0, "regular", () => SceneManager.getSceneManager().pushScene("RoomScene"));
        let backButton = new Button(this, "Back", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());
        let buttonLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2,
            flexDirection:'row',
            gap: 55,
        });
        buttonLayout.add([backButton, createRoomButton]);
        
        // ----------- Form ------------ 

        let textFieldAndPrivateRoomLayout = new Layout(this, {
            flexDirection: 'col',
            alignItems: 'start',
            gap: 0,
        });
        textFieldAndPrivateRoomLayout.add([textFieldLayout, privateRoomLayout])

        let formLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2,
            gap: 28,
            flexDirection: 'col',
            alignItems: 'start',
        });

        formLayout.add([textFieldAndPrivateRoomLayout, buttonLayout]);
        this.add.existing(formLayout);
    }

}