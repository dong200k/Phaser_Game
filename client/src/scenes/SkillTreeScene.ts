import Phaser from "phaser";
import { SceneKey } from "../config";
import TextBox from "../UI/TextBox";

export default class SkillTreeScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.SkillTreeScene)
    }

    create() {
        // ------- Title --------
       let title = new TextBox(this, "Skill Tree", "h4");
       title.setPosition(this.game.scale.width / 2, 150);
       this.add.existing(title);
    }
}