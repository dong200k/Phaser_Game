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

    constructor(scene:Phaser.Scene,text="",fontType:FontTypeString='p3',color:string=ColorStyle.neutrals.white) {
        super(scene, 0, 0, 'div', {
            'user-select': 'none'
        });
        this.fontType = fontType;
        this.divElement = this.node as HTMLDivElement;
        this.setOrigin(0.5, 0.5);
        this.setColor(color);
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

    /** Gets the Div element of this TextBox. This can be used for more detailed styling of the text. */
    public getDIVElement() {
        return this.divElement;
    }

    public setText(text: string) {
        super.setText(text);
        return this;
    }

    public setColor(color: string) {
        this.divElement.style.color = color;
        return this;
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
        return this;
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
