import Phaser from "phaser";
import { SceneKey } from "../config";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import DataManager from "../system/DataManager";

export default class GameModeScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.GameModeScene)
    }

    create() {
        DataManager.getDataManager().setData("navbar", {activeOn: "play"});
        this.events.on("wake", () => {DataManager.getDataManager().setData("navbar", {activeOn: "play"})})

        // Adds Host Game Scene Buttons
        let hostGameButton = new Button(this, "Host Game", 0, 0, "large", () => console.log("Clicked on host game button"));
        let joinWithIDButton = new Button(this, "Join with ID", 0, 0, "large", () => console.log("Clicked on join with id button"));
        let quickPlayButton = new Button(this, "Quick Play", 0, 0, "large", () => console.log("Clicked on quick play button"));
        let joinLobbyButton = new Button(this, "Join Lobby", 0, 0, "large", () => console.log("Clicked on join lobby button"));
        let layout = new Layout(this, 120, this.game.scale.width/2, 200);
        layout.add([hostGameButton, joinWithIDButton, quickPlayButton, joinLobbyButton]);
        this.add.existing(layout);
    }
}