import { FixWidthSizer, OverlapSizer, TextBox } from "phaser3-rex-plugins/templates/ui/ui-components";
import CircleImage from "../CircleImage";
import UIFactory from "../UIFactory";
import { ColorStyle } from "../../config";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";
import EventManager from "../../system/EventManager";
import TextBoxPhaser from "../TextBoxPhaser";
import CircleImageRex from "../CircleImageRex";

export interface ArtifactDisplayItem {
    imageKey: string;
    level: number;
    name?: string;
    description?: string;
}

export interface ArtifactDisplayData {
    items: ArtifactDisplayItem[] 
}

/**
 * The ArtifactDisplay displays the images and levels of the artifacts 
 * the player has ingame.
 */
export default class ArtifactDisplay extends RexUIBase {

    private artifactSizer: FixWidthSizer;
    private artifactData: ArtifactDisplayData;
    private artifactSizerItems: OverlapSizer[] = [];

    constructor(scene: SceneWithRexUI, config: Partial<ArtifactDisplayData>) {
        super(scene);
        this.artifactData = {items: []}
        Object.assign(this.artifactData, config);
        this.artifactSizer = this.rexUI.add.fixWidthSizer({
            width: this.scene.game.scale.width * (3/5),
            anchor: {
                left: 'left+120',
                top: 'top+10',
            },
            space: {
                item: 5,
                line: 5,
            },
        })
        this.updateArtifactDisplay({});
    }

    public getArtifactSizer() {
        return this.artifactSizer;
    }

    public updateArtifactDisplay(data: Partial<ArtifactDisplayData>) {
        Object.assign(this.artifactData, data);
        // Updates artifact display.
        for(let i = 0; i < this.artifactData.items.length; i++) {
            if(this.artifactSizerItems.length <= i) {
                let itemDisplay = this.createArtifactItem(this.artifactData.items[i]);
                this.artifactSizer.add(itemDisplay);
                this.artifactSizerItems.push(itemDisplay);
            } else {
                this.updateArtifactItem(this.artifactSizerItems[i], this.artifactData.items[i]);
                this.artifactSizerItems[i].setVisible(true);
            }
        }

        for(let i = this.artifactData.items.length; i < this.artifactSizerItems.length; i++) {
            this.artifactSizerItems[i].setVisible(false);
        }

        this.artifactSizer.layout();

        this.artifactSizer.getAllChildren().forEach((child) => {
            if(child instanceof CircleImage) child.updateMask();
        })
    }

    private updateArtifactItem(overlapSizer: OverlapSizer, data: ArtifactDisplayItem) {
        let circleImage = overlapSizer.getByName("circleImage") as CircleImageRex;
        circleImage.setTexture(data.imageKey);
        let text = overlapSizer.getByName("levelText", true) as TextBoxPhaser;
        text.setText(`${data.level}`);
        overlapSizer.setData("data", {
            name: data.name ?? "Unknown",
            description: data.description ?? "",
        })
        overlapSizer.layout();
    }

    private createArtifactItem(data: ArtifactDisplayItem) {
        let overlapSizer = this.rexUI.add.overlapSizer({
            width: 45,
            height: 45,
            space: {
                left: 3,
                right: 3,
                top: 3, 
                bottom: 3,
            }
        });
        overlapSizer.setData("data", {
            name: data.name ?? "Unknown",
            description: data.description ?? "",
        })
        overlapSizer.add(UIFactory.createCircleImageRex(this.scene, {
            circleRadius: 21,
            texture: data.imageKey,
            backgroundColor: ColorStyle.primary.hex[500],
            imageWidth: 32,
            imageHeight: 32,
            x: 0,
            y: 0,
        }).setName("circleImage"));
        overlapSizer.add(
            this.rexUI.add.overlapSizer({
                space: {
                    left: 5,
                    right: 5,
                }
            })
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 30, 10, 5, ColorStyle.primary.hex[900]))
            .add(UIFactory.createTextBoxPhaser(this.scene, `${data.level}`, "l6").setName("levelText"))
            , {expand: false, align: "right-bottom"}
        )
        overlapSizer.layout();
        overlapSizer.setInteractive();
        overlapSizer.on(Phaser.Input.Events.POINTER_OVER, () => {
            let text = overlapSizer.getData("data").name 
                + "\n"
                + overlapSizer.getData("data").description;
            EventManager.eventEmitter.emit(EventManager.HUDEvents.SHOW_TOOLTIP, {
                text: text,
                x: overlapSizer.x + overlapSizer.displayWidth / 2, 
                y: overlapSizer.y + overlapSizer.displayHeight / 2,
            });
            let circleImage = overlapSizer.getByName("circleImage") as CircleImageRex;
            circleImage.getBackground().setStrokeStyle(1, ColorStyle.neutrals.hex.white);
        })
        overlapSizer.on(Phaser.Input.Events.POINTER_OUT, () => {
            EventManager.eventEmitter.emit(EventManager.HUDEvents.HIDE_TOOLTIP);
            let circleImage = overlapSizer.getByName("circleImage") as CircleImageRex;
            circleImage.getBackground().setStrokeStyle();
        })
        return overlapSizer;
    }
}