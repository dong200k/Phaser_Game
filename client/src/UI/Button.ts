import Phaser from "phaser";
import { ColorStyle, TextStyle } from "../config";
import TextBox from "./TextBox";
import Layoutable from "./Layoutable";

export default class Button extends Phaser.GameObjects.Container implements Layoutable {
    private buttonSize:"regular"|"small"|"large";
    private buttonState:"default"|"disabled"|"pressed";
    private buttonSprite:Phaser.GameObjects.Sprite;
    private buttonText:Phaser.GameObjects.Text;
    private onClick:Function;
    layoutWidth: number;
    layoutHeight: number;

    private sizeConfig = {
        regular: {
            size: { x: 141, y: 66},
            textStyle: TextStyle.l5,
            textPosition: {x: 0, y: -5},
            textPositionPressed: {x: 0,y: -2}
        },
        small: {
            size: { x: 94, y: 44},
            textStyle: TextStyle.l6,
            textPosition: {x: 0, y: -4},
            textPositionPressed: {x: 0,y: -2}
        },
        large: {
            size: { x: 218, y: 102},
            textStyle: TextStyle.l2,
            textPosition: {x: 0, y: -8},
            textPositionPressed: {x: 0,y: -5}
        }
    }
    
    constructor(scene:Phaser.Scene,text:string="",x:number=0,y:number=0, size:"regular"|"small"|"large"="regular",onClick:Function=()=>{}) {
        super(scene, x, y);
        this.buttonSize = size;
        this.onClick = onClick;
        this.buttonState = "default";
        this.buttonSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "button_small_default");
        this.buttonText = new TextBox(this.scene, text);
        //this.buttonText.setResolution(2);
        this.buttonSprite.setInteractive();
        this.buttonSprite.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('pressed')
        });
        this.buttonSprite.on(Phaser.Input.Events.POINTER_OUT, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('default')
        });
        this.layoutWidth = this.buttonSprite.width;
        this.layoutHeight = this.buttonSprite.height;
        this.add(this.buttonSprite);
        this.add(this.buttonText);
        this.setButtonSize(size);
        this.setOnClick(onClick);
        this.updateButtonDisplay();
    }
    

    private setButtonState(state:"default"|"disabled"|"pressed") {
        this.buttonState = state;
        this.updateButtonDisplay();
    }

    public setButtonActive(buttonActive:boolean) {
        if(buttonActive) {
            this.setButtonState("default");
            this.buttonSprite.on(Phaser.Input.Events.POINTER_UP, this.onClick);
        }
        else {
            this.setButtonState("disabled");
            this.buttonSprite.removeListener(Phaser.Input.Events.POINTER_UP);
        }   
    }

    public setOnClick(onClick:Function) {
        this.buttonSprite.removeListener(Phaser.Input.Events.POINTER_UP);
        this.onClick = onClick;
        this.buttonSprite.on(Phaser.Input.Events.POINTER_UP, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState("default");
            this.onClick();
        });
    }

    public setButtonSize(size:"regular"|"small"|"large") {
        this.buttonSize = size;
        this.updateButtonDisplay();
    }

    private updateButtonDisplay() {
        let config = this.sizeConfig[this.buttonSize];
        this.buttonSprite.setDisplaySize(config.size.x, config.size.y);
        this.buttonText.setStyle(config.textStyle);
        switch(this.buttonState) {
            case 'default': {
                this.buttonSprite.setTexture("button_small_default");
                this.buttonText.setPosition(config.textPosition.x, config.textPosition.y);
                this.buttonText.setColor(ColorStyle.neutrals.white);
            } break;
            case 'pressed': {
                this.buttonSprite.setTexture("button_small_active");
                this.buttonText.setPosition(config.textPositionPressed.x, config.textPositionPressed.y);
                this.buttonText.setColor(ColorStyle.neutrals.white);
            } break;
            case 'disabled': {
                this.buttonSprite.setTexture("button_small_deactive");
                this.buttonText.setPosition(config.textPositionPressed.x, config.textPositionPressed.y);
                this.buttonText.setColor(ColorStyle.neutrals[400]);
            }
        }
    }
}