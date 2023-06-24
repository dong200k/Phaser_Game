import Phaser from "phaser";
import { TextStyle } from "../config";
import { ColorStyle } from "../config";
import { OverlapSizer} from "phaser3-rex-plugins/templates/ui/ui-components";

enum FontType {h1 = 'h1',h2 = 'h2',h3 = 'h3',h4 = 'h4',h5 = 'h5',
p1 = 'p1',p2 = 'p2',p3 = 'p3',p4 = 'p4',p5 = 'p5',p6 = 'p6',
l1 = 'l1',l2 = 'l2',l3 = 'l3',l4 = 'l4',l5 = 'l5',l6 = 'l6'
}
type FontTypeString = keyof typeof FontType;

export default class TextBoxRex extends OverlapSizer {

    private fontType:FontTypeString;
    private divElement:HTMLDivElement;
    private domElement: Phaser.GameObjects.DOMElement;
    private domElementBorder: Phaser.GameObjects.Rectangle;

    constructor(scene:Phaser.Scene,text="",fontType:FontTypeString='p3',color:string=ColorStyle.neutrals.white) {
        super(scene);
        this.domElement = this.scene.add.dom(0, 0, "div", {
            'user-select': 'none'
        })
        this.domElementBorder = this.scene.add.rectangle(0, 0, 2, 2, 0, 0) // Used as a trick to layout the DOM Element in RexUI.
        this.fontType = fontType;
        this.divElement = this.domElement.node as HTMLDivElement;

        this.add(this.domElementBorder, {expand: false});
        this.add(this.domElement, {expand: false});

        this.setColor(color);
        this.setText(text);
        this.setFontType(this.fontType);
    }

    public setFontType(type:FontTypeString) {
        this.fontType=type;
        let fontStyle = TextStyle[this.fontType];
        this.divElement.style.fontFamily = fontStyle.fontFamily;
        this.divElement.style.fontSize = fontStyle.fontSize;
        this.domElementBorder.setSize(this.domElement.width, this.domElement.height);
    }

    /** Gets the Div element of this TextBox. This can be used for more detailed styling of the text. */
    public getDIVElement() {
        return this.divElement;
    }

    /** Gets the Phaser.GameObject.DOMElement which is used to display the DOMElement. */
    public getDOMElement() {
        return this.domElement;
    }

    public setText(text: string) {
        this.domElement.setText(text);
        this.domElementBorder.setSize(this.domElement.width, this.domElement.height);
        return this;
    }

    public setColor(color: string) {
        this.divElement.style.color = color;
        return this;
    }
} 
