import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../../config";
import ProgressBar from "../ProgressBar";
import CircleImageProgress from "../CircleImageProgress";
import UIFactory from "../UIFactory";
import TextBox from "../TextBox";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";

export interface PlayerInfoData {
    slot1ItemKey: string;
    slot2ItemKey: string;
    slot3ItemKey: string;
    hpValue: number;
    maxHpValue: number;
    mpValue: number;
    maxMpValue: number;
    xpValue: number;
    maxXpValue: number;
    level: number;
    specialCooldownCounter: number;
    specialCooldownPercent: number;
    specialImageKey: string;
}

/** 
 * The PlayerInfo is used to display the player's information ingame. These info includes the 
 * player's hotslots, hp, mp, xp, level, and cooldowns.
*/
export default class PlayerInfo extends RexUIBase {
    private playerInfoSizer: Sizer;
    private playerInfoData: PlayerInfoData;

    //UI Items
    private levelTextBox!: TextBox;
    private hotSlotSizer!: Sizer; 
    private hpBar!: ProgressBar;
    private mpBar!: ProgressBar;
    private xpBar!: ProgressBar;
    private specialDisplay!: CircleImageProgress;

    constructor(scene: SceneWithRexUI, config: Partial<PlayerInfoData>) {
        super(scene);
        this.playerInfoData = {
            slot1ItemKey: "",
            slot2ItemKey: "",
            slot3ItemKey: "",
            hpValue: 100, 
            maxHpValue: 100,
            mpValue: 100,
            maxMpValue: 100,
            xpValue: 100,
            maxXpValue: 100,
            level: 1,
            specialCooldownCounter: 0,
            specialCooldownPercent: 0,
            specialImageKey: ""
        }
        Object.assign(this.playerInfoData, config);
        this.playerInfoSizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            anchor: {
                left: 'left+10',
                bottom: 'bottom-10',
            },
            space: {
                item: 10,
                left: 10,
                right: 10,
                top: 7,
                bottom: 7,
            },
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 3, ColorStyle.primary.hex[500]));
        
        let statusBars = this.createStatusBars();

        let statusBarsLevelHotslotSizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 5,
            }
        })
            .add(this.createHotSlotsWithLevel(), {expand: true})
            .add(statusBars);

        this.playerInfoSizer.add(statusBarsLevelHotslotSizer);

        this.specialDisplay = new CircleImageProgress(this.scene, {
            radius: 50,
            texture: "",
        })
        this.scene.add.existing(this.specialDisplay);
        this.playerInfoSizer.add(this.specialDisplay);

        
        this.playerInfoSizer.layout();
        
        this.specialDisplay.layoutCircleImageProgress();

        this.updatePlayerInfoData({});
    }

    public updatePlayerInfoData(data: Partial<PlayerInfoData>) {
        Object.assign(this.playerInfoData, data);
        // Update Level counter
        this.levelTextBox.setText(`${this.playerInfoData.level}`);

        // Update Item slots
        let image1 = this.hotSlotSizer.getByName("slotImage1", true) as Phaser.GameObjects.Image;
        let image2 = this.hotSlotSizer.getByName("slotImage2", true) as Phaser.GameObjects.Image;
        let image3 = this.hotSlotSizer.getByName("slotImage3", true) as Phaser.GameObjects.Image;
        if(this.playerInfoData.slot1ItemKey === "") image1.setVisible(false);
        else {image1.setVisible(true); image1.setTexture(this.playerInfoData.slot1ItemKey)}
        if(this.playerInfoData.slot2ItemKey === "") image2.setVisible(false);
        else {image2.setVisible(true); image2.setTexture(this.playerInfoData.slot2ItemKey)}
        if(this.playerInfoData.slot3ItemKey === "") image3.setVisible(false);
        else {image3.setVisible(true); image3.setTexture(this.playerInfoData.slot3ItemKey)}

        // Update Status bars
        this.hpBar.setProgressBarMaxValue(this.playerInfoData.maxHpValue);
        this.hpBar.setProgressBarValue(this.playerInfoData.hpValue);
        this.mpBar.setProgressBarMaxValue(this.playerInfoData.maxMpValue);
        this.mpBar.setProgressBarValue(this.playerInfoData.mpValue);
        this.xpBar.setProgressBarMaxValue(this.playerInfoData.maxXpValue);
        this.xpBar.setProgressBarValue(this.playerInfoData.xpValue);

        // Update Special circle
        if(this.playerInfoData.specialCooldownPercent === 0) this.specialDisplay.setProgressTextVisible(false);
        else this.specialDisplay.setProgressTextVisible(true);
        this.specialDisplay.setProgressImage(this.playerInfoData.specialImageKey);
        this.specialDisplay.setProgressText(`${this.playerInfoData.specialCooldownCounter}`);
        this.specialDisplay.setProgressPercent(this.playerInfoData.specialCooldownPercent);
    }

    public getPlayerInfoSizer() {
        return this.playerInfoSizer;
    }

    private createStatusBars() {
        this.hpBar = new ProgressBar(this.scene, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x832F2F,
        });
        
        this.mpBar = new ProgressBar(this.scene, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x2F3883,
        });
        
        this.xpBar = new ProgressBar(this.scene, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x7C832F,
        });
        this.scene.add.existing(this.hpBar);
        this.scene.add.existing(this.mpBar);
        this.scene.add.existing(this.xpBar);

        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 5,
            }
        })

        // sizer.add(this.createHotSlots(), {align: "left", expand: true});
        sizer.add(this.hpBar);
        sizer.add(this.mpBar);
        sizer.add(this.xpBar);

        return sizer;
    }

    private createHotSlotsWithLevel() {
        let sizer = this.rexUI.add.fixWidthSizer({
            align: "justify",
        })
        sizer.add(
            this.rexUI.add.sizer({
                height: 36,
                space: {
                    left: 28,
                    right: 28,
                }
            })
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]))
            .add((this.levelTextBox = UIFactory.createTextBoxDOM(this.scene, "10", "p4")), {align: "center-center"})
        )
        sizer.add((this.hotSlotSizer = this.createHotSlots()));
        return sizer;
    }

    private createHotSlots() {
        let sizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 3,
            }
        })

        for(let i = 0; i < 3; i++) {
            sizer.add(
                this.rexUI.add.overlapSizer()
                .add(this.rexUI.add.roundRectangle(0, 0, 36, 36, 0, 0, 0).setStrokeStyle(2, ColorStyle.primary.hex[900]))
                .add(this.scene.add.image(0, 0, "").setName(`slotImage${i+1}`))
                .add(UIFactory.createTextBoxDOM(this.scene, `${i+1}`, "l6"), {align: "left-top", expand: false})
            )
        }

        return sizer;
    }
}
