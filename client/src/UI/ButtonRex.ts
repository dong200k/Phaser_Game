import { OverlapSizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import TextBoxPhaser from "./TextBoxPhaser";
import { ColorStyle } from "../config";
import SettingsManager from "../system/SettingsManager";

export interface ButtonRexConfig extends OverlapSizer.IConfig {
    buttonSize?: "regular"|"small"|"large";
    text?:string;
}

export default class ButtonRex extends OverlapSizer {

    private buttonState:"default"|"disabled"|"pressed";
    private buttonSize:"regular"|"small"|"large";
    private buttonSprite:Phaser.GameObjects.Sprite;
    private buttonText:TextBoxPhaser;
    //private onClick:Function;
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
    
    constructor(scene: Phaser.Scene, config?: ButtonRexConfig) {
        super(scene, config);
        if(ButtonRex.clickSound === undefined) ButtonRex.clickSound = scene.sound.add("button_click1");
        this.buttonSize = config?.buttonSize ?? "regular";
        let sizeData = this.sizeConfig[this.buttonSize];
        this.buttonState = "default";

        // ----- Button Sprite Image -----
        this.buttonSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, "button_small_default");
        this.buttonSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        // ----- Button Text Image -----
        this.buttonText = new TextBoxPhaser(this.scene, config?.text, sizeData.textStyle as "l1"|"l2"|"l3"|"l4"|"l5"|"l6");
        
        this.buttonSprite.setDisplaySize(sizeData.size.x, sizeData.size.y);
        this.setMinSize(sizeData.size.x, sizeData.size.y);

        this.setInteractive({cursor: "pointer"});
        this.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('pressed');
        });
        this.on(Phaser.Input.Events.POINTER_UP, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('default');
            ButtonRex.clickSound?.play({
                volume: SettingsManager.getManager().getSoundEffectsVolumeAdjusted(),
            });
        });
        this.on(Phaser.Input.Events.POINTER_OUT, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('default');
            this.hoverGradient.setVisible(false);
        });
        this.on(Phaser.Input.Events.POINTER_OVER, ()=>{
            if(this.buttonState !== 'disabled') this.hoverGradient.setVisible(true);
        });

        this.hoverGradient = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "button_small_default_hover_texture");
        this.hoverGradient.setAlpha(0.1);
        this.hoverGradient.setVisible(false);
        
        scene.add.existing(this.buttonSprite);
        scene.add.existing(this.buttonText);
        scene.add.existing(this.hoverGradient);

        this.add(this.buttonSprite);
        this.add(this.buttonText, {expand: false, offsetX: sizeData.textPosition.x, offsetY: sizeData.textPosition.y});
        this.add(this.hoverGradient);

        this.updateButtonDisplay();
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
            this.buttonSprite.on(Phaser.Input.Events.POINTER_UP, this.onClick);
        }
        else {
            this.setButtonState("disabled");
            this.buttonSprite.removeListener(Phaser.Input.Events.POINTER_UP);
        }   
    }

    private updateButtonDisplay() {
        let config = this.sizeConfig[this.buttonSize];
        switch(this.buttonState) {
            case 'default': {
                this.buttonSprite.setTexture("button_small_default");
                //this.buttonText.setPosition(config.textPosition.x, config.textPosition.y);
                this.buttonText.setColor(ColorStyle.neutrals.white);
            } break;
            case 'pressed': {
                this.buttonSprite.setTexture("button_small_active");
                
                //this.buttonText.setPosition(config.textPositionPressed.x, config.textPositionPressed.y);
                this.buttonText.setColor(ColorStyle.neutrals.white);
            } break;
            case 'disabled': {
                this.buttonSprite.setTexture("button_small_deactive");
                //this.buttonText.setPosition(config.textPositionPressed.x, config.textPositionPressed.y);
                this.buttonText.setColor(ColorStyle.neutrals[400]);
            }
        }
    }

}
