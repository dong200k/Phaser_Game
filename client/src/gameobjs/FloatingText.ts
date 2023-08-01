import TextBoxPhaser, { FontTypeString } from "../UI/TextBoxPhaser";
import { ColorStyle } from "../config";
import GameObject from "./GameObject";

type FloatingTextType = "damage" | "heal" | "xp";

interface FloatingTextConfig {
    scene: Phaser.Scene;
    text: string;
    type: FloatingTextType;
    duration?: number;
    x: number;
    y: number;
    followGameObject?: GameObject;
}

export default class FloatingText extends TextBoxPhaser {

    /** The amount of time this text will appear for before disappearing. */
    private duration: number;

    private followGameObject?: GameObject;

    yOffset: number = 0;
    xOffset: number = 0;

    /**
     * Creates a new FloatingText that will float and the disappear.
     * @param config Floating text config object.
     */
    constructor(config: FloatingTextConfig) {
        super(config.scene, config.text, "p6");
        this.duration = config.duration ?? 1000;
        this.followGameObject = config.followGameObject;

        this.setShadow(3, 3, ColorStyle.neutrals[800], 2);

        switch(config.type) {
            case "damage": this.setColor("#C91111"); break;
            case "heal": this.setColor("#35CA1D"); break;
            case "xp": this.setColor("#E1CFAA"); break;
            default: this.setColor(ColorStyle.neutrals.white);
        }
        
        this.setX(config.x ?? 0);
        this.setY(config.y ?? 0);

        this.setScale(0.5, 0.5);

        this.scene.tweens.add({
            targets: this,
            duration: this.duration,
            ease: 'Power1',
            yOffset: 5,
            xOffset: Math.floor(Math.random() * 10) - 5,
            onComplete: (tween) => {
                this.destroy();
            }
        })

        
    }

    /** Updates the position of this floating text. This 
     * should be called every update after all other GameObject's position have been updated.
     */
    updatePosition() {
        if(this.followGameObject) {
            this.setPosition(this.followGameObject.x + this.xOffset, this.followGameObject.y + this.yOffset);
        }
    }

}
