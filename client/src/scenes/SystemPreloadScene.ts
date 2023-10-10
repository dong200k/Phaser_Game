import Phaser from "phaser";
import { SceneKey, StartScene } from "../config";
import SceneManager from "../system/SceneManager";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";
import LoadingScreen from "../UI/gameuis/LoadingScreen";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import SoundManager from "../system/SoundManager";
import AssetService from "../services/AssetService";
import AssetManager from "../system/AssetManager";
import LoadSystem from "../system/LoadSystem";

/**
 * The purpose of this Scene is to preload important managers such as the SceneManager. 
 * It has no other gameplay or menu purpose. It also contains the switch to the first scene.
 */
export default class SystemPreloadScene extends Phaser.Scene {
    
    rexUI!: UIPlugin;
    // loadingScreen!: LoadingScreen;
    loadSystem!: LoadSystem;

    constructor() {
        super(SceneKey.SystemPreloadScene);
    }

    /** If you need to load data that is stored locally. Add them here.
     * The preload() method is not used because we want to manually start the loader.
     */
    addLocalData() {
        // ------- Loading UI -------- //
        this.load.image("button_small_active", "images/button/button_small_active.png");
        this.load.image("button_small_deactive", "images/button/button_small_deactive.png");
        this.load.image("button_small_default", "images/button/button_small_default.png");
        this.load.image("button_small_default_hover_texture", "images/button/button_small_default_hover_texture.png");
        // this.load.image("SplashScreenImage", "images/background/DungeonCoreBg.png");

        // ------- Loading Audio ------- //
        this.load.audio("button_click1", "audio/button_click1.mp3");
        this.load.audio("hit", "audio/hit.mp3");
        this.load.audio("player_death", "audio/player_death.mp3");
        this.load.audio("monster_death", "audio/monster_death.mp3");
        this.load.audio("level_up", "audio/level_up.mp3");
        this.load.audio("shoot_arrow", "audio/shoot_arrow.mp3");
        this.load.audio("ultra_instinct", "audio/ultrainstinct.mp3")
        this.load.audio("magic_slash", "audio/magic_slash.mp3")
        this.load.audio("sword_schwing", "audio/sword_schwing.mp3")
        this.load.audio("flame_slash", "audio/flame_slash.mp3")
        this.load.audio("sword_swish", "audio/sword_swish.mp3")
        this.load.audio("clean_fast_slash", "audio/clean_fast_slash.mp3")
        this.load.audio("small_explosion", "audio/small_explosion.mp3")
        this.load.audio("roll", "audio/roll.mp3")
        this.load.audio("ultra_instinct_boss", "audio/ultra_instinct_boss.mp3")
        this.load.audio("boss_getting_dark", "audio/boss_getting_dark.mp3")
        this.load.audio("warrior_slam_sfx", "audio/warrior_slam_sfx.mp3");

        // ------- Loading Images ------- //
        this.load.image("demo_hero", "images/demo_hero.png");
        this.load.image("dirt_map_tiles", "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png");
        this.load.image("frost-glaive", "images/projectiles/frost-glaive.png");
        this.load.image("doubow_icon", "images/icons/doubow_icon.png");
        this.load.image("tribow_icon", "images/icons/tribow_icon.png");
        this.load.image("dungeon_core_background", "images/background/DungeonCoreBg.png");
        this.load.image("invisible", "images/projectiles/Invisible.png")

        // ------- Loading Animations ------- //
        this.load.aseprite("TinyZombie", "images/mobs/zombie_1.png", "images/mobs/zombie_1.json");
        this.load.aseprite("Ranger", "images/roles/ranger.png", "images/roles/ranger.json");
        this.load.aseprite("RangerArrow", "images/projectiles/arrow_1.png", "images/projectiles/arrow_1.json");
        this.load.aseprite("TinyZombieAttack", "images/projectiles/bite_1.png", "images/projectiles/bite_1.json");
        this.load.aseprite("Berserker", "images/roles/Berserker.png", "images/roles/Berserker.json");
        this.load.aseprite("Warrior", "images/roles/warrior.png", "images/roles/warrior.json");
        this.load.aseprite("FlameAura", "images/projectiles/FlameAura.png", "images/projectiles/FlameAura.json");
        this.load.aseprite("GetsugaTenshou", "images/projectiles/GetsugaTenshou.png", "images/projectiles/GetsugaTenshou.json");

    }

    /** Load the assets from firebase. */
    async addOnlineAssets() {
        // Put the asset you want to load here.
        let assets = [
            "SplashScreenImage",
        ]
        await AssetManager.putAssetsInLoad(this, assets);
    }

    create() {
        // Adds local assets to the phaser loader.
        this.addLocalData();
        
        // --------- Create Load System ----------
        this.loadSystem = new LoadSystem(this);
        // Create load item for grabbing online asset documents.
        this.loadSystem.addLoadItem({
            name: "Grabbing Assets...",
            loadFunction: () => this.addOnlineAssets(),
        })
        // Create load item for running the phaser loader.
        this.loadSystem.addLoadItemPhaserLoader(this, "Loading Assets...");
        this.loadSystem.startLoad().then(() => {
            this.afterLoad();
        })
    }

    afterLoad() {
        /** Initialize the SoundManager. */
        let soundManager = SoundManager.getManager();
        soundManager.setScene(this);
        soundManager.add("button_click1", "sfx");
        soundManager.add("hit", "sfx");
        soundManager.add("player_death", "sfx");
        soundManager.add("monster_death", "sfx");
        soundManager.add("level_up", "sfx");
        soundManager.add("shoot_arrow", "sfx");
        soundManager.add("magic_slash", "sfx")
        soundManager.add("sword_schwing", "sfx")
        soundManager.add("flame_slash", "sfx")
        soundManager.add("sword_swish", "sfx")
        soundManager.add("clean_fast_slash", "sfx")
        soundManager.add("small_explosion", "sfx")
        soundManager.add("roll", "sfx")
        soundManager.add("warrior_slam_sfx", "sfx");

        soundManager.add("ultra_instinct", "bg")
        soundManager.add("ultra_instinct_boss", "bg")
        soundManager.add("boss_getting_dark", "bg")

        /** Initialize the SceneManager and sets this scene as the current scene. */
        let sceneManager = SceneManager.getSceneManager();
        sceneManager.setScene(this);
        sceneManager.switchToScene("SystemPreloadScene"); // Lets the SceneManager know the current scene.

        let idToken = ClientFirebaseConnection.getConnection().idToken
        if(idToken){
            // User already logged in
            sceneManager.switchToScene(StartScene);
        } else{
            sceneManager.switchToScene(SceneKey.LoginScene)
        }
    }

}