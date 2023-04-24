import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";

export default class RoleScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.RoleScene)
    }

    create() {
        // ------- Title --------
        let title = new TextBox(this, "Role", "h3");
        title.setPosition(this.game.scale.width / 2, 150);
        title.setColor(ColorStyle.neutrals[900]);
        this.add.existing(title);
    }
}