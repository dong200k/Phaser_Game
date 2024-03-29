import Phaser from "phaser";
import { ColorStyle, SceneKey, StartScene } from "../config";
import TextBox from "../UI/TextBox";
import TextField from "../UI/TextField";
import Layout from "../UI/Layout";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default class SignupScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.SignupScene)
    }

    create() {
        // -------- Background Box ---------
        this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2, 500, 650, ColorStyle.neutrals.hex[400]);

        // ------- Title --------
        let title = new TextBox(this, "Signup", "h2");
        title.setColor(ColorStyle.neutrals[900]);
        title.setPosition(this.game.scale.width / 2, 220);

        // ------- TextFields --------
        let usernameTextField = new TextField(this, {labelVisible: true, label: 'Username', assistText:"Displayed in game", assistTextVisible: true});
        let emailTextField = new TextField(this, {labelVisible: true, label: 'Email'});
        emailTextField.getInputDOM().type = 'email';
        let passwordTextField = new TextField(this, {labelVisible: true, label: 'Password', assistText:"At least 6 characters", assistTextVisible: true});
        passwordTextField.getInputDOM().type = 'password';
        let confirmPasswordTextField = new TextField(this, {labelVisible: true, label: 'Confirm Password', assistText:"Retype password", assistTextVisible: true});
        confirmPasswordTextField.getInputDOM().type = 'password';
        let textFieldLayout = new Layout(this, {flexDirection:'col'});
        textFieldLayout.add([usernameTextField, emailTextField, passwordTextField, confirmPasswordTextField]);


        // ------- login button --------
        let loginButton = new Button(this, "Sign me up", 0, 0, "regular", () => {
            let password = passwordTextField.getText()
            let confirmPassword = confirmPasswordTextField.getText()
            if(password !== confirmPassword) return alert("Passwords do not match!")
            
            let email = emailTextField.getText()
            let username = usernameTextField.getText()
            ClientFirebaseConnection.getConnection().signup(email, username, password)
                .then(()=>{
                    SceneManager.getSceneManager().switchToScene(StartScene)
                })
                .catch(err=>{
                    alert(err.message)
                    alert(err)
                })
        });


        // -------- Signup text ---------
        let signupText = new TextBox(this, "Or click here to login", "p6");
        signupText.getDIVElement().style.textDecoration = 'underline';
        signupText.getDIVElement().onclick = ()=>{
            SceneManager.getSceneManager().switchToScene(SceneKey.LoginScene)
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