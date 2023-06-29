import Phaser from "phaser";
import { TextStyle } from "../config";
import { ColorStyle } from "../config";
import Layoutable from "./Layoutable";

enum FontType {h1 = 'h1',h2 = 'h2',h3 = 'h3',h4 = 'h4',h5 = 'h5',
p1 = 'p1',p2 = 'p2',p3 = 'p3',p4 = 'p4',p5 = 'p5',p6 = 'p6',
l1 = 'l1',l2 = 'l2',l3 = 'l3',l4 = 'l4',l5 = 'l5',l6 = 'l6'
}
export type FontTypeString = keyof typeof FontType;

/** A Text Object using Phaser's Text Game Object. We are not using this as the text is not rendered in high resolution(gets blurry). */
export default class TextBoxPhaser extends Phaser.GameObjects.Text implements Layoutable{

    private fontType:FontTypeString;

    constructor(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        super(scene, 0, 0, text, {});
        this.fontType = fontType;
        this.setColor(ColorStyle.neutrals.white);
        this.setAlign('center');
        this.setOrigin(0.5, 0.5);
        this.updateTextDisplay();
        this.setStyle({border:"2px solid black"});
        this.setResolution(2.2);
        // this.setBackgroundColor("#222222");
    }
    

    private updateTextDisplay() {
        let style = {...TextStyle[this.fontType]};
        let fontSize = style.fontSize;
        let fontSizeNumber = parseInt(fontSize.substring(0, fontSize.length - 2));
        // style.fontSize = (fontSizeNumber * 2) + "px";
        this.setStyle(style);
        // this.setScale(0.5, 0.5);
    }

    public setFontType(type:FontTypeString) {
        this.fontType=type;
        this.updateTextDisplay();
    }

    public setText(text: string) {
        super.setText(text);
        return this;
    }

    public setColor(color: string) {
        super.setColor(color);
        return this;
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth(): number {
        return this.displayWidth;
    }

    public getLayoutHeight(): number {
        return this.displayHeight;
    }

    public getLayoutOriginX(): number {
        return this.originX;
    }

    public getLayoutOriginY(): number {
        return this.originY;
    }
} 

