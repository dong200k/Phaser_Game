import { FixWidthSizer, OverlapSizer, TextBox } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import CircleImage from "../CircleImage";
import UIFactory from "../UIFactory";
import { ColorStyle } from "../../config";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

export interface ArtifactDisplayItem {
    imageKey: string;
    level: number;
}

export interface ArtifactDisplayData {
    items: ArtifactDisplayItem[] 
}

export default class ArtifactDisplay {

    private scene: SceneWithRexUI;
    private rexUI: UIPlugins;
    private artifactSizer: FixWidthSizer;
    private artifactData: ArtifactDisplayData;
    private artifactSizerItems: OverlapSizer[] = [];

    constructor(scene: SceneWithRexUI, config: Partial<ArtifactDisplayData>) {
        this.scene = scene;
        this.rexUI = scene.rexUI;
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
            if(child instanceof CircleImage) {
                child.updateMaskPosition();
                child.updateMaskVisible();
            }
        })
    }

    private updateArtifactItem(overlapSizer: OverlapSizer, data: ArtifactDisplayItem) {
        let circleImage = overlapSizer.getByName("circleImage") as CircleImage;
        circleImage.setTexture(data.imageKey);
        let text = overlapSizer.getByName("levelText", true) as TextBox;
        text.setText(`${data.level}`);
    }

    private createArtifactItem(data: ArtifactDisplayItem) {
        let overlapSizer = this.rexUI.add.overlapSizer();
        overlapSizer.add(UIFactory.createCircleImage(this.scene, 0, 0, data.imageKey, 18).setDisplaySize(36, 36).setName("circleImage"));
        overlapSizer.add(
            this.rexUI.add.overlapSizer({
                space: {
                    left: 5,
                    right: 5,
                }
            })
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 30, 10, 5, ColorStyle.primary.hex[900]))
            .add(UIFactory.createTextBoxDOM(this.scene, `${data.level}`, "l6").setName("levelText"))
            , {expand: false, align: "right-bottom"}
        )
        return overlapSizer;
    }
}