import Phaser from "phaser";
import { SceneKey, StartScene } from "../config";
import SceneManager from "../system/SceneManager";
import LoadingScreen from "../UI/gameuis/LoadingScreen";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import SoundManager from "../system/SoundManager";

/**
 * The purpose of this Scene is to preload important managers such as the SceneManager. 
 * It has no other gameplay or menu purpose. It also contains the switch to the first scene.
 */
export default class SystemPreloadScene extends Phaser.Scene {
    
    rexUI!: UIPlugin;
    loadingScreen!: LoadingScreen;

    constructor() {
        super(SceneKey.SystemPreloadScene);
    }

    preload() {

        // Show loading screen
        this.loadingScreen = new LoadingScreen(this);

        // ------- Loading UI -------- //
        this.load.image("button_small_active", "images/button/button_small_active.png");
        this.load.image("button_small_deactive", "images/button/button_small_deactive.png");
        this.load.image("button_small_default", "images/button/button_small_default.png");
        this.load.image("button_small_default_hover_texture", "images/button/button_small_default_hover_texture.png");
    
        // ------- Loading Audio ------- //
        this.load.audio("button_click1", "audio/button_click1.mp3");
        this.load.audio("hit", "audio/hit.mp3");
        this.load.audio("player_death", "audio/player_death.mp3");
        this.load.audio("monster_death", "audio/monster_death.mp3");
        this.load.audio("level_up", "audio/level_up.mp3");
        this.load.audio("shoot_arrow", "audio/shoot_arrow.mp3");

        // ------- Loading Images ------- //
        this.load.image("demo_hero", "images/demo_hero.png");
        this.load.image("dirt_map_tiles", "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png");
        this.load.image("frost-glaive", "images/projectiles/frost-glaive.png");
        this.load.image("doubow_icon", "images/icons/doubow_icon.png");
        this.load.image("tribow_icon", "images/icons/tribow_icon.png");

        // ------- Loading Animations ------- //
        this.load.aseprite("TinyZombie", "images/mobs/zombie_1.png", "images/mobs/zombie_1.json");
        this.load.aseprite("Ranger", "images/roles/ranger.png", "images/roles/ranger.json");
        this.load.aseprite("RangerArrow", "images/projectiles/arrow_1.png", "images/projectiles/arrow_1.json");
        this.load.aseprite("TinyZombieAttack", "images/projectiles/bite_1.png", "images/projectiles/bite_1.json");


        this.load.on("progress", (value: number) => {
            // console.log(value);
            this.loadingScreen.updateProgressBarValue(value);
        })

        this.load.on("fileprogress", (file: Phaser.Loader.File) => {
            // console.log(file.src);
            this.loadingScreen.updateProgressBarText(file.src);
        })

        this.load.on("complete", () => {
            // console.log("oncomplete");
        })
    }

    create() {
        // await this.loadingScreen.startLoading();

        /** Initialize the SoundManager. */
        let soundManager = SoundManager.getManager();
        soundManager.setScene(this);
        soundManager.add("button_click1", "sfx");
        soundManager.add("hit", "sfx");
        soundManager.add("player_death", "sfx");
        soundManager.add("monster_death", "sfx");
        soundManager.add("level_up", "sfx");
        soundManager.add("shoot_arrow", "sfx");

        /** Initialize the SceneManager and sets this scene as the current scene. */
        let sceneManager = SceneManager.getSceneManager();
        sceneManager.setScene(this);
        sceneManager.switchToScene("SystemPreloadScene"); // Lets the SceneManager know the current scene.
        sceneManager.switchToScene(StartScene);
    }

}