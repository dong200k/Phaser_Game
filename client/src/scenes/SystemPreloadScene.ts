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
        this.load.audio("fireball_whoosh", "audio/fireball-whoosh.mp3")
        this.load.audio("explosion_1", "audio/explosion_1.mp3")
        this.load.audio("lightningrod", "audio/lightningrod.mp3")
        this.load.audio("qi_rotation", "audio/qi_rotation.mp3")
        this.load.audio("frost_walk", "audio/frost_walk.mp3")
        this.load.audio("laser_pew", "audio/laser.mp3")
        this.load.audio("wood_chest_open_sfx", "audio/wood_chest_open_sfx.mp3");
        this.load.audio("wave_start", "audio/wave_start.mp3")
        this.load.audio("wave_end", "audio/wave_end.mp3")
        this.load.audio("wave_end_violin", "audio/wave_end_violin.mp3")
        this.load.audio("fountain_heal", "audio/fountain_heal.mp3")
        this.load.audio("monster_death2", "audio/monster_death2.mp3")
        this.load.audio("poison_dash", "audio/poison_dash.mp3")
        this.load.audio("somersault_dash", "audio/somersault_dash.mp3")
        this.load.audio("sword_dash", "audio/sword_dash.mp3")
        this.load.audio("wave_dash", "audio/wave_dash.mp3")
        this.load.audio("frost_dash", "audio/frost_dash.mp3")
        this.load.audio("flame_dash", "audio/flame_dash.mp3")

        // ------- Loading Images ------- //
        this.load.image("demo_hero", "images/demo_hero.png");
        this.load.image("dirt_map_tiles", "tilemaps/demo_map/dirt_dungeon_tileset_extruded.png");
        this.load.image("frost-glaive", "images/projectiles/frost-glaive.png");
        this.load.image("doubow_icon", "images/icons/doubow_icon.png");
        this.load.image("tribow_icon", "images/icons/tribow_icon.png");
        this.load.image("dungeon_core_background", "images/background/DungeonCoreBg.png");
        this.load.image("invisible", "images/projectiles/Invisible.png")
        this.load.image("slow_icon", "images/icons/slow_icon.png");
        this.load.image("upgrade_bg", "images/background/upgrade_bg.png");
        this.load.image("pea_icon", "images/icons/artifacts/pea_icon.png");
        this.load.image("snow_pea_icon", "images/icons/artifacts/snow_pea_icon.png");
        this.load.image("banana_icon", "images/icons/artifacts/banana_icon.png");
        this.load.image("avocado_icon", "images/icons/artifacts/avocado_icon.png");
        this.load.image("broccoli_icon", "images/icons/artifacts/broccoli_icon.png");
        this.load.image("beets_icon", "images/icons/artifacts/beets_icon.png");
        this.load.image("mushroom_icon", "images/icons/artifacts/mushroom_icon.png");
        this.load.image("tomatoes_icon", "images/icons/artifacts/tomatoes_icon.png");
        this.load.image("carrot_icon", "images/icons/artifacts/carrot_icon.png");
        this.load.image("beans_icon", "images/icons/artifacts/beans_icon.png");
        this.load.image("ancient_guard_icon", "images/icons/artifacts/ancient_guard_icon.png");
        this.load.image("perseverance_stone_icon", "images/icons/artifacts/perseverance_stone_icon.png");
        this.load.image("glass_cannon_icon", "images/icons/artifacts/glass_cannon_icon.png");
        this.load.image("amplifier_icon", "images/icons/artifacts/amplifier_icon.png");
        this.load.image("power_of_friendship_icon", "images/icons/artifacts/power_of_friendship_icon.png");
        this.load.image("qi_armor_icon", "images/icons/artifacts/qi_armor_icon.png");
        this.load.image("turbo_skates_icon", "images/icons/artifacts/turbo_skates_icon.png");
        this.load.image("ancient_battery_icon", "images/icons/artifacts/ancient_battery_icon.png");
        this.load.image("fireball_icon", "images/icons/artifacts/fireball_icon.png");
        this.load.image("lightning_rod_icon", "images/icons/artifacts/lightning_rod_icon.png");
        this.load.image("test_tiles", "tilemaps/demo_map/forest_tiles_extruded.png");
        this.load.image("test_tiles2", "tilemaps/demo_map/test_tiles_extruded.png");

        // ------- Loading Animations ------- //    
        this.load.aseprite("TinyZombie", "images/mobs/zombie_1.png", "images/mobs/zombie_1.json");
        this.load.aseprite("Ranger", "images/roles/ranger.png", "images/roles/ranger.json");
        this.load.aseprite("RangerArrow", "images/projectiles/arrow_1.png", "images/projectiles/arrow_1.json");
        this.load.aseprite("TinyZombieAttack", "images/projectiles/bite_1.png", "images/projectiles/bite_1.json");
        this.load.aseprite("Berserker", "images/roles/Berserker.png", "images/roles/Berserker.json");
        this.load.aseprite("Warrior", "images/roles/warrior.png", "images/roles/warrior.json");
        this.load.aseprite("FlameAura", "images/projectiles/FlameAura.png", "images/projectiles/FlameAura.json");
        this.load.aseprite("GetsugaTenshou", "images/projectiles/GetsugaTenshou.png", "images/projectiles/GetsugaTenshou.json");
        this.load.aseprite("Fireball", "images/projectiles/fireball.png", "images/projectiles/fireball.json")
        this.load.aseprite("Lightning", "images/projectiles/Lightning.png", "images/projectiles/Lightning.json")
        this.load.aseprite("QiRotation", "images/projectiles/qi_rotation.png", "images/projectiles/qi_rotation.json")
        this.load.aseprite("upgrade_aicon", "images/icons/upgrade_icon/upgrade_aicon.png", "images/icons/upgrade_icon/upgrade_aicon.json");
        this.load.aseprite("x_aicon", "images/icons/x_icon/x_aicon.png", "images/icons/x_icon/x_aicon.json");
        this.load.aseprite("frost_ground", "images/projectiles/frost.png", "images/projectiles/frost.json");
        this.load.aseprite("crystal", "images/projectiles/crystal.png", "images/projectiles/crystal.json");
        this.load.aseprite("laser", "images/projectiles/laser.png", "images/projectiles/laser.json");
        this.load.aseprite("wood_chest", "animations/wood_chest/wood_chest.png", "animations/wood_chest/wood_chest.json");
        this.load.aseprite("purple_arrow", "images/projectiles/purple_arrow.png", "images/projectiles/purple_arrow.json");
        this.load.aseprite("iron_chest", "animations/iron_chest/iron_chest.png", "animations/iron_chest/iron_chest.json");
        this.load.aseprite("gold_chest", "animations/gold_chest/gold_chest.png", "animations/gold_chest/gold_chest.json");
        this.load.aseprite("summon_circle", "images/projectiles/summon_circle.png", "images/projectiles/summon_circle.json")
        this.load.aseprite("wave_dash", "images/projectiles/wave.png", "images/projectiles/wave.json")
        this.load.aseprite("sword_dash", "images/projectiles/sword_slash.png", "images/projectiles/sword_slash.json")
        this.load.aseprite("somersault_dash", "images/projectiles/Sommersault.png", "images/projectiles/Sommersault.json")
        this.load.aseprite("flame_dash", "images/projectiles/flame.png", "images/projectiles/flame.json")
        this.load.aseprite("poison_dash", "images/projectiles/poison.png", "images/projectiles/poison.json")
        this.load.aseprite("lightning_god", "images/projectiles/lighting_god.png", "images/projectiles/lighting_god.json")
        this.load.aseprite("lightning_bird", "images/projectiles/lightning_bird.png", "images/projectiles/lightning_bird.json")
        this.load.aseprite("lightning_orb", "images/projectiles/lightning_orb.png", "images/projectiles/lightning_orb.json")
        this.load.aseprite("meteor", "images/projectiles/meteor.png", "images/projectiles/meteor.json")
        this.load.aseprite("kamehameha", "images/projectiles/kamehameha.png", "images/projectiles/kamehameha.json")
        this.load.aseprite("flame_thrower", "images/projectiles/flame_thrower.png", "images/projectiles/flame_thrower.json")
        this.load.aseprite("blade_tornado", "images/projectiles/blade_tornado.png", "images/projectiles/blade_tornado.json")
        this.load.aseprite("blade_master_slash", "images/projectiles/swordman_slash.png", "images/projectiles/swordman_slash.json")
        this.load.aseprite("BladeMaster", "images/roles/swordsman.png", "images/roles/swordsman.json");
        this.load.aseprite("Nixi", "images/roles/Sprite-0001.png", "images/roles/Sprite-0001.json");
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
        // All added textures will use nearest neighbor to scale (for pixel art).
        this.textures.on(Phaser.Textures.Events.ADD, (key: string) => {
            this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
        })

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
        soundManager.add("fireball_whoosh", "sfx")
        soundManager.add("explosion_1", "sfx")
        soundManager.add("lightningrod", "sfx")
        soundManager.add("qi_rotation", "sfx")
        soundManager.add("frost_walk", "sfx")
        soundManager.add("laser_pew", "sfx")
        soundManager.add("wood_chest_open_sfx", "sfx");
        soundManager.add("wave_start", "sfx");
        soundManager.add("wave_end", "sfx");
        soundManager.add("wave_end_violin", "sfx");
        soundManager.add("fountain_heal", "sfx");
        soundManager.add("monster_death2", "sfx");
        soundManager.add("frost_dash", "sfx")
        soundManager.add("somersault_dash", "sfx")
        soundManager.add("poison_dash", "sfx")
        soundManager.add("wave_dash", "sfx")
        soundManager.add("flame_dash", "sfx")
        soundManager.add("sword_dash", "sfx")

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