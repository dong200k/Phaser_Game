import Phaser from "phaser";
import { SceneKey, SceneKeyType } from "../config";
import EventManager from "./EventManager";


export default class SceneManager {

    private static singleton: SceneManager = new SceneManager();

    private scene: Phaser.Scene | null = null;
    private historyStack: SceneKeyType[] = [];
    private currentSceneKey: SceneKeyType | "" = "";

    private constructor() {}

    /**
     * Gets the SceneManager singleton.
     * @param scene the game scene. Note: this is only for initializing the SceneManager for this first time.
     * @returns 
     */
    public static getSceneManager(): SceneManager {
        return this.singleton;    
    }

    /**
     * Sets the scene for the scene manager. This is necessary for switching scenes. This should be called by the first scene that has been created.
     * @param scene 
     */
    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
        if(this.scene) {
            this.scene.scene.bringToTop(SceneKey.NavbarScene);
            //this.scene.scene.bringToTop(SceneKey.LoadingScene);
        }
    }

    /**
     * Switching to a scene, clears the scene history. If you want to preserve history use pushScene() instead.
     * @param key The scene key
     */
    public switchToScene(key:SceneKeyType) {
        if(this.scene) {
            if(this.currentSceneKey !== key) {
                this.historyStack.splice(0, this.historyStack.length);
                this.switchToSceneHelper(key);
            }
        } else {
            console.log("Error: phaser scene does not exist in SceneManager");
        }
    }

    /**
     * Pushing a scene switches to it and pushes the previous scene onto the history stack.
     * @param key The scene key
     */
    public pushScene(key:SceneKeyType) {
        if(this.scene && this.currentSceneKey !== key) {
            if(this.currentSceneKey !== key) {
                if(this.currentSceneKey) {
                    this.historyStack.push(this.currentSceneKey);
                }
                this.switchToSceneHelper(key);
            }
        } else {
            console.log("Error: phaser scene does not exist in SceneManager");
        }
    }

    /**
     * Pops a scene from the history stack.
     * @returns the scene key that was popped. "" if there is no scene to pop.
     */
    public popScene():SceneKeyType | "" {
        if(this.scene) {
            let key = this.historyStack.pop();
            if(key && this.currentSceneKey !== key) {
                this.switchToSceneHelper(key);
                return key;
            }
        } else {
            console.log("Error: phaser scene does not exist in SceneManager");
        }
        return "";
    }

    /**
     * Main logic for switching to a new scene. 
     * @param key The scene key.
     */
    private switchToSceneHelper(key: SceneKeyType) {
        if(this.currentSceneKey) {
            this.sleepCurrentScene();
        }
        this.currentSceneKey = key;
        this.launchOrWakeCurrentScene();
        this.showNavbarOnCertainScene(key);
    }

    private showNavbarOnCertainScene(key: SceneKeyType) {
        let navbarScenes = [SceneKey.MenuScene, SceneKey.ControlsScene, SceneKey.CreditsScene, SceneKey.SettingsScene, SceneKey.GameModeScene, 
            SceneKey.ShopScene, SceneKey.SkillTreeScene, SceneKey.RoleScene, SceneKey.HostGameScene, SceneKey.JoinWithIDScene,
            SceneKey.MatchmakeScene, SceneKey.LobbyScene]
        let navbarShown = false;
        navbarScenes.forEach((sceneKey) => {
            if(sceneKey === key) {
                navbarShown = true;
                this.showNavbar();
            }
        })
        if(navbarShown === false) {
            this.hideNavbar();
        }
    }

    /** Displays the navbar on top of the current scene. This is called automatically on certain scenes. */
    public showNavbar() {
        if(this.scene) {
            if(!this.scene.scene.isSleeping(SceneKey.NavbarScene) && !this.scene.scene.isActive(SceneKey.NavbarScene))
                this.scene.scene.launch(SceneKey.NavbarScene);
            else {
                this.scene.scene.wake(SceneKey.NavbarScene);
            }
            //this.scene.scene.bringToTop(SceneKey.NavbarScene);
        }
    }

    /** Shutsdown the navbar. */
    public hideNavbar() {
        if(this.scene && !this.scene.scene.isSleeping(SceneKey.NavbarScene) && this.scene.scene.isActive(SceneKey.NavbarScene)) {
            this.scene.scene.sleep(SceneKey.NavbarScene);
        }
    }

    // /** Shows the loading screen. */
    // public showLoadingScene() {
    //     if(this.scene) {
    //         if(!this.scene.scene.isSleeping(SceneKey.LoadingScene) && !this.scene.scene.isActive(SceneKey.LoadingScene))
    //             this.scene.scene.launch(SceneKey.LoadingScene);
    //         else {
    //             this.scene.scene.wake(SceneKey.LoadingScene);
    //         }
    //         //this.scene.scene.bringToTop(SceneKey.LoadingScene);
    //     }
    // }

    // /** Hides the loading screen. */
    // public hideLoadingScene() {
    //     if(this.scene && !this.scene.scene.isSleeping(SceneKey.LoadingScene) && this.scene.scene.isActive(SceneKey.LoadingScene)) {
    //         this.scene.scene.sleep(SceneKey.LoadingScene);
    //     }
    // }

    /** Displays the HUD */
    public showHUD() {
        if(this.scene) {
            if(!this.scene.scene.isSleeping(SceneKey.HUDScene) && !this.scene.scene.isActive(SceneKey.HUDScene))
                this.scene.scene.launch(SceneKey.HUDScene);
            else 
                this.scene.scene.wake(SceneKey.HUDScene);
            this.scene.scene.bringToTop(SceneKey.HUDScene);
        }
    }

    /** Hides the HUD */
    public hideHUD() {
        if(this.scene) this.scene.scene.sleep(SceneKey.HUDScene);
    }

    /** Shutdown the current scene, clearing display list, timers, etc. */
    public shutdownCurrentScene() {
        if(this.scene && this.currentSceneKey) 
            this.scene.scene.stop(this.currentSceneKey);
    }

    /** puts the current scene to sleep. */
    private sleepCurrentScene() {
        if(this.scene && this.currentSceneKey)
            this.scene.scene.sleep(this.currentSceneKey);
    }

    /** Runs the current scene */
    private launchCurrentScene() {
        if(this.scene && this.currentSceneKey)
            this.scene.scene.launch(this.currentSceneKey);
    }

    /** wakes the current scene */ 
    private wakeCurrentScene() {
        if(this.scene && this.currentSceneKey)
            this.scene.scene.wake(this.currentSceneKey);
    }

    private launchOrWakeCurrentScene() {
        if(this.scene) {
            if(!this.scene.scene.isSleeping(this.currentSceneKey) && !this.scene.scene.isActive(this.currentSceneKey))
                this.launchCurrentScene();
            else
                this.wakeCurrentScene();
            // ----- Set the input to poll on the scene on first wake to prevent button unhovers from not registering. Note: This can have performance impacts. ------
            this.scene.scene.get(this.currentSceneKey).input.setPollAlways();
            setTimeout(() => {this.scene?.scene.get(this.currentSceneKey).input.setPollOnMove()}, 100);
        }
    }

    public getCurrentScene(){
        return this.currentSceneKey
    }
}
