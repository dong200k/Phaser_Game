import Phaser from "phaser";
import Layoutable from "./Layoutable";
import { ColorStyle, TextStyle } from "../config";
import TextBox from "./TextBox";

type TextFieldSize = 'small' | 'regular' | 'large';

interface TextFieldConfig {
    assistText?: string;
    assistTextVisible?: boolean;
    text?: string;
    label?: string;
    labelVisible?: boolean;
    feedbackText?: string;
    feedbackTextVisible?: boolean;
    textFieldSize?: TextFieldSize;
    x?:number;
    y?:number;
}

export default class TextField extends Phaser.GameObjects.Container implements Layoutable {

    private labelVisible: boolean = false;
    private assistTextVisible: boolean = false;
    private feedbackTextVisible: boolean = false;
    private text: string = "";
    private label: string = "";
    private assistText: string = "";
    private feedbackText: string = "";
    private textFieldSize: TextFieldSize = "regular";
    private inputObject: Phaser.GameObjects.DOMElement;
    private inputDOM: HTMLInputElement;
    private labelObject: TextBox;
    private assistTextObject: TextBox;
    private feedbackTextObject: TextBox;


    constructor(scene: Phaser.Scene, config?: TextFieldConfig) {
        super(scene);
        if(config) { //Apply the custom configuaration if it exists.
            if(config.labelVisible !== undefined) this.labelVisible = config.labelVisible;
            if(config.assistTextVisible !== undefined) this.assistTextVisible = config.assistTextVisible;
            if(config.feedbackTextVisible !== undefined) this.feedbackTextVisible = config.feedbackTextVisible;
            if(config.label !== undefined) this.label = config.label;
            if(config.text !== undefined) this.text = config.text;
            if(config.assistText !== undefined) this.assistText = config.assistText;
            if(config.feedbackText !== undefined) this.feedbackText = config.feedbackText;
            if(config.textFieldSize !== undefined) this.textFieldSize = config.textFieldSize;
            if(config.x !== undefined) this.setX(config.x);
            if(config.y !== undefined) this.setY(config.y);
        }
        // Creates a Phaser DOM GameObject
        this.inputObject = new Phaser.GameObjects.DOMElement(this.scene, 0, 0, "input", getStyle(this.textFieldSize).input);
        this.labelObject = new TextBox(this.scene, this.label, 'l6');
        this.assistTextObject = new TextBox(this.scene, this.assistText, 'l6');
        this.feedbackTextObject = new TextBox(this.scene, this.feedbackText, 'l6');
        this.inputDOM = this.inputObject.node as HTMLInputElement;
        this.inputObject.node.addEventListener('input', () => {
            this.text = this.inputDOM.value;
        })
        this.add([this.inputObject, this.labelObject, this.assistTextObject, this.feedbackTextObject]);
        this.setText(this.text);
        this.updateTextFieldDisplay();
    }

    /**
     * Sets the text for this input field.
     * @param text the text
     */
    public setText(text: string) {
        this.inputDOM.value = text;
        this.text = text;
    }

    /**
     * @returns the text that is current displayed on the TextField.
     */
    public getText(): string {
        return this.text;
    }

    public setLabel(label: string) {
        this.label = label;
        this.labelObject.setText(this.label);
    }

    public getLabel() {
        return this.label;
    }

    public setLabelVisible(visible: boolean) {
        this.labelVisible = visible;
        this.labelObject.setVisible(this.labelVisible);
    }

    public getLabelVisible() {
        return this.labelVisible;
    }

    public setAssistText(assistText: string) {
        this.assistText = assistText;
        this.assistTextObject.setText(this.assistText);
    }

    public getAssistText() {
        return this.assistText;
    }

    public setAssistTextVisible(visible: boolean) {
        this.assistTextVisible = visible;
        this.assistTextObject.setVisible(this.assistTextVisible);
    }

    public getAssistTextVisible() {
        return this.assistTextVisible;
    }

