import Phaser from "phaser";
import { ColorStyle } from "../config";
import Layoutable from "./Layoutable";

export default class Checkbox extends Phaser.GameObjects.Container implements Layoutable {

    private checked: boolean;
    private outerBorder: Phaser.GameObjects.Graphics;
    private innerRectangle: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x=0, y=0, checked=false) {
        super(scene, x, y);
        this.checked = false;
        this.outerBorder = new Phaser.GameObjects.Graphics(this.scene);
        this.outerBorder.lineStyle(4, ColorStyle.primary.hex[900]);
        this.outerBorder.strokeRoundedRect(-12, -12, 24, 24, 5);
        this.outerBorder.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(-12, -12, 24, 24),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            cursor: "pointer"
        });
        this.outerBorder.on(Phaser.Input.Events.POINTER_UP, () => {
            this.setChecked(!this.getChecked());
        });
        this.innerRectangle = new Phaser.GameObjects.Graphics(this.scene);
        this.innerRectangle.fillStyle(ColorStyle.primary.hex[900]);
        this.innerRectangle.fillRect(-7, -7, 14, 14);
        this.add([this.innerRectangle, this.outerBorder]);
        this.updateCheckboxDisplay();
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth() {
        return 24;
    } 

    public getLayoutHeight() {
        return 24;
    }

    public getLayoutOriginX() {
        return 0.5;
    }

    public getLayoutOriginY() {
        return 0.5;
    }

    public setChecked(checked: boolean) {
        this.checked = checked;
        this.updateCheckboxDisplay();
    }

    public getChecked() {
        return this.checked;
    }

    private updateCheckboxDisplay() {
        if(this.checked) {
            this.innerRectangle.setVisible(true);
        } else {
            this.innerRectangle.setVisible(false);
        }
    }
}