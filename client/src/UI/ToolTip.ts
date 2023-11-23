import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase, { SceneWithRexUI } from "./RexUIBase";
import { ColorStyle } from "../config";
import TextBoxPhaser from "./TextBoxPhaser";
import UIFactory from "./UIFactory";

interface IToolTip {
    x?: number;
    y?: number;
    text?: string;
}

/**
 * A ToolTip is shown when the player hovers over an object 
 * of intrest. It is a popup that shows more information about the
 * object in question.
 */
export default class ToolTip extends RexUIBase {
    
    private hidden: boolean = true;
    private content: Sizer;
    private text: TextBoxPhaser;

    constructor(scene: SceneWithRexUI) {
        super(scene);
        this.content = scene.rexUI.add.sizer({
            width: 20,
            height: 20,
            space: {
                top: 5,
                bottom: 5,
                left: 20,
                right: 20,
            }
        });
        this.content.addBackground(
            this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500])
            .setStrokeStyle(3, ColorStyle.neutrals.hex[900])
            );
        this.content.add(this.text = UIFactory.createTextBoxPhaser(scene, "This is a tooltip.", "p4"));
        this.text.setWordWrapWidth(450);
        this.content.layout();
        this.content.hide();
        this.content.setDepth(100);
    }

    /**
     * Shows the ToolTip.
     * @param config ToolTip configuration.
     */
    public showToolTip(config?: IToolTip) {
        let text = config?.text ?? "";
        let x = config?.x ?? 0;
        let y = config?.y ?? 0;
        this.text.setText(text);
        this.content.layout();

        x = x + this.content.displayWidth / 2;
        y = y + this.content.displayHeight / 2;
        this.content.setPosition(x, y);

        this.content.show();
        this.content.fadeIn(50);
        this.hidden = false;
    }

    /** Hides the ToolTip. */
    public hideToolTip() {
        this.content.fadeOut(50);
        this.hidden = true;
    }

    /** @returns True if the ToolTip is hidden. False othersise. */
    public isHidden() {
        return this.hidden;
    }

}