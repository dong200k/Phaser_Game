import { OverlapSizer, RoundRectangle } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../config";
import { SceneWithRexUI } from "./RexUIBase";

export interface CircleImageRexConfig {
    /** x position. */
    x?: number;
    /** y position. */
    y?: number;
    /** The texture for the image. */
    texture: string;
    /** The radius of the circluar background. */
    circleRadius: number;
    /** The color of the background. */
    backgroundColor?: number;
    /** The width of the image. Note that the size of the image doesn't change the size of the circle background.*/
    imageWidth?: number;
    /** The height of the image. Note that the size of the image doesn't change the size of the circle background.*/
    imageHeight?: number;
}

export default class CircleImageRex extends OverlapSizer {

    private image: Phaser.GameObjects.Image;
    private background: RoundRectangle;

    constructor(scene: SceneWithRexUI, config: CircleImageRexConfig) {
        super(scene, config.x ?? 0, config.y ?? 0);
        let backgroundColor = config.backgroundColor ?? 0x0;
        let width = config.imageWidth ?? config.circleRadius * 2;
        let height = config.imageHeight ?? config.circleRadius * 2;
        this.addBackground(this.background = scene.rexUI.add.roundRectangle(0, 0, config.circleRadius * 2, config.circleRadius * 2, config.circleRadius, backgroundColor));
        this.add(this.image = scene.add.image(0, 0, config.texture).setDisplaySize(width, height));
        this.layout();
    }

    public setTexture(texture: string, frame?: string | number) {
        this.image.setTexture(texture, frame);
    }

    public getBackground() {
        return this.background;
    }
}
