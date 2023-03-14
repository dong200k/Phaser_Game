import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        let lobbyButton = this.add.rectangle(this.game.scale.width / 2, this.game.scale.height / 2, 200, 50, 0xAAAAAA);
        this.add.text(this.game.scale.width / 2 - 48, this.game.scale.height / 2 - 6, "Join Lobby");
        lobbyButton.setInteractive();
        lobbyButton.on(Phaser.Input.Events.POINTER_UP, () => {
            this.scene.switch('LobbyScene');
        }, this);
    }
}