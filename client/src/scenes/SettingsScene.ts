import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";

export default class SettingsScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.SettingsScene)
    }

    create() {
       // ------- Title --------
       let title = new TextBox(this, "Settings", "h3");
       title.setPosition(this.game.scale.width / 2, 150);
       title.setColor(ColorStyle.neutrals[900]);
       this.add.existing(title);

       // ------- Settings --------
       let temp = new TextBox(this, "There are no settings", "p2");
       temp.setPosition(this.game.scale.width / 2, 230);
       temp.setColor(ColorStyle.neutrals[900]);
       this.add.existing(temp);

       // ------ Back Button --------
       let backButton = new Button(this, "Back", this.game.scale.width / 2, 680, "large", () => SceneManager.getSceneManager().popScene());
       this.add.existing(backButton);
    }
}