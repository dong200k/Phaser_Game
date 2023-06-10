import Button from "./Button";
import ButtonRex, { ButtonRexConfig } from "./ButtonRex";
import CircleImage from "./CircleImage";
import TextBox from "./TextBox";
import TextBoxPhaser, { FontTypeString } from "./TextBoxPhaser";

export default class UIFactory {

    public static createButton(scene: Phaser.Scene, text:string="",x:number=0,y:number=0, size:"regular"|"small"|"large"="regular",onClick:Function=()=>{}) {
        let button = new Button(scene, text, x, y, size, onClick);
        scene.add.existing(button);
        return button;
    }

    public static createTextBoxPhaser(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        let textBox = new TextBoxPhaser(scene, text, fontType);
        scene.add.existing(textBox);
        return textBox;
    }

    public static createTextBoxDOM(scene:Phaser.Scene,text="",fontType:FontTypeString='p3') {
        let textBox = new TextBox(scene, text, fontType);
        scene.add.existing(textBox);
        return textBox;
    }

    public static createButtonRex(scene: Phaser.Scene, config: ButtonRexConfig) {
        let buttonRex = new ButtonRex(scene, config);
        scene.add.existing(buttonRex);
        return buttonRex;
    }

    public static createCircleImage(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, radius: number) {
        let circleImage = new CircleImage(scene, x, y, texture, radius);
        scene.add.existing(circleImage);
        return circleImage;
    }
}