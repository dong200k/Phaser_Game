import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";

export default class SplashScene extends Phaser.Scene {

    constructor() {
        super(SceneKey.SplashScene);  
    }

    create() {
        //--------- interactive background ----------
        let gameWidth = this.game.scale.width;
        let gameHeight = this.game.scale.height;
        let rect = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight);
        rect.setInteractive({cursor: "pointer"});
        rect.on(Phaser.Input.Events.POINTER_UP, () => {
            console.log("Splash Screen onclick");
        })
        

        // ------------ Splash Scene Text ------------
        let text = new TextBox(this, "Click anywhere to continue", "h1", ColorStyle.neutrals[900]);
        text.setPosition(gameWidth / 2, gameHeight / 2);
        this.add.existing(text);
    }

}