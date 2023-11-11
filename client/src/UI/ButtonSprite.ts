import SoundManager from "../system/SoundManager";

export interface ButtonSpriteConfig {
    spriteKey: string;
    x?: number;
    y?: number;
    onClick?: Function;
}

type ButtonState = "enabled"|"disabled"|"pressed"|"hover";

export default class ButtonSprite extends Phaser.GameObjects.Sprite {

    private buttonState: ButtonState;
    private onClick: Function;
    
    constructor(scene: Phaser.Scene, config: ButtonSpriteConfig) {
        super(scene, config?.x ?? 0, config?.y ?? 0, config.spriteKey);
        this.onClick = config?.onClick ?? ( () => {console.log("Button Sprite Onclick!")} );
        this.buttonState = "enabled";

        this.scene.anims.createFromAseprite(config.spriteKey, undefined, this);
        this.setInteractive();
        this.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('pressed');
        });
        this.on(Phaser.Input.Events.POINTER_UP, ()=>{
            if(this.buttonState !== 'disabled') {
                this.setButtonState('enabled');
                this.onClick();
                SoundManager.getManager().play("button_click1");
            }
        });
        this.on(Phaser.Input.Events.POINTER_OUT, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('enabled');
        });
        this.on(Phaser.Input.Events.POINTER_OVER, ()=>{
            if(this.buttonState !== 'disabled') this.setButtonState('hover');
        });
    }

    /** Sets the onclick function that is called when this button is clicked. */
    public setOnclick(onClick: () => void) {
        this.onClick = onClick;
    }

    public enableButton() {
        this.setInteractive();
        this.setButtonState("enabled");
    }

    public disableButton() {
        this.removeInteractive();
        this.setButtonState("disabled");
    }

    public setDisplaySize(width: number, height: number): this {
        super.setDisplaySize(width, height);
        if(this.buttonState !== "disabled")
            this.setInteractive();
        return this;    
    }

    private setButtonState(buttonState: ButtonState) {
        this.buttonState = buttonState;
        this.play(this.buttonState);
    }

}
