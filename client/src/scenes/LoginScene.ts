import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import TextField from "../UI/TextField";
import Button from "../UI/Button";
import Layout from "../UI/Layout";

export default class LoginScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.LoginScene)
    }

    create() {
        // -------- Background Box ---------
        this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2 - 12, 500, 550, ColorStyle.neutrals.hex[400]);

        // ------- Title --------
        let title = new TextBox(this, "Login", "h2");
        title.setColor(ColorStyle.neutrals[900]);
        title.setPosition(this.game.scale.width / 2, 220);

        // ------- TextFields --------
        let emailTextField = new TextField(this, {labelVisible: true, label: 'Email'});
        emailTextField.getInputDOM().type = 'email';
        let passwordTextField = new TextField(this, {labelVisible: true, label: 'Password'});
        passwordTextField.getInputDOM().type = 'password';
        let textFieldLayout = new Layout(this, {flexDirection:'col'});
        textFieldLayout.add([emailTextField, passwordTextField]);


        // ------- login button --------
        let loginButton = new Button(this, "Login", 0, 0, "regular", () => {console.log("login onclick")});


        // -------- Signup text ---------
        let signupText = new TextBox(this, "Or click here to signup", "p6");
        signupText.getDIVElement().style.textDecoration = 'underline';

        // -------- Login form ---------
        let layout = new Layout(this, {
            x: this.game.scale.width / 2,
            y: this.game.scale.height / 2,
            gap: 42
        });
        layout.add([title, textFieldLayout, loginButton, signupText]);
        this.add.existing(layout);
    }
}