import Phaser from "phaser";
import { SceneKey, SceneKeyType } from "../config";


export default class SceneManager {

    private static singleton:SceneManager|null;

    private scene: Phaser.Scene | null;
    private historyStack: SceneKeyType[] = [];
    private currentSceneKey: SceneKeyType | "" = "MenuScene";

    private constructor() {
        this.scene = null;
    }

    /**
     * Gets the SceneManager singleton.
     * @param scene the game scene. Note: this is only for initializing the SceneManager for this first time.
     * @returns 
     */
    public static getSceneManager(): SceneManager {
        if(this.singleton == null) {
            this.singleton = new SceneManager();
        }
        return this.singleton;    
    }

    /**
     * Sets the scene for the scene manager. This is necessary for switching scenes.
     * @param scene 
     */
    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Switching to a scene, clears the scene history. If you want to preserve history use pushScene() instead.
     * @param key The scene key
     */
    public switchToScene(key:SceneKeyType) {
        if(this.scene) {
            this.historyStack.splice(0, this.historyStack.length);
            if(this.currentSceneKey) {
                this.sleepCurrentScene();
            }
            this.currentSceneKey = key;
            this.runCurrentScene();
            this.showNavbarOnCertainScene(key);
        }
    }

    /**
     * Pushing a scene switches to it and pushes the previous scene onto the history stack.
     * @param key The scene key
     */
    public pushScene(key:SceneKeyType) {
        if(this.scene) {
            if(this.currentSceneKey) {
                this.historyStack.push(this.currentSceneKey);
                this.sleepCurrentScene()
            }
            this.currentSceneKey = key;
            this.runCurrentScene();
            this.showNavbarOnCertainScene(key);
            // console.log(this.scene.scene.manager.getScenes());
        }
    }

    /**
     * Pops a scene from the history stack.
     * @returns the scene key that was popped. "" if there is no scene to pop.
     */
    public popScene():SceneKeyType | "" {
        if(this.scene) {
            let key = this.historyStack.pop();
            if(key) {
                if(this.currentSceneKey) {
                    this.sleepCurrentScene();
                }
                this.currentSceneKey = key;
                this.runCurrentScene();
                this.showNavbarOnCertainScene(key);
                return key;
            }
        }
        return "";
    }

    private showNavbarOnCertainScene(key: SceneKeyType) {
        let navbarScenes = [SceneKey.MenuScene, SceneKey.ControlsScene, SceneKey.CreditsScene, SceneKey.SettingsScene, SceneKey.GameModeScene, 
            SceneKey.ShopScene, SceneKey.SkillTreeScene, SceneKey.RoleScene, SceneKey.HostGameScene, SceneKey.JoinWithIDScene,
            SceneKey.MatchmakeScene]
        let navbarShown = false;
        navbarScenes.forEach((sceneKey) => {
            if(sceneKey === key) {
                navbarShown = true;
                this.showNavbar();
            }
        })
        if(navbarShown === false) {
            //this.scene?.scene.setVisible(false, SceneKey.NavbarScene);
            this.hideNavbar();
        }
    }

    /** Displays the navbar on top of the current scene. This is called automatically on certain scenes. */
    public showNavbar() {
        if(this.scene) {
            this.scene.scene.run(SceneKey.NavbarScene);
            this.scene.scene.bringToTop(SceneKey.NavbarScene);
        }
    }

    /** Shutsdown the navbar. */
    public hideNavbar() {
        if(this.scene) {
            this.scene.scene.sleep(SceneKey.NavbarScene);
        }
    }

    /** Shutdown the current scene, clearing display list, timers, etc. */
    public shutdownCurrentScene() {
        if(this.scene) 
            if(this.currentSceneKey)
                this.scene.scene.stop(this.currentSceneKey);
    }

    /** puts the current scene to sleep. */
    private sleepCurrentScene() {
        if(this.scene) {
            if(this.currentSceneKey) {
                this.scene.scene.sleep(this.currentSceneKey);
            }
        }
    }

    // wakes the current scene and brings it to the front.
    private runCurrentScene() {
        if(this.scene) {
            if(this.currentSceneKey) {
                this.scene.scene.run(this.currentSceneKey);
            }
        }
    }
}
