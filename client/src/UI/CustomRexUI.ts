import { OverlapSizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "./UIFactory";
import { ColorStyle } from "../config";

export interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export interface ButtonConfig extends OverlapSizer.IConfig {
    buttonSize?: "regular"|"small"|"large";
    text?:string;
}

export const CreateButton = (scene: SceneWithRexUI, config?: ButtonConfig) => {
    let buttonSize = config?.buttonSize ?? "regular";
    let buttonSizeDataAll = {
        small: {
            size: { x: 94, y: 44},
            fontType: "l6"
        },
        regular: {
            size: { x: 141, y: 66},
            fontType: "l5"
        },
        large: {
            size: { x: 218, y: 102},
            fontType: "l2"
        }
    }
    let buttonSizeData = buttonSizeDataAll[buttonSize];
    
    let label = scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 2, ColorStyle.primary.hex[100]),
        text: UIFactory.createTextBoxPhaser(scene, config?.text, buttonSizeData.fontType as "l1"|"l2"|"l3"|"l4"|"l5"|"l6"),
        width: buttonSizeData.size.x,
        height: buttonSizeData.size.y,
        align: "center",
    })

    let overlapSizer = scene.rexUI.add.overlapSizer({

    })
    overlapSizer.add(label);

    overlapSizer.setChildrenInteractive({

    }).on("child.over", () => {
        console.log("over");
    })

    //sizer.add(UIFactory.createTextBoxPhaser(scene, config?.text, buttonSizeData.fontType as "l1"|"l2"|"l3"|"l4"|"l5"|"l6").setWordWrapWidth(buttonSizeData.size.x), {align: "center-center", minWidth: buttonSizeData.size.x})
    //let buttonSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "button_small_default");

    return overlapSizer;
}
