import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import Layout from "../UI/Layout";

export default class MatchmakeScene extends Phaser.Scene {

    private loadText: TextBox | null = null;
    
    constructor() {
        super(SceneKey.MatchmakeScene)
    }

    create() {
        // -------- Background Box ---------
        this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2 - 12, 520, 360, ColorStyle.neutrals.hex[400]);

        // ------- Title --------
        let title = new TextBox(this, "Matchmake", "h3");
        title.setColor(ColorStyle.neutrals[900]);
        title.setPosition(this.game.scale.width / 2, this.game.scale.height / 2 - 112);
        this.add.existing(title);

        // ------- Loading Text --------
        this.loadText = new TextBox(this, "Searching for a game .");

        // ------- Back button ---------
        let backButton = new Button(this, "Back", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());

        // -------- Layout Container-----------
        let layout = new Layout(this, {
            flexDirection: 'col',
            gap: 20,
            alignItems: 'center',
            x: this.game.scale.width / 2,
            y: this.game.scale.height / 2 + 20,
        })
        layout.add([this.loadText, backButton]);
        this.add.existing(layout);
    }

    update(time: number) {
        let secondsPassed = Math.floor(time / 1000);
        if(secondsPassed % 3 === 0) {
            this.loadText?.setText("Searching for a game .");
        } else if(secondsPassed % 3 === 1) {
            this.loadText?.setText("Searching for a game . .");
        } else {
            this.loadText?.setText("Searching for a game . . .");
        }
    }
}