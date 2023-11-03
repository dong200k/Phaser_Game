import { OverlapSizer, RoundRectangle } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../../config";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";
import SoundManager from "../../system/SoundManager";

export default class WAPopupButton extends RexUIBase {

    private buttonSizer: OverlapSizer;
    private buttonSprite: Phaser.GameObjects.Sprite;
    private buttonBorder: RoundRectangle;
    private onClick = () => { console.log("WAPopupButton onclick.")};
    private enabled: boolean = false;

    constructor(scene: SceneWithRexUI) {
        super(scene);
        this.buttonSizer = this.rexUI.add.overlapSizer({
            anchor: {
                bottom: "bottom-10",
                left: "left+350",
            }
        });
        this.buttonBorder = this.rexUI.add.roundRectangle(0, 0, 50, 50, 0, ColorStyle.primary.hex[500]);
        this.buttonSprite = this.scene.add.sprite(0, 0, "upgrade_aicon").setDisplaySize(50, 50);
        this.scene.anims.createFromAseprite("upgrade_aicon", undefined, this.buttonSprite);
        this.buttonSizer.add(this.buttonSprite);
        this.buttonSizer.add(this.buttonBorder);
        this.buttonBorder.setInteractive();
        this.buttonBorder.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.buttonBorder.setStrokeStyle();
        })
        this.buttonBorder.on(Phaser.Input.Events.POINTER_OVER, () => {
            if(this.enabled)
            this.buttonBorder.setStrokeStyle(1, ColorStyle.neutrals.hex.white);
        })
        this.buttonBorder.on(Phaser.Input.Events.POINTER_UP, () => {
            if(this.enabled) {
                this.onClick();
                SoundManager.getManager().play("button_click1");
            }
        })
        this.buttonSizer.layout();
    }

    public setOnclick(onClick: () => void) {
        this.onClick = onClick;
    }

    public setEnable(value: boolean) {
        this.enabled = value;
        if(this.enabled) {
            this.buttonSprite.play("enabled", true);
        }
        else {
            this.buttonSprite.play("disabled");
            this.buttonBorder.setStrokeStyle();
        }
            
    }

}