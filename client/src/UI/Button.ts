import Phaser from "phaser";
import { ColorStyle, TextStyle } from "../config";
import Layoutable from "./Layoutable";
import TextBoxPhaser from "./TextBoxPhaser";
import SettingsManager from "../system/SettingsManager";

export default class Button extends Phaser.GameObjects.Container implements Layoutable {
    private buttonSize:"regular"|"small"|"large";
    private buttonState:"default"|"disabled"|"pressed";
    private buttonSprite:Phaser.GameObjects.Sprite;
    private buttonText:TextBoxPhaser;
    private onClick:Function;
    private hoverGradient:Phaser.GameObjects.Sprite;

    private static clickSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    private sizeConfig = {
        regular: {
            size: { x: 141, y: 66},
            textStyle: "l5",
            textPosition: {x: 0, y: -5},
            textPositionPressed: {x: 0,y: -2}
        },
        small: {
            size: { x: 94, y: 44},
            textStyle: "l6",
            textPosition: {x: 0, y: -4},
            textPositionPressed: {x: 0,y: -2}
        },
        large: {
            size: { x: 218, y: 102},
            textStyle: "l2",
            textPosition: {x: 0, y: -8},
            textPositionPressed: {x: 0,y: -5}
        }
    }
    
    constructor(scene:Phaser.Scene,text:string="",x:number=0,y:number=0, size:"regular"|"small"|"large"="regular",onClick:Function=()=>{}) {
        super(scene, x, y);
        if(Button.clickSound === undefined) Button.clickSound = scene.sound.add("button_click1");
        this.buttonSize = size;
        this.onClick = onClick;
        this.buttonState = "default";
        this.buttonSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "button_small_default");
        this.buttonSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.buttonText = new TextBoxPhaser(this.scene, text);
        // Button Text's pointer is handled by css.
        // (this.buttonText.node as HTMLDivElement).classList.add('button-text');
        // Button Sprite's pointer is handled by phaser.
        this.buttonSprite.setInteractive({cursor: "pointer"});
        this.buttonSprite.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('pressed');
        });
        this.buttonSprite.on(Phaser.Input.Events.POINTER_OUT, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('default');
            this.hoverGradient.setVisible(false);
        });
        this.buttonSprite.on(Phaser.Input.Events.POINTER_OVER, ()=>{
            if(this.buttonState !== 'disabled') this.hoverGradient.setVisible(true);
        });
        this.hoverGradient = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "button_small_default_hover_texture");
        this.hoverGradient.setAlpha(0.1);
        this.hoverGradient.setVisible(false);
        this.add(this.buttonSprite);
        this.add(this.buttonText);
        this.add(this.hoverGradient);
        this.setButtonSize(size);
        this.setOnClick(onClick);
        this.updateButtonDisplay();
    }

    public setLayoutPosition(x: number, y: number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth(): number {
        return this.buttonSprite.displayWidth;
    }

    public getLayoutHeight(): number {
        return this.buttonSprite.displayHeight;
    }

    public getLayoutOriginX(): number {
        return this.buttonSprite.originX;
    }

    public getLayoutOriginY(): number {
        return this.buttonSprite.originY;
    }

    public setText(text: string) {
        this.buttonText.setText(text);
    }

    private setButtonState(state:"default"|"disabled"|"pressed") {
        this.buttonState = state;
        this.updateButtonDisplay();
    }

    public setButtonActive(buttonActive:boolean) {
        if(buttonActive) {
            this.setButtonState("default");
            this.setOnClick(this.onClick);
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
            Button.clickSound?.play({
                volume: SettingsManager.getManager().getSoundEffectsVolumeAdjusted(),
            });
        });
    }

    public setButtonSize(size:"regular"|"small"|"large") {
        this.buttonSize = size;
        this.updateButtonDisplay();
    }

    private updateButtonDisplay() {
        let config = this.sizeConfig[this.buttonSize];
        this.buttonSprite.setDisplaySize(config.size.x, config.size.y);
        this.hoverGradient.setDisplaySize(config.size.x, config.size.y);
        this.buttonText.setFontType(config.textStyle as "l1"|"l2"|"l3"|"l4"|"l5"|"l6");
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