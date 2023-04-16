import Phaser from "phaser";
import { SceneKey } from "../config";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import DataManager from "../system/DataManager";
import SceneManager from "../system/SceneManager";

export default class GameModeScene extends Phaser.Scene {
    
    constructor() {
        super(SceneKey.GameModeScene)
    }

    create() {
        DataManager.getDataManager().setData("navbar", {activeOn: "play"});
        this.events.on("wake", () => {DataManager.getDataManager().setData("navbar", {activeOn: "play"})})

        // Adds Host Game Scene Buttons
        let joinLobbyButton = new Button(this, "Join Lobby", 0, 0, "large", () => SceneManager.getSceneManager().pushScene("LobbyScene"));
        let quickPlayButton = new Button(this, "Quick Play", 0, 0, "large", () => console.log("Clicked on quick play button"));
        let hostGameButton = new Button(this, "Host Game", 0, 0, "large", () => SceneManager.getSceneManager().pushScene("HostGameScene"));
        let joinWithIDButton = new Button(this, "Join with ID", 0, 0, "large", () => console.log("Clicked on join with id button"));
        
        let layout = new Layout(this, {
            x: this.game.scale.width/2,
            y: this.game.scale.height/2,
            gap: 24,
        });
        layout.add([joinLobbyButton, quickPlayButton, hostGameButton, joinWithIDButton]);
        this.add.existing(layout);
    }
}