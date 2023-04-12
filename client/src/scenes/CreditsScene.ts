import Phaser from "phaser";
import { SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";

export default class CreditsScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.CreditsScene)
    }

    create() {
        // ------- Title --------
        let title = new TextBox(this, "Credits", "h4");
        title.setPosition(this.game.scale.width / 2, 150);
        this.add.existing(title);

        // ------- Credits ---------
        let credits = new TextBox(this, "Game Made By: Dong and Sheng", "p2");
        credits.setPosition(this.game.scale.width / 2, 230);
        this.add.existing(credits);


        // ------ Back Button --------
        let backButton = new Button(this, "Back", this.game.scale.width / 2, 680, "large", () => SceneManager.getSceneManager().popScene());
        this.add.existing(backButton);
    }
}