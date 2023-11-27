import Button from "./Button";
import ButtonRex, { ButtonRexConfig } from "./ButtonRex";
import ButtonSprite, { ButtonSpriteConfig } from "./ButtonSprite";
import CircleImage from "./CircleImage";
import CircleImageRex, { CircleImageRexConfig } from "./CircleImageRex";
import { SceneWithRexUI } from "./RexUIBase";
import TextBox from "./TextBox";
import TextBoxPhaser, { FontTypeString } from "./TextBoxPhaser";
import TextBoxRex from "./TextBoxRex";

/** A Factory used to construct commonly used UI elements. */
export default class UIFactory {

    /**
     * Creates a Button that uses a DOMElement for its text.
     * @param scene Phaser scene.
     * @param text The text.
     * @param x x position.
     * @param y y position.
     * @param size The size of the button.
     * @param onClick The callback for the button.
     * @returns A Button.
     */
    public static createButton(scene: Phaser.Scene, text:string="",x:number=0,y:number=0, size:"regular"|"small"|"large"="regular",onClick:Function=()=>{}) {
        let button = new Button(scene, text, x, y, size, onClick);
        scene.add.existing(button);
        return button;
    }

    /**
     * Creates a TextBox that displays text using Phaser's Text GameObject.
     * @param scene The Phaser Scene.
     * @param text The text to be displayed.
     * @param fontType The font type of the text.
     * @returns A TextBoxPhaser.
     */
    public static createTextBoxPhaser(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        let textBox = new TextBoxPhaser(scene, text, fontType);
        scene.add.existing(textBox);
        return textBox;
    }

    /**
     * Creates a TextBox that displays text using Phaser's DOMElement. Note that when using 
     * this the text will be clearer but will be displayed ontop of the game canvas.
     * @param scene The Phaser Scene.
     * @param text The text to be displayed.
     * @param fontType The font type of the text.
     * @returns A TextBox.
     */
    public static createTextBoxDOM(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        let textBox = new TextBox(scene, text, fontType);
        scene.add.existing(textBox);
        return textBox;
    }

    /**
     * Creates a TextBox that displays text using Phaser's DOMElement. This text box works with 
     * RexUI's layout() method unlike TextBoxDOM.
     * @param scene The Phaser Scene.
     * @param text The text to be displayed.
     * @param fontType The font type of the text.
     * @returns A TextBoxRex.
     */
    public static createTextBoxRex(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        let textBox = new TextBoxRex(scene, text, fontType);
        scene.add.existing(textBox);
        return textBox;
    }

    /**
     * Creates a button that works with RexUI's layout() method.
     * @param scene The Phaser Scene.
     * @param config ButtonRexConfig.
     * @returns A ButtonRex.
     */
    public static createButtonRex(scene: Phaser.Scene, config: ButtonRexConfig) {
        let buttonRex = new ButtonRex(scene, config);
        scene.add.existing(buttonRex);
        return buttonRex;
    }

    /**
     * Create a circular image.
     * @param scene The Phaser Scene.
     * @param x The x position of the image.
     * @param y The y position of the image.
     * @param texture The texture for this image.
     * @param radius The radius of the image.
     * @returns An circle image.
     */
    public static createCircleImage(scene: Phaser.Scene, x: number, y: number, texture: string, radius: number) {
        let circleImage = new CircleImage(scene, x, y, texture, radius);
        scene.add.existing(circleImage);
        return circleImage;
    }

    /**
     * Creates an image with a border radius. You can change the radius of the border, the color of the 
     * background, and the width and height of the image.
     * @param scene SceneWithRexUI.
     * @param config The CircleImageRexConfig.
     * @returns CircleImageRex.
     */
    public static createCircleImageRex(scene: SceneWithRexUI, config: CircleImageRexConfig) {
        return new CircleImageRex(scene, config);
    }

    /**
     * Creates a button that will be represented by an sprite.
     * The sprite should be an aseprite animation with animations of, 'enabled', 'disabled', 'hover', 'pressed'.
     * @param scene The Phaser Scene.
     * @param config The ButtonSpriteConfig.
     * @returns A ButtonSprite.
     */
    public static createButtonSprite(scene: Phaser.Scene, config: ButtonSpriteConfig) {
        let buttonSprite = new ButtonSprite(scene, config);
        scene.add.existing(buttonSprite);
        return buttonSprite;
    }
}