    public setFeedbackText(feedbackText: string) {
        this.feedbackText = feedbackText;
        this.feedbackTextObject.setText(this.feedbackText);
    }

    public getFeedbackText() {
        return this.feedbackText;
    }

    public setFeedbackTextVisible(visible: boolean) {
        this.feedbackTextVisible = visible;
        this.feedbackTextObject.setVisible(this.feedbackTextVisible);
    }

    public getFeedbackTextVisible() {
        return this.feedbackTextVisible;
    } 

    /** Gets the Input element of this TextBox. This can be used for setting the type of input. */
    public getInputDOM() {
        return this.inputDOM;
    }

    /** Updates the TextField based on the current configuation details */
    private updateTextFieldDisplay() {
        this.labelObject.setVisible(this.labelVisible);
        this.labelObject.setText(this.label);
        this.labelObject.setOrigin(0, 1);
        this.labelObject.setPosition(-this.inputObject.width/2, -this.inputObject.height/2 - 3);
        this.labelObject.setFontType(this.textFieldSize === "large"? "l5": "l6");
        this.labelObject.setColor(ColorStyle.neutrals[900]);
        this.assistTextObject.setVisible(this.assistTextVisible);
        this.assistTextObject.setText(this.assistText);
        this.assistTextObject.setOrigin(1, 1);
        this.assistTextObject.setPosition(this.inputObject.width/2, -this.inputObject.height/2 - 3);
        this.assistTextObject.setFontType(this.textFieldSize === "large"? "l5": "l6");
        this.assistTextObject.setColor(ColorStyle.neutrals[700]);
        this.feedbackTextObject.setVisible(this.feedbackTextVisible);
        this.feedbackTextObject.setText(this.feedbackText);
        this.feedbackTextObject.setOrigin(0, 0);
        this.feedbackTextObject.setPosition(-this.inputObject.width/2,this.inputObject.height/2 + 5);
        this.feedbackTextObject.setFontType(this.textFieldSize === "large"? "l5": "l6");
        this.feedbackTextObject.setColor(ColorStyle.red[900]);
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth() {
        return this.inputObject.width + 3; //layout width with manual adjustments
    }

    public getLayoutHeight() {
        return this.inputObject.height + 38; //layout height with manual adjustments
    }

    public getLayoutOriginX() {
        return this.inputObject.originX - 0.005; //layout originX with manual adjustments
    }

    public getLayoutOriginY() {
        return this.inputObject.originY - 0.005; //layout originY with manual adjustments
    }
}

const getStyle = (size: TextFieldSize) => {

    const large = {
        input: {
            'background-color': ColorStyle.primary[500],
            'width': '337px',
            'height': '48px',
            'font-family': TextStyle.p3.fontFamily,
            'font-size': TextStyle.p3.fontSize,
            'color': ColorStyle.neutrals[100],
            'border-color': ColorStyle.primary[900],
            'border-style': 'solid',
            'border-radius': '2px',
            'padding': '0px 20px 0px 20px',
        },
    }

    const regular = {
        input: {
            'background-color': ColorStyle.primary[500],
            'width': '300px',
            'height': '38px',
            'font-family': TextStyle.p4.fontFamily,
            'font-size': TextStyle.p4.fontSize,
            'color': ColorStyle.neutrals[100],
            'border-color': ColorStyle.primary[900],
            'border-style': 'solid',
            'border-radius': '2px',
            'padding': '0px 20px 0px 20px',
        },
    }

    const small = {
        input: {
            'background-color': ColorStyle.primary[500],
            'width': '256px',
            'height': '23px',
            'font-family': TextStyle.p6.fontFamily,
            'font-size': TextStyle.p6.fontSize,
            'color': ColorStyle.neutrals[100],
            'border-color': ColorStyle.primary[900],
            'border-style': 'solid',
            'border-radius': '2px',
            'padding': '0px 14px 0px 14px',
        },
    }
    

    switch(size) {
        case 'large': return large;
        case 'regular': return regular;
        case 'small': return small;
    }
}