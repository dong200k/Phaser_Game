import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import SceneManager from "../system/SceneManager";
import TextBoxPhaser from "../UI/TextBoxPhaser";

export default class SplashScene extends Phaser.Scene {

    constructor() {
        super(SceneKey.SplashScene);  
    }

    create() {

        // Add background
        

        //--------- interactive background ----------
        let gameWidth = this.game.scale.width;
        let gameHeight = this.game.scale.height;
        let bg = this.add.image(0, 0, "SplashScreenImage"/*"dungeon_core_background"*/);
        bg.setDisplaySize(this.game.scale.width, this.game.scale.height)
            .setOrigin(0, 0)
            .texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        
        bg.setInteractive({cursor: "pointer"});
        bg.on(Phaser.Input.Events.POINTER_UP, () => {
            // console.log("Splash Screen onclick");
            SceneManager.getSceneManager().switchToScene(SceneKey.MenuScene);
        })
        

        // ------------ Splash Scene Text ------------
        let text = new TextBoxPhaser(this, "Click anywhere to continue", "h1");
        text.setColor(ColorStyle.primary[100])
        text.setPosition(gameWidth / 2, gameHeight - 100);
        text.setShadow(5, 5);
        this.add.existing(text);

        this.tweens.add({
            targets: [text],
            repeat: -1,
            ease: Phaser.Math.Easing.Linear,
            yoyo: true,
            duration: 1500,
            y: text.y - 10,
        })
    }

}