import { OverlapSizer, RoundRectangle, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../../config";
import ProgressBar from "../ProgressBar";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";
import UIFactory from "../UIFactory";
import TextBox from "../TextBox";

export default class LoadingScreen extends RexUIBase {

    private progressBar: ProgressBar;
    private background: RoundRectangle;
    private text: TextBox;

    constructor(scene: SceneWithRexUI) {
        super(scene);

        // Creating loading screen container
        let screenSizer = this.rexUI.add.overlapSizer({
            x: scene.game.scale.width / 2,
            y: scene.game.scale.height / 2,
        })
        screenSizer.add(this.background = this.rexUI.add.roundRectangle(0, 0, scene.game.scale.width, scene.game.scale.height, 0, ColorStyle.primary.hex[900]));

        // Creating progress bar and text.
        let progressBarTextSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        this.text = UIFactory.createTextBoxDOM(this.scene, "fefe", "p5");
        this.progressBar = new ProgressBar(scene, {
            progressBarCreateText: true,
            progressBarHeight: 25,
            progressBarWidth: 700,
            progressBarMaxValue: 100,
            progressBarValue: 0,
            progressBarColor: ColorStyle.primary.hex[500],
        });
        progressBarTextSizer.add(this.progressBar);
        progressBarTextSizer.add(this.text);

        screenSizer.add(progressBarTextSizer, {align: "center-bottom", expand: false, padding: {bottom: 50}});
        screenSizer.layout();
    }

    /**
     * Updates the progress bar's value.
     * @param value The value of the progress bar, from 0 to 1.
     */
    public updateProgressBarValue(value: number) {
        if(value <= 0) value = 0;
        if(value >= 1) value = 1; 
        this.progressBar.setProgressBarValue(value * 100);
    }

    /**
     * Updates the text that is displayed alongside the progressbar.
     * @param text The text.
     */
    public updateProgressBarText(text: string) {
        this.text.setText(`Loading ${text}...`);
    }

    public startLoading(): Promise<unknown> {
        let promise = new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
        })
        return promise;
    }
    
}