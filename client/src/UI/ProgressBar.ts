import { RoundRectangle, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../config";
import UIFactory from "./UIFactory";
import TextBox from "./TextBox";

export interface ProgressBarConfig extends Sizer.IConfig {
    progressBarColor?: number;
    progressBarWidth?: number;
    progressBarHeight?: number;
    progressBarMaxValue?: number;
    progressBarValue?: number;
    progressBarTextVisible?: boolean;
}

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export default class ProgressBar extends Sizer {

    rexUI: UIPlugins;
    private text: TextBox;
    private progressBar: Phaser.GameObjects.Rectangle;

    private progressBarColor: number;
    private progressBarWidth: number;
    private progressBarHeight: number;
    private progressBarValue: number;
    private progressBarMaxValue: number;
    private progressBarTextVisible: boolean;


    constructor(scene: SceneWithRexUI, config?: ProgressBarConfig) {
        super(scene, config);
        this.rexUI = scene.rexUI;
        this.progressBarColor = config?.progressBarColor ?? 0x832F2F; //red
        this.progressBarWidth = config?.progressBarWidth ?? 100;
        this.progressBarHeight = config?.progressBarHeight ?? 20;
        this.progressBarMaxValue = config?.progressBarMaxValue ?? 100;
        this.progressBarValue = config?.progressBarValue ?? 10;
        this.progressBarTextVisible = config?.progressBarTextVisible ?? true;
        
        //this.scene.add.existing(this.graphic);
        let overlapSizer = this.rexUI.add.overlapSizer({});
        overlapSizer.add(this.rexUI.add.roundRectangle(0, 0, this.progressBarWidth, this.progressBarHeight, 0, ColorStyle.neutrals.hex[900]));
        this.progressBar = this.scene.add.rectangle(0, 0, (this.progressBarValue / this.progressBarMaxValue) * this.progressBarWidth, this.progressBarHeight,this.progressBarColor).setOrigin(0, 0.5);
        overlapSizer.add(this.progressBar, {expand: false, align:"left"});
        overlapSizer.add(this.rexUI.add.roundRectangle(0, 0, this.progressBarWidth, this.progressBarHeight, 0, 0x0, 0).setStrokeStyle(1, ColorStyle.primary.hex[900]))
        this.text = UIFactory.createTextBoxDOM(scene, `${this.progressBarValue}/${this.progressBarMaxValue}`, "l6")

        overlapSizer.add(this.text);
        this.add(overlapSizer);

        this.updateProgressBar();
    }

    public setProgressBarTextVisible(visible: boolean) {
        this.text.setVisible(visible);
    }

    public setProgressBarValue(value: number) {
        this.progressBarValue = value;
        this.updateProgressBar();
    }

    public setProgressBarMaxValue(value: number) {
        this.progressBarMaxValue = value;
        this.updateProgressBar();
    }

    public updateProgressBar() {
        this.setProgressBarTextVisible(this.progressBarTextVisible);
        this.progressBar.setSize((this.progressBarValue / this.progressBarMaxValue) * this.progressBarWidth, this.progressBarHeight);
        this.text.setText(`${this.progressBarValue}/${this.progressBarMaxValue}`);
    }
}
