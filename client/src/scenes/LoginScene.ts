import Phaser from "phaser";
import { ColorStyle, SceneKey, StartScene } from "../config";
import TextBox from "../UI/TextBox";
import TextField from "../UI/TextField";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import SceneManager from "../system/SceneManager";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
        let loginButton = new Button(this, "Login", 0, 0, "regular", () => {
            let email = emailTextField.getText()
            let password = passwordTextField.getText()
            ClientFirebaseConnection.getConnection().login(email, password)
                .then(()=>{
                    SceneManager.getSceneManager().switchToScene(StartScene)
                })
                .catch(err=>{
                    alert(err.message)
                })
        });


        // -------- Signup text ---------
        let signupText = new TextBox(this, "Or click here to signup", "p6");
        signupText.getDIVElement().style.textDecoration = 'underline';
        signupText.getDIVElement().onclick = ()=>{
            SceneManager.getSceneManager().switchToScene(SceneKey.SignupScene)
        }

        // -------- Login form ---------
        let layout = new Layout(this, {
            x: this.game.scale.width / 2,
            y: this.game.scale.height / 2,
            gap: 42
        });
        layout.add([title, textFieldLayout, loginButton, signupText]);
        this.add.existing(layout);

        // const auth = getAuth()
    
        // // Listen and update user data when user changes from login, logout, signup
        // onAuthStateChanged(auth, async user=>{
        //   if(user){
        //     SceneManager.getSceneManager().switchToScene(StartScene)
        //   }
        // })
    }
}