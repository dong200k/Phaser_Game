import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../../config";
import ProgressBar from "../ProgressBar";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";

export default class LoadingScreen extends RexUIBase {

    private progressBar: ProgressBar;

    constructor(scene: SceneWithRexUI) {
        super(scene);
        

        let screenSizer = new Sizer(scene, {
            orientation: "horizontal",
        })
        screenSizer.add(this.rexUI.add.roundRectangle(0, 0, scene.game.scale.width, scene.game.scale.height, 0, ColorStyle.primary.hex[100]));

        this.progressBar = new ProgressBar(scene, {
            progressBarCreateText: true,
            progressBarHeight: 100,
            progressBarWidth: 900,
            progressBarMaxValue: 100,
            progressBarValue: 0,
            progressBarColor: ColorStyle.primary.hex[500],
        });

        screenSizer.add(this.progressBar, {align: "center-center"});
    }
    
}