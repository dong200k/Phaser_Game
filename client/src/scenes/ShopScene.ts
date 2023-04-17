import Phaser from "phaser";
import { SceneKey } from "../config";
import TextBox from "../UI/TextBox";

export default class ShopScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.ShopScene)
    }

    create() {
        // ------- Title --------
       let title = new TextBox(this, "Shop", "h4");
       title.setPosition(this.game.scale.width / 2, 150);
       this.add.existing(title);
    }
}