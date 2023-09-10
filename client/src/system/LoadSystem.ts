import { SceneWithRexUI } from "../UI/RexUIBase";
import LoadingScreen from "../UI/gameuis/LoadingScreen";

export default class LoadSystem {

    private scene: SceneWithRexUI;
    private loadingScreen: LoadingScreen;
    private onLoadCallback: Function;
    
    constructor(scene: SceneWithRexUI, onLoad: Function) {
        this.scene = scene;
        this.loadingScreen = new LoadingScreen(this.scene);
        this.onLoadCallback = onLoad;
    }

    

}