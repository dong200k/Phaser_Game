import { ColorStyle } from "../config";

export default class CircleImage extends Phaser.GameObjects.Image {

    private circle: Phaser.GameObjects.Graphics;
    private radius: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, radius: number) {
        super(scene, x, y, texture);
        this.radius = radius,
        this.circle = new Phaser.GameObjects.Graphics(this.scene);
        this.circle.fillStyle(ColorStyle.primary.hex[900]);
        this.circle.setPosition(x, y).fillCircle(0, 0, radius);
        this.scene.add.existing(this.circle);
        this.setMask(this.circle.createGeometryMask());
        this.setDisplaySize(this.radius * 2, this.radius * 2);
    }

    public updateMaskPosition() {
        if(this.circle) this.circle.setPosition(this.x, this.y);
    }

    public updateMaskVisible() {
        this.circle.setVisible(this.visible);
    }

    public getCircleMask() {
        return this.circle;
    }
}