import Phaser from "phaser";
import { SceneKey } from "../config";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import LoadingScreen from "../UI/gameuis/LoadingScreen";

// DEPRECATED Use Loading Screen instead.
export default class LoadingScene extends Phaser.Scene {
    
    rexUI!: UIPlugin;

    constructor() {
        super(SceneKey.LoadingScene)
    }
    
    init() {
        
    }

    create() {
        this.initializeUI();
        this.initializeListeners();
    }

    private initializeUI() {
        let loadingScreen = new LoadingScreen(this);
    }

    private initializeListeners() {
        this.events.on("sleep", () => {
            console.log("Settings Scene Sleep");
        });
        this.events.on("wake", () => {
            console.log("Settings Scene Wake");
        });
    }

}