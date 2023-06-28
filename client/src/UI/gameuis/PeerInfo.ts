import { OverlapSizer, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../../config";
import ProgressBar from "../ProgressBar";
import CircleImageProgress from "../CircleImageProgress";
import UIFactory from "../UIFactory";
import TextBox from "../TextBox";
import CircleImage from "../CircleImage";
import TextBoxPhaser from "../TextBoxPhaser";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";

interface PeerInfoDataArtifact {
    imageKey: string;
    level: number;
}


export interface PeerInfoData {
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
    specialCooldownPercent: number;
    specialImageKey: string;
    name: string;
    roleImageKey: string;
    // artifacts: PeerInfoDataArtifact[];
}

/** 
 * The PeerInfo contains information of a player similar to PlayerInfo. The PeerInfo however is 
 * displayed on the PeerInfoPopup.
*/
export default class PeerInfo extends RexUIBase {
    private peerInfoSizer: Sizer; 
    private peerInfoData: PeerInfoData;

    //UI Items
    private levelTextBox!: TextBox;
    private hotSlotSizer!: Sizer; 
    private hpBar!: ProgressBar;
    private mpBar!: ProgressBar;
    private xpBar!: ProgressBar;
    private specialDisplay!: CircleImageProgress;
    private roleImage!: Phaser.GameObjects.Image;
    private nameText!: TextBoxPhaser;

    private artifactItems: OverlapSizer[] = [];


    constructor(scene: SceneWithRexUI, config: Partial<PeerInfoData>) {
        super(scene);
        this.peerInfoData = {
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
            specialCooldownPercent: 0,
            specialImageKey: "",
            name: "Unnamed",
            roleImageKey: "",
            //artifacts: []
        }
        Object.assign(this.peerInfoData, config);

        this.peerInfoSizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 5,
                left: 5,
                right: 5,
                top: 5,
                bottom: 5,
            },
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 3, ColorStyle.primary.hex[500]));
        
        let topHalf = this.createPeerInfoTopHalf();
        this.peerInfoSizer.add(topHalf);

        // let bottomHalf = this.createPeerInfoBottomHalf();
        // this.peerInfoSizer.add(bottomHalf, {align: "left"});

        
        this.peerInfoSizer.layout();
        this.updatePeerInfoData({});
    }

    /**
     * Updates this peer info based on the current stored data.
     * @param data PeerInfoData to update.
     */
    public updatePeerInfoData(data: Partial<PeerInfoData>) {
        Object.assign(this.peerInfoData, data);

        // Update Level counter
        if(data.level !== undefined) this.levelTextBox.setText(`${this.peerInfoData.level}`);

        // Update Role Image
        this.roleImage.setTexture(this.peerInfoData.roleImageKey ?? "");

        // Update Name
        if(data.name !== undefined) this.nameText.setText(this.peerInfoData.name);

        // Update Item slots
        let image1 = this.hotSlotSizer.getByName("slotImage1", true) as Phaser.GameObjects.Image;
        let image2 = this.hotSlotSizer.getByName("slotImage2", true) as Phaser.GameObjects.Image;
        let image3 = this.hotSlotSizer.getByName("slotImage3", true) as Phaser.GameObjects.Image;
        image1.setTexture(this.peerInfoData.slot1ItemKey);
        image2.setTexture(this.peerInfoData.slot2ItemKey);
        image3.setTexture(this.peerInfoData.slot3ItemKey);

        // Update Status bars
        this.hpBar.setProgressBarMaxValue(this.peerInfoData.maxHpValue);
        this.hpBar.setProgressBarValue(this.peerInfoData.hpValue);
        this.hpBar.setProgressBarTextVisible(this.peerInfoSizer.visible);
        this.mpBar.setProgressBarMaxValue(this.peerInfoData.maxMpValue);
        this.mpBar.setProgressBarValue(this.peerInfoData.mpValue);
        this.mpBar.setProgressBarTextVisible(this.peerInfoSizer.visible);
        this.xpBar.setProgressBarMaxValue(this.peerInfoData.maxXpValue);
        this.xpBar.setProgressBarValue(this.peerInfoData.xpValue);

        // Update Special circle
        this.specialDisplay.setProgressImage(this.peerInfoData.specialImageKey);
        this.specialDisplay.setProgressPercent(this.peerInfoData.specialCooldownPercent);
        this.specialDisplay.layoutCircleImageProgress();

        this.peerInfoSizer.layout();

        this.peerInfoSizer.getAllChildren().forEach((child) => {
            if(child instanceof CircleImage) child.updateMask();
        })
    }

    public getPeerInfoSizer() {
        return this.peerInfoSizer;
    }

    private createPeerInfoBottomHalf() {
        let sizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 2,
            }
        })

        for(let i = 0; i < 20; i++) {
            let item = this.createArtifactItem({imageKey: "", level: 10});
            this.artifactItems.push(item);
            sizer.add(item);
        }

        return sizer;
    }

    private createArtifactItem(data: {imageKey: string, level: number}) {
        let radius = 8;
        let overlapSizer = this.rexUI.add.overlapSizer();
        overlapSizer.add(UIFactory.createCircleImage(this.scene, 0, 0, data.imageKey, radius).setDisplaySize(radius * 2, radius * 2).setName("circleImage"));
        overlapSizer.add(
            this.rexUI.add.overlapSizer({})
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 30, 30, 5, ColorStyle.primary.hex[900]))
            .add(UIFactory.createTextBoxDOM(this.scene, `${data.level}`, "l6").setName("levelText"))
            , {expand: false, align: "right-bottom"}
        )
        return overlapSizer;
    }

    /** The top half consist of the role image, player name, status bars, special icon, and hotslots. */
    private createPeerInfoTopHalf() {
        let sizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 5,
            }
        })

        sizer.add(this.createPeerIconAndLevel());
        sizer.add(this.createPeerNameAndStatusBars());
        sizer.add(this.createSpecialAndHotSlots());

        return sizer;
    }

    private createPeerIconAndLevel() {
        let overlapSizer = this.rexUI.add.overlapSizer();
        overlapSizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 3, ColorStyle.primary.hex[900]));
        this.roleImage = this.scene.add.image(0, 0, this.peerInfoData.roleImageKey);
        this.roleImage.setDisplaySize(64, 64);
        overlapSizer.add(this.roleImage);
        overlapSizer.add(
            this.rexUI.add.overlapSizer({
                space: {
                    left: 5,
                    right: 5,
                }
            })
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 30, 10, 5, ColorStyle.primary.hex[900]))
            .add((this.levelTextBox = UIFactory.createTextBoxDOM(this.scene, `5`, "l6")).setName("levelText"))
            , {expand: false, align: "right-bottom"}
        )
        return overlapSizer;
    }

    private createPeerNameAndStatusBars() {
        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 5,
            }
        });

        sizer.add((this.nameText = UIFactory.createTextBoxPhaser(this.scene, "Endsider", "p5")), {align: "left"});
        sizer.add(this.createStatusBars());

        return sizer;
    }

    private createSpecialAndHotSlots() {
        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 6
            }
        })

        this.specialDisplay = new CircleImageProgress(this.scene, {
            radius: 12,
            texture: "",
            createText: false,
        })
        
        sizer.add(this.specialDisplay, {align: "right-top"});
        this.scene.add.existing(this.specialDisplay);

        sizer.add((this.hotSlotSizer = this.createHotSlots()));

        return sizer;
    }

    private createStatusBars() {
        this.hpBar = new ProgressBar(this.scene, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x832F2F,
            progressBarPhaserText: true,
        });
        
        this.mpBar = new ProgressBar(this.scene, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x2F3883,
            progressBarPhaserText: true,
        });
        
        this.xpBar = new ProgressBar(this.scene, {
            progressBarWidth: 200,
            progressBarHeight: 8,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x7C832F,
            progressBarCreateText: false
        });

        this.xpBar.setProgressBarTextVisible(false);

        this.scene.add.existing(this.hpBar);
        this.scene.add.existing(this.mpBar);
        this.scene.add.existing(this.xpBar);

        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 3,
            }
        })

        // sizer.add(this.createHotSlots(), {align: "left", expand: true});
        sizer.add(this.hpBar);
        sizer.add(this.mpBar);
        sizer.add(this.xpBar);

        return sizer;
    }

    private createHotSlots() {
        let sizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 1,
            }
        })

        for(let i = 0; i < 3; i++) {
            sizer.add(
                this.rexUI.add.overlapSizer()
                .add(this.rexUI.add.roundRectangle(0, 0, 22, 22, 0, 0, 0).setStrokeStyle(2, ColorStyle.primary.hex[900]))
                .add(this.scene.add.image(0, 0, "").setName(`slotImage${i+1}`))
            )
        }

        return sizer;
    }
}
