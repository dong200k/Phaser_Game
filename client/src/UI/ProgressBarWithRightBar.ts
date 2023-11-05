import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import ProgressBar from "./ProgressBar";
import TextBoxPhaser from "./TextBoxPhaser";
import UIFactory from "./UIFactory";
import TextBox from "./TextBox";

export interface ProgressBarWithRightBarConfig extends Sizer.IConfig {
    progressBarColor?: number;
    progressBarWidth?: number;
    progressBarHeight?: number;
    progressBarMaxValue?: number;
    progressBarValue?: number;
    progressBarCreateText?: boolean;
    progressBarPhaserText?: boolean;
    rightBarValue?: number;
    rightBarColor?: number;
}

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export default class ProgressBarWithRightBar extends ProgressBar {

    rexUI: UIPlugins;
    rightBar: Phaser.GameObjects.Rectangle;
    rightBarValue: number;
    rightBarColor: number;
    rightBarTextPhaser?: TextBoxPhaser;
    rightBarText?: TextBox

    constructor(scene: SceneWithRexUI, config?: ProgressBarWithRightBarConfig) {
        super(scene, config);
        this.rexUI = scene.rexUI;

        this.rightBarValue = config?.rightBarValue ?? 0
        this.rightBarColor = config?.rightBarColor ?? 0xDC8223

        // Add extra bar aligned to the right. 
        let ratio = (this.rightBarValue/this.progressBarMaxValue)
        let width = ratio > 1? this.progressBarWidth : ratio * this.progressBarWidth
        this.rightBar = this.scene.add.rectangle(0, 0,  width, this.progressBarHeight, this.rightBarColor).setOrigin(0, 0.5);
        this.overlapSizer.add(this.rightBar, {expand: false, align:"left"});

        // Add text for the right bar
        if(config?.progressBarCreateText ?? true) {
            if(config?.progressBarPhaserText ?? false) {
                this.rightBarTextPhaser = UIFactory.createTextBoxPhaser(scene, `Shield: ${this.rightBarValue}`, "l6")
                this.overlapSizer.add(this.rightBarTextPhaser, {expand: false});
            } else {
                this.rightBarText = UIFactory.createTextBoxDOM(scene, `Shield: ${this.rightBarValue}`, "l6")
                this.overlapSizer.add(this.rightBarText, {expand: false});
            }
        }

        this.updateProgressBar();
    }
    
    public setRightBarValue(value: number){
        this.rightBarValue = value
        this.updateProgressBar()
    }

    public setRightBarTextVisible(visible: boolean) {
        this.rightBarTextPhaser?.setVisible(visible);
        this.rightBarText?.setVisible(visible);
    }

    public updateProgressBar() {
        let rightBarTextVisible = this.rightBarValue > 0

        this.setProgressBarTextVisible(this.progressBarTextVisible && !rightBarTextVisible);
        this.progressBar.setSize(Math.min(Math.max((this.progressBarValue / this.progressBarMaxValue) * this.progressBarWidth, 0), this.progressBarWidth), this.progressBarHeight);
        this.text?.setText(`${this.progressBarValue}/${this.progressBarMaxValue}`);
        this.textPhaser?.setText(`${this.progressBarValue}/${this.progressBarMaxValue}`);

        this.setRightBarTextVisible(rightBarTextVisible)
        let ratio = (this.rightBarValue/this.progressBarMaxValue)
        let width = ratio > 1? this.progressBarWidth : ratio * this.progressBarWidth
        this.rightBar?.setSize(width, this.progressBar.height)
        this.rightBarText?.setText(`Shield: ${this.rightBarValue}`)
        this.rightBarTextPhaser?.setText(`Shield: ${this.rightBarValue}`)
    }
}
