import { OverlapSizer, RoundRectangle, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../config";
import UIFactory from "./UIFactory";
import TextBox from "./TextBox";
import TextBoxPhaser from "./TextBoxPhaser";

export interface ProgressBarConfig extends Sizer.IConfig {
    progressBarColor?: number;
    progressBarWidth?: number;
    progressBarHeight?: number;
    progressBarMaxValue?: number;
    progressBarValue?: number;
    progressBarCreateText?: boolean;
    progressBarPhaserText?: boolean;
}

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export default class ProgressBar extends Sizer {

    rexUI: UIPlugins;
    protected text?: TextBox;
    protected textPhaser?: TextBoxPhaser;
    protected progressBar: Phaser.GameObjects.Rectangle;

    protected progressBarColor: number;
    protected progressBarWidth: number;
    protected progressBarHeight: number;
    protected progressBarValue: number;
    protected progressBarMaxValue: number;
    protected progressBarTextVisible: boolean;
    protected overlapSizer: OverlapSizer;


    constructor(scene: SceneWithRexUI, config?: ProgressBarConfig) {
        super(scene, config);
        this.rexUI = scene.rexUI;
        this.progressBarColor = config?.progressBarColor ?? 0x832F2F; //red
        this.progressBarWidth = config?.progressBarWidth ?? 100;
        this.progressBarHeight = config?.progressBarHeight ?? 20;
        this.progressBarMaxValue = config?.progressBarMaxValue ?? 100;
        this.progressBarValue = config?.progressBarValue ?? 10;
        this.progressBarTextVisible = config?.progressBarCreateText ?? true;
        
        //this.scene.add.existing(this.graphic);
        let overlapSizer = this.rexUI.add.overlapSizer({});
        overlapSizer.add(this.rexUI.add.roundRectangle(0, 0, this.progressBarWidth, this.progressBarHeight, 0, ColorStyle.neutrals.hex[900]));
        this.progressBar = this.scene.add.rectangle(0, 0, (this.progressBarValue / this.progressBarMaxValue) * this.progressBarWidth, this.progressBarHeight,this.progressBarColor).setOrigin(0, 0.5);
        overlapSizer.add(this.progressBar, {expand: false, align:"left"});
        overlapSizer.add(this.rexUI.add.roundRectangle(0, 0, this.progressBarWidth, this.progressBarHeight, 0, 0x0, 0).setStrokeStyle(1, ColorStyle.primary.hex[900]))
        
        if(config?.progressBarCreateText ?? true) {
            if(config?.progressBarPhaserText ?? false) {
                this.textPhaser = UIFactory.createTextBoxPhaser(scene, `${this.progressBarValue}/${this.progressBarMaxValue}`, "l6")
                overlapSizer.add(this.textPhaser, {expand: false});
            } else {
                this.text = UIFactory.createTextBoxDOM(scene, `${this.progressBarValue}/${this.progressBarMaxValue}`, "l6")
                overlapSizer.add(this.text, {expand: false});
            }
        }
       
        this.overlapSizer = overlapSizer
        this.add(overlapSizer);

        this.updateProgressBar();
    }

    public setProgressBarTextVisible(visible: boolean) {
        this.text?.setVisible(visible);
        this.textPhaser?.setVisible(visible);
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
        this.progressBar.setSize(Math.min(Math.max((this.progressBarValue / this.progressBarMaxValue) * this.progressBarWidth, 0), this.progressBarWidth), this.progressBarHeight);
        this.text?.setText(`${this.progressBarValue}/${this.progressBarMaxValue}`);
        this.textPhaser?.setText(`${this.progressBarValue}/${this.progressBarMaxValue}`);
    }
}
