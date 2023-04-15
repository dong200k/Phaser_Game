import Phaser from "phaser";
import { TextStyle } from "../config";
import { ColorStyle } from "../config";
import Layoutable from "./Layoutable";

enum FontType {h1 = 'h1',h2 = 'h2',h3 = 'h3',h4 = 'h4',h5 = 'h5',
p1 = 'p1',p2 = 'p2',p3 = 'p3',p4 = 'p4',p5 = 'p5',p6 = 'p6',
l1 = 'l1',l2 = 'l2',l3 = 'l3',l4 = 'l4',l5 = 'l5',l6 = 'l6'
}
type FontTypeString = keyof typeof FontType;

export default class TextBox extends Phaser.GameObjects.DOMElement implements Layoutable{

    private fontType:FontTypeString;
    private divElement:HTMLDivElement;

    constructor(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        super(scene, 0, 0, 'div', {
            'user-select': 'none'
        });
        this.fontType = fontType;
        this.divElement = this.node as HTMLDivElement;
        this.setOrigin(0.5, 0.5);
        this.setColor(ColorStyle.neutrals.white);
        this.setText(text);
        this.setFontType(this.fontType);
    }

    public setFontType(type:FontTypeString) {
        this.fontType=type;
        let fontStyle = TextStyle[this.fontType];
        this.divElement.style.fontFamily = fontStyle.fontFamily;
        this.divElement.style.fontSize = fontStyle.fontSize;
        this.updateSize(); // Forces updates of the dom nodes dimensions after font changes.
    }

    public setText(text: string) {
        super.setText(text);
        return this;
    }

    public setColor(color: string) {
        this.divElement.style.color = color;
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth(): number {
        return this.width;
    }

    public getLayoutHeight(): number {
        return this.height;
    }

    public getLayoutOriginX(): number {
        return this.originX + 0.002; //manual adjustments to layout origin X.
    }

    public getLayoutOriginY(): number {
        return this.originY + 0.05; //manual adjustments to layout origin Y.
    }
} 
