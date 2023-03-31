import Phaser from "phaser";
import Button from "../UI/Button";
import NavButton from "../UI/NavButton";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image("button_small_active", "images/button/button_small_active.png");
        this.load.image("button_small_deactive", "images/button/button_small_deactive.png");
        this.load.image("button_small_default", "images/button/button_small_default.png");
    }

    create() {
        this.add.rectangle(0, 0, this.game.scale.width, this.game.scale.height, 0x736B64).setOrigin(0, 0); //background
        let textPos = {x: this.game.scale.width / 2 - 48, y: this.game.scale.height / 2 - 6}
        // let rect = {x: this.game.scale.width/2, y: this.game.scale.height/2, width: 200, height: 50, color: 0xAAAAAA}
        // NavButton(this, "Join Lobby", () => this.scene.start('LobbyScene'), textPos, rect)

        let joinButton = new Button(this, "Join Lobby", textPos.x, textPos.y, "regular", () => this.scene.start('LobbyScene'));
        this.add.existing(joinButton);
    }
}