import { ColorStyle, SceneKey } from "../config";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import ProgressBar from "../UI/ProgressBar";
import MenuModal from "../UI/modals/MenuModal";
import PlayerInfo, { PlayerInfoData } from "../UI/gameuis/PlayerInfo";
import ArtifactDisplay, { ArtifactDisplayData } from "../UI/gameuis/ArtifactDisplay";
import EventManager from "../system/EventManager";

// export enum HUDEvents {
//     HUDPlayerInfoUpdate = "HUDPlayerInfoUpdate",
// }


export type HUDEventsPlayerInfoUpdate = (data: Partial<PlayerInfoData>) => void;

export default class HUDScene extends Phaser.Scene {

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;
    private playerInfoDisplay!: PlayerInfo;
    private artifactDisplay!: ArtifactDisplay;

    constructor() {
        super(SceneKey.HUDScene);
    }

    create() {
        this.initializeUI();
        this.initializeListeners();
        //eventsManager.emit(HUDEvents.HUDPlayerInfoUpdate, HUDEventsCallbacks)
    }

    public updatePlayerInfoData(data: Partial<PlayerInfoData>) {
        if(this.scene.isActive(SceneKey.HUDScene)) this.playerInfoDisplay.updatePlayerInfoData(data);
    }

    public updateArtifactDisplay(data: Partial<ArtifactDisplayData>) {
        if(this.scene.isActive(SceneKey.HUDScene)) this.artifactDisplay.updateArtifactDisplay(data);
    }

    private initializeListeners() {
        EventManager.eventEmitter.on(EventManager.HUDEvents.UPDATE_PLAYER_INFO, this.updatePlayerInfoData, this);
        EventManager.eventEmitter.on(EventManager.HUDEvents.UPDATE_ARTIFACT_DISPLAY, this.updateArtifactDisplay, this);
    }

    private removeListeners() {
        EventManager.eventEmitter.off(EventManager.HUDEvents.UPDATE_PLAYER_INFO, this.updatePlayerInfoData, this);    
        EventManager.eventEmitter.off(EventManager.HUDEvents.UPDATE_ARTIFACT_DISPLAY, this.updateArtifactDisplay, this);
    }

    private initializeUI() {
        // ----- Menu Button ------
        let menuButton = UIFactory.createButton(this, "Menu", 50, 50, "small", () => {
            new MenuModal(this, {
                leaveGameOnclick: () => {
                    EventManager.eventEmitter.emit(EventManager.GameEvents.LEAVE_GAME);
                }
            });
        });
        menuButton.setPosition(60, 30);

        // ----- Artifacts Display -------
        this.artifactDisplay = new ArtifactDisplay(this, {
            items: [
                {
                    imageKey: "demo_hero",
                    level: 2,
                },
                {
                    imageKey: "button_small_active",
                    level: 3,
                }
            ]
        });

        // ----- Player Info Display ------
        this.playerInfoDisplay = new PlayerInfo(this, {
            level: 1,
            specialImageKey: "demo_hero",
        });

        // ----- Weapon Upgrades popup -----

        let upgradeButton = UIFactory.createButton(this, "Upgrade", this.game.scale.width - 60, this.game.scale.height - 30, "small", () => {
            console.log("Upgrade onclick");
        });

        // ----- Party Info popup -----

        let partyPopup = this.createPartyInfoPopup();
        partyPopup.setPosition(this.game.scale.width / 2, this.game.scale.height / 2);
        partyPopup.layout();
        partyPopup.setDepth(100);
        partyPopup.setVisible(false);

        this.input.keyboard?.on("keydown-E", () => partyPopup.setVisible(true));
        this.input.keyboard?.on("keyup-E", () => partyPopup.setVisible(false));
    }

    private createPartyInfoPopup() {
        let fixedWidthSizer = this.rexUI.add.fixWidthSizer({
            width: 500,
        })
        fixedWidthSizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 10, ColorStyle.primary.hex[900]));
        fixedWidthSizer.add(this.createStatusBars());
        return fixedWidthSizer;
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
}