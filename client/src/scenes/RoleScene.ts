import Phaser from "phaser";
import { SceneKey } from "../config";
import TextBox from "../UI/TextBox";

export default class RoleScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.RoleScene)
    }

    create() {
        // ------- Title --------
        let title = new TextBox(this, "Role", "h4");
        title.setPosition(this.game.scale.width / 2, 150);
        this.add.existing(title);
    }
}