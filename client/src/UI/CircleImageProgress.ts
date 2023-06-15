import { CircularProgress, OverlapSizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import CircleImage from "./CircleImage";
import UIFactory from "./UIFactory";
import { ColorStyle } from "../config";
import TextBoxPhaser from "./TextBoxPhaser";


interface CircleImageProgressConfig extends OverlapSizer.IConfig {
    texture?: string | Phaser.Textures.Texture,
    radius?: number,
}

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export default class CircleImageProgress extends OverlapSizer {

    rexUI: UIPlugins;

    private backgroundCircle: CircleImage | null = null;
    private circularProgress: CircularProgress;
    private radius: number;
    private text: TextBoxPhaser;

    constructor(scene: SceneWithRexUI, config: CircleImageProgressConfig) {
        super(scene, config);
        this.rexUI = scene.rexUI;
        this.radius = config.radius ?? 20;
        this.backgroundCircle = UIFactory.createCircleImage(this.scene, 0, 0, config?.texture ?? "", this.radius);
        this.add(this.backgroundCircle);

        this.circularProgress = new CircularProgress(this.scene, {
            radius: this.radius,
            valuechangeCallback: (newValue, oldValue, circularProgress) => {
                // console.log("newValue", newValue);
                // console.log("oldValue", oldValue);
                // console.log(circularProgress);
            },
            
            // trackColor: 0,
            barColor: ColorStyle.primary.hex[900],
            centerColor: ColorStyle.primary.hex[900],
            thickness: 1,
            value: 0.3,
            anticlockwise: true,
        })
        //this.circularProgress.setAlpha(0.9);

        this.scene.add.existing(this.circularProgress);
        this.add(this.circularProgress);
        this.text = UIFactory.createTextBoxPhaser(this.scene, "20", "l1")
        this.add(this.text, {expand: false});
    }

    public layoutCircleImageProgress() {
        if(this.backgroundCircle) {
            this.backgroundCircle.setPosition(this.x, this.y);
            this.backgroundCircle.updateMaskPosition();
        }
    }

    /**
     * Sets the percent of the progress bar that is filled in. 
     * @param value A number from 0 - 1. 1 being completely filled.
     */
    public setProgressPercent(value: number) {
        this.circularProgress.setValue(value);
    }

    /**
     * Sets the text that is displayed on the CircleImageProgress.
     * @param text A string.
     */
    public setProgressText(value: string) {
        this.text.setText(value);
    }

    /**
     * Sets if the text is visible.
     * @param value True or False.
     */
    public setProgressTextVisible(value: boolean) {
        this.text.setVisible(value);
    }

    /**
     * Sets the image for this circle progress.
     * @param key The texture key.
     */
    public setProgressImage(key: string) {
        this.backgroundCircle?.setTexture(key);
    }

}