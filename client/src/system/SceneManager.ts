import Phaser from "phaser";
import { SceneKeyType } from "../config";


export default class SceneManager {

    private static singleton:SceneManager|null;

    private scene: Phaser.Scene;
    private historyStack: SceneKeyType[] = [];
    private currentSceneKey: SceneKeyType | "" = "";

    private constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public static getSceneManager(scene:Phaser.Scene): SceneManager {
        if(this.singleton == null)
            this.singleton = new SceneManager(scene);
        return this.singleton;
    }

    /**
     * Switching to a scene, clears the scene history. If you want to preserve history use pushScene() instead.
     * @param key The scene key
     */
    public switchToScene(key:SceneKeyType) {
        this.historyStack.splice(0, this.historyStack.length);
        this.currentSceneKey = key;
        this.scene.scene.switch(key);
    }

    /**
     * Pushing a scene switches to it and pushes the previous scene onto the history stack.
     * @param key The scene key
     */
    public pushScene(key:SceneKeyType) {
        if(this.currentSceneKey) {
            this.historyStack.push(this.currentSceneKey);
        }
        this.currentSceneKey = key;
        this.scene.scene.switch(key);
    }

    /**
     * Pops a scene from the history stack.
     * @returns the scene key that was popped. "" if there is no scene to pop.
     */
    public popScene():SceneKeyType | ""{
        let key = this.historyStack.pop();
        if(key) {
            this.scene.scene.switch(key);
            return key;
        }
        return "";
    }

    /** Shutdown the current scene, clearing display list, timers, etc. */
    public shutdownCurrentScene() {
        if(this.currentSceneKey)
            this.scene.scene.stop(this.currentSceneKey);
    }

    /** puts the current scene to sleep. */
    private sleepCurrentScene() {
        if(this.currentSceneKey) {
            this.scene.scene.sleep(this.currentSceneKey);
        }
    }

    // wakes the current scene and brings it to the front.
    private wakeCurrentScene() {
        if(this.currentSceneKey) {
            this.scene.scene.run(this.currentSceneKey);
            this.scene.scene.bringToTop(this.currentSceneKey);
        }
    }
}
