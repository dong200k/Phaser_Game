import Phaser from "phaser";
import { SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import Layout from "../UI/Layout";

export default class ControlsScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.ControlsScene)
    }

    create() {
        // ------- Title --------
        let title = new TextBox(this, "Controls", "h4");
        title.setPosition(this.game.scale.width / 2, 150);
        this.add.existing(title);

        // ------- Controls ---------
        let w = new TextBox(this, "W - move up", "p2");
        let a = new TextBox(this, "A - move left", "p2");
        let s = new TextBox(this, "S - move down", "p2");
        let d = new TextBox(this, "D - move right", "p2");
        let space = new TextBox(this, "Spacebar - special ability", "p2");
        let mouse = new TextBox(this, "Move mouse - aim", "p2");
        let leftClick = new TextBox(this, "Left click - fire weapon", "p2");
        let controlLayout = new Layout(this, {
            x:this.game.scale.width / 2,
            y:this.game.scale.height / 2 - 80,
            gap: 12,
        });
        controlLayout.add([w, a, s, d, space, mouse, leftClick]);
        this.add.existing(controlLayout);

        // ------ Back Button --------
        let backButton = new Button(this, "Back", this.game.scale.width / 2, 680, "large", () => SceneManager.getSceneManager().popScene());
        this.add.existing(backButton);
    }
}