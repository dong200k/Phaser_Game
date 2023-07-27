import Phaser from "phaser";
import { ColorStyle, TextStyle } from "../config";
import TextBox from "./TextBox";
import Layoutable from "./Layoutable";
import SettingsManager from "../system/SettingsManager";

type ButtonState = "active"|"disabled"|"default";

export default class NavButton extends Phaser.GameObjects.Container implements Layoutable {
    private buttonState:ButtonState;
    private buttonBackground:Phaser.GameObjects.Rectangle;
    private buttonText:TextBox;
    private onClick:Function;

    private static clickSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    constructor(scene:Phaser.Scene,text:string="",x:number=0,y:number=0,onClick:Function=()=>{}) {
        super(scene, x, y);
        if(NavButton.clickSound === undefined) NavButton.clickSound = scene.sound.add("button_click1");
        this.onClick = onClick;
        this.buttonState = "default";
        this.buttonBackground = new Phaser.GameObjects.Rectangle(scene, 0, 0, 87, 87, ColorStyle.primary.hex[900]);
        this.buttonBackground.setStrokeStyle(2, ColorStyle.neutrals.hex[900]);
        this.buttonText = new TextBox(this.scene, text, 'l5');
        this.buttonBackground.setInteractive();
        this.add(this.buttonBackground);
        this.add(this.buttonText);
        this.setOnClick(onClick);
        this.updateButtonDisplay();
    }
    
    public getLayoutWidth(): number {
        return this.buttonBackground.displayWidth;
    }

    public getLayoutHeight(): number {
        return this.buttonBackground.displayHeight;
    }

    public getLayoutOriginX(): number {
        return this.buttonBackground.originX;
    }

    public getLayoutOriginY(): number {
        return this.buttonBackground.originY;
    }

    private setButtonState(state:ButtonState) {
        this.buttonState = state;
        this.updateButtonDisplay();
    }

    public setButtonActive(buttonActive:boolean) {
        if(buttonActive) {
            this.setButtonState("active");
        }
        else {
            this.setButtonState("default");
        }   
    }

    public setOnClick(onClick:Function) {
        this.buttonBackground.removeListener(Phaser.Input.Events.POINTER_UP);
        this.onClick = onClick;
        this.buttonBackground.on(Phaser.Input.Events.POINTER_UP, ()=>{
            if(this.buttonState !== 'disabled') {
                this.onClick();
                NavButton.clickSound?.play({
                    volume: SettingsManager.getManager().getSoundEffectsVolumeAdjusted(),
                });
            }
        });
    }

    private updateButtonDisplay() {
        switch(this.buttonState) {
            case 'default': {
                this.buttonBackground.setFillStyle(ColorStyle.primary.hex[900]);
            } break;
            case 'active': {
                this.buttonBackground.setFillStyle(ColorStyle.primary.hex[500]);
            } break;
            case 'disabled': {
                this.buttonBackground.setFillStyle(ColorStyle.primary.hex[100]);
            }
        }
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }
}