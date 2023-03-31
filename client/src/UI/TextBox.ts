import Phaser from "phaser";
import { TextStyle } from "../config";
import { ColorStyle } from "../config";

enum FontType {h1 = 'h1',h2 = 'h2',h3 = 'h3',h4 = 'h4',h5 = 'h5',
p1 = 'p1',p2 = 'p2',p3 = 'p3',p4 = 'p4',p5 = 'p5',p6 = 'p6',
l1 = 'l1',l2 = 'l2',l3 = 'l3',l4 = 'l4',l5 = 'l5',l6 = 'l6'
}
type FontTypeString = keyof typeof FontType;

export default class TextBox extends Phaser.GameObjects.Text {

    private fontType:FontTypeString;

    constructor(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        super(scene, 0, 0, text, {});
        this.fontType = fontType;
        this.setColor(ColorStyle.neutrals.white);
        this.setAlign('center');
        this.setOrigin(0.5, 0.5);
        this.updateTextDisplay();
    }

    private updateTextDisplay() {
        this.setStyle(TextStyle[this.fontType]);
    }

    public setFontType(type:FontTypeString) {
        this.fontType=type;
        this.updateTextDisplay();
    }
} 

