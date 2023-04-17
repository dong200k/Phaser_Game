import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import TextField from "../UI/TextField";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import Layout from "../UI/Layout";

export default class JoinWithIDScene extends Phaser.Scene {
    
    private roomIDTextField: TextField | null = null;

    constructor() {
        super(SceneKey.JoinWithIDScene)
    }

    create() {
        // -------- Background Box ---------
        this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2 - 12, 500, 400, ColorStyle.neutrals.hex[400]);

        // ------- Title --------
        let title = new TextBox(this, "Join By ID", "h4");
        title.setColor(ColorStyle.neutrals[900]);
        title.setPosition(this.game.scale.width / 2, 220);

        // ------- Room ID Text Field --------
        this.roomIDTextField = new TextField(this, {
            textFieldSize:'large',
            label: 'Room name',
            labelVisible: true,
            assistText: '6-20 characters',
            assistTextVisible: true,
        });

        // ----------- Buttons ------------ 
        let joinRoomButton = new Button(this, "Join room", 0, 0, "regular", () => console.log("Join room onclick"));
        let backButton = new Button(this, "Back", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());
        let buttonLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2,
            flexDirection:'row',
            gap: 55,
        });
        buttonLayout.add([joinRoomButton, backButton]);

        // ----------- Form ------------ 
        let formLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2,
            gap: 36,
            flexDirection: 'col',
            alignItems: 'center',
        });

        formLayout.add([title, this.roomIDTextField, buttonLayout]);
        this.add.existing(formLayout);
    }
}