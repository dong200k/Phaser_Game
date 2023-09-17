import { SceneWithRexUI } from "../UI/RexUIBase";
import LoadingScreen from "../UI/gameuis/LoadingScreen";

interface LoadItem {
    name: string;
    loadFunction: () => Promise<unknown>;
}

/**
 * This class will handle displaying a loading screen when loading and running the Phaser Loader.
 */
export default class LoadSystem {

    private scene: SceneWithRexUI;
    private loadItems: LoadItem[];
    
    constructor(scene: SceneWithRexUI) {
        this.scene = scene;
        this.loadItems = [];
    }

    /** Starts the loading process and displays the loading screen.
     * Doing so will reset the main camera. All load items added previously will be loaded.
     * - Note: Calling startLoad multiple times before one is finished may cause errors.
     * @returns A promise that resolves when the loading is finished.
     */
    public async startLoad() {
        this.resetCamera(this.scene);
        let loadingScreen = new LoadingScreen(this.scene);
        loadingScreen.setVisible(true);

        // Copy all the loadItems to new variable and clear loadItems. 
        // Any loadItems added during load will not be considered. 
        let allLoadItems = [...this.loadItems];
        this.loadItems.splice(0, this.loadItems.length);

        // Loads each of the loadItems one by one, updating the loadingScreen in the process.
        let totalLoadItems = allLoadItems.length;
        while(allLoadItems.length > 0) {
            let loadItem = allLoadItems.shift();
            if(loadItem) {
                loadingScreen.updateProgressBarText(loadItem.name);
                // When all items are loaded, percenatge should be below 100%. Then load complete will make it 100%.
                let percentage = Math.min(1 - ((allLoadItems.length + 1) / (totalLoadItems + 1)), 0.99) * 100;
                loadingScreen.updateProgressBarValue(Math.round(percentage) / 100);
                // Tries to load the load item. If it fails perform load system clean up and throw an error.
                try {
                    await loadItem.loadFunction();
                } catch(e: any) {
                    // Load error.
                    loadingScreen.updateProgressBarText("Loading Error!");
                    await loadingScreen.waitFor(500);
                    loadingScreen.destroy(0);
                    throw e;
                }
            }
        }
        // Load complete.
        loadingScreen.updateProgressBarText("Loading Complete!");
        loadingScreen.updateProgressBarValue(1);
        await loadingScreen.waitFor(500);
        loadingScreen.destroy(200);
    }

    /**
     * Adds a loadItem to this loader. When the loader starts it will run all the 
     * loadItems. LoadItems should be readded after every loader start. 
     * - Note: all loadFunction should be an arrow function to avoid context problems.
     * - Note: any load items added after load start will not be loaded.
     * @param loadItem The load item.
     */
    public addLoadItem(loadItem: LoadItem) {
        this.loadItems.push(loadItem);
    }

    /**
     * Adds the phaser loader to this loader. This will start the phaser loader durning the 
     * loading process.
     * @param scene The phaser scene.
     * @param loadText The text to display when loading this item.
     */
    public addLoadItemPhaserLoader(scene: Phaser.Scene, loadText?: string) {
        this.addLoadItem({
            name: loadText ?? "Loading Assets...",
            loadFunction: () => new SceneLoader(scene).startLoad()
        });
    }

    /**
     * Adds an load item to this loader that completes when a condition is satisfied.
     * @param loadText The text to display when loading this item.
     * @param checkFunction An arrow function that is called every checkInterval time. This function
     * should return true to complete this loadItem, false otherwise.
     * @param checkInterval The interval to call checkFunction in ms. Default 500ms.
     * @param checkTimeout The time before rejecting with an error in ms. This is 
     * used as a fall back in case the checkFunction() never returns true. Default 60000ms.
     */
    public addLoadItemWithCheck(loadText: string, checkFunction: ()=>boolean, checkInterval=200, checkTimeout=60000) {
        this.addLoadItem({
            name: loadText,
            loadFunction: () => { 
                return new Promise<void>((resolve, reject) => {
                    const intervalIdx = setInterval(() => {
                        // Periodically checks if we can proceed to resolve().
                        if(checkFunction()) {
                            clearInterval(intervalIdx);
                            resolve();
                        }
                    }, checkInterval);
                    // When the maximum wait time is reached perform cleanup and reject().
                    setTimeout(() => {
                        clearInterval(intervalIdx);
                        reject(new Error(`Error. Failed to load: ${loadText}`));
                    }, checkTimeout);
                })
            }
        })
    }

    /** Reset the camera of the given scene. */
    private resetCamera(scene: Phaser.Scene) {
        scene.cameras.main.setZoom(1);
        scene.cameras.main.stopFollow();
        scene.cameras.main.setScroll(0, 0);
    }
}

class SceneLoader {
    private loadComplete: boolean = false;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Starts the phaser loader.
     * @returns A promise that resolves when the load is completed.
     * @throws Error when a file fails to load.
     */
    public async startLoad() {
        // Once the loader completes set the loadComplete flag to true.
        this.scene.load.once("complete", () => {
            this.loadComplete = true;
        })
        // Throws an error when a file fails to load.
        this.scene.load.once("loaderror", (file: Phaser.Loader.File) => {
            throw new Error("File failed to load: " + file.key);
        })
        // Starts the loader.
        this.scene.load.start();

        // Waits for the load to finish.
        await new Promise<void>((resolve, reject) => {
            const intervalIdx = setInterval(() => {
                // Periodically checks the loadCompleteFlag.
                if(this.loadComplete === true) {
                    clearInterval(intervalIdx);
                    resolve();
                }
            }, 500)
        })
    }
}