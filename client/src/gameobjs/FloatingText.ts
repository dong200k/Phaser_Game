import TextBoxPhaser, { FontTypeString } from "../UI/TextBoxPhaser";

interface FloatingTextConfig {
    scene: Phaser.Scene;
    text: string;
    fontType: FontTypeString;
    duration?: number;
    color?: string;
    x: number;
    y: number;
}

export default class FloatingText extends TextBoxPhaser {

    /** The amount of time this text will appear for before disappearing. */
    private duration: number;

    /**
     * Creates a new FloatingText that will float and the disappear.
     * @param config Floating text config object.
     */
    constructor(config: FloatingTextConfig) {
        super(config.scene, config.text, config.fontType);
        this.duration = config.duration ?? 1000;

        if(config.color) this.setColor(config.color);
        this.setX(config.x ?? 0);
        this.setY(config.y ?? 0);

        this.setScale(0.5, 0.5);

        this.scene.tweens.add({
            targets: this,
            duration: this.duration,
            ease: 'Power1',
            y: this.y - 5,
            onComplete: (tween) => {
                this.destroy();
            }
        })

    }

}
