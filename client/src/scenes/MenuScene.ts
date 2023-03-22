import Phaser from "phaser";
import NavButton from "../UI/NavButton";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        let textPos = {x: this.game.scale.width / 2 - 48, y: this.game.scale.height / 2 - 6}
        let rect = {x: this.game.scale.width/2, y: this.game.scale.height/2, width: 200, height: 50, color: 0xAAAAAA}
        NavButton(this, "Join Lobby", () => this.scene.start('LobbyScene'), textPos, rect)
    }
}