import { ColorStyle, SceneKey } from "../config";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import CircleImage from "../UI/CircleImage";
import ProgressBar from "../UI/ProgressBar";
import CircleImageProgress from "../UI/CircleImageProgress";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";

export default class HUDScene extends Phaser.Scene {

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;
    circleImages: CircleImage[] = [];

    constructor() {
        super(SceneKey.HUDScene);
    }

    create() {
        this.initializeUI();
    }

    private initializeUI() {
        // ----- Menu Button ------
        let menuButton = UIFactory.createButton(this, "Menu", 50, 50, "small", () => {console.log("menu onclick")});
        menuButton.setPosition(60, 30);

        // ----- Artifacts Display -------
        let artifactSizer = this.rexUI.add.fixWidthSizer({
            width: this.game.scale.width * (3/5),
            anchor: {
                left: 'left+120',
                top: 'top+10',
            },
            space: {
                item: 5,
                line: 5,
            },
        })
        for(let i = 0; i < 30; i++) {
            artifactSizer.add(this.createArtifactItem());
        }
        artifactSizer.layout();

        artifactSizer.getAllChildren().forEach((child) => {
            if(child instanceof CircleImage) child.updateMaskPosition();
        })


        // ----- Player Info Display ------
        let playerInfoSizer = this.rexUI.add.sizer({
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

        playerInfoSizer.add(statusBarsLevelHotslotSizer);

        let circleImageProgress = new CircleImageProgress(this, {
            radius: 50,
            texture: "",
        })
        this.add.existing(circleImageProgress);
        playerInfoSizer.add(circleImageProgress);

        
        playerInfoSizer.layout();
        
        circleImageProgress.layoutCircleImageProgress();
        

        // ----- Menu popup -----


        // ----- Weapon Upgrades popup -----


        // ----- Party Info popup -----
    }

    private createStatusBars() {
        let healthBar = new ProgressBar(this, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x832F2F,
        });
        
        let manaBar = new ProgressBar(this, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x2F3883,
        });
        
        let xpBar = new ProgressBar(this, {
            progressBarWidth: 200,
            progressBarHeight: 15,
            progressBarMaxValue: 100,
            progressBarValue: 100,
            progressBarColor: 0x7C832F,
        });
        this.add.existing(healthBar);
        this.add.existing(manaBar);
        this.add.existing(xpBar);

        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 5,
            }
        })

        // sizer.add(this.createHotSlots(), {align: "left", expand: true});
        sizer.add(healthBar);
        sizer.add(manaBar);
        sizer.add(xpBar);

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
                    left: 30,
                    right: 30,
                }
            })
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]))
            .add(UIFactory.createTextBoxDOM(this, "10", "p4"), {align: "center-center"})
        )
        sizer.add(this.createHotSlots());
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
                .add(UIFactory.createTextBoxDOM(this, `${i+1}`, "l6"), {align: "left-top", expand: false})
            )
        }

        return sizer;
    }

    private createArtifactItem() {
        let overlapSizer = this.rexUI.add.overlapSizer();
        overlapSizer.add(UIFactory.createCircleImage(this, 0, 0, "", 18).setDisplaySize(36, 36).setName("circleImage"));
        overlapSizer.add(
            this.rexUI.add.overlapSizer({
                space: {
                    left: 5,
                    right: 5,
                }
            })
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 30, 10, 5, ColorStyle.primary.hex[900]))
            .add(UIFactory.createTextBoxDOM(this, "1", "l6"))
            , {expand: false, align: "right-bottom"}
        )
        return overlapSizer;
    }
}