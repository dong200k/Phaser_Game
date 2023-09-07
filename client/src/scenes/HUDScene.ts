import { ColorStyle, SceneKey } from "../config";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import ProgressBar from "../UI/ProgressBar";
import MenuModal from "../UI/modals/MenuModal";
import PlayerInfo, { PlayerInfoData } from "../UI/gameuis/PlayerInfo";
import ArtifactDisplay, { ArtifactDisplayData } from "../UI/gameuis/ArtifactDisplay";
import EventManager from "../system/EventManager";
import PeerInfo from "../UI/gameuis/PeerInfo";
import PeerInfoPopup from "../UI/gameuis/PeerInfoPopup";
import WAPopup, { WAPopupData } from "../UI/gameuis/WAPopup";
import GameOverModal from "../UI/modals/GameOverModal";

export default class HUDScene extends Phaser.Scene {

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;
    private playerInfoDisplay!: PlayerInfo;
    private artifactDisplay!: ArtifactDisplay;
    private peerInfoPopup!: PeerInfoPopup;
    private waPopup!: WAPopup;
    private menuModal?: MenuModal;
    private gameOverModal?: GameOverModal;

    constructor() {
        super(SceneKey.HUDScene);
    }

    create() {
        this.initializeUI();
        this.initializeListeners();
    }

    public updatePlayerInfoData(data: Partial<PlayerInfoData>) {
        if(this.scene.isActive(SceneKey.HUDScene)) this.playerInfoDisplay.updatePlayerInfoData(data);
    }

    public updateArtifactDisplay(data: Partial<ArtifactDisplayData>) {
        if(this.scene.isActive(SceneKey.HUDScene)) this.artifactDisplay.updateArtifactDisplay(data);
    }

    public showWAPopup(data: WAPopupData) {
        this.waPopup.displayPopup(data);
    }

    public resetHUD() {
        // Reset the PeerInfoPopup
        this.peerInfoPopup.removeAllPeerInfo();
        if(this.menuModal) this.menuModal.closeModal();
        if(this.gameOverModal) this.gameOverModal.closeModal();
    }

    private initializeListeners() {
        EventManager.eventEmitter.on(EventManager.HUDEvents.UPDATE_PLAYER_INFO, this.updatePlayerInfoData, this);
        EventManager.eventEmitter.on(EventManager.HUDEvents.UPDATE_ARTIFACT_DISPLAY, this.updateArtifactDisplay, this);
        EventManager.eventEmitter.on(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, this.peerInfoPopup.updatePeerInfo, this.peerInfoPopup);
        EventManager.eventEmitter.on(EventManager.HUDEvents.DELETE_PEER_INFO, this.peerInfoPopup.removePeerInfo, this.peerInfoPopup);
        EventManager.eventEmitter.on(EventManager.HUDEvents.RESET_HUD, this.resetHUD, this);
        EventManager.eventEmitter.on(EventManager.HUDEvents.SHOW_WEAPON_ARTIFACT_POPUP, this.showWAPopup, this);
        EventManager.eventEmitter.on(EventManager.HUDEvents.PLAYER_DIED, this.playerDied, this);
        this.events.once("shutdown", () => this.removeListeners());
        this.events.on("sleep", () => this.peerInfoPopup.setVisible(false));
    }

    private removeListeners() {
        EventManager.eventEmitter.off(EventManager.HUDEvents.UPDATE_PLAYER_INFO, this.updatePlayerInfoData, this);    
        EventManager.eventEmitter.off(EventManager.HUDEvents.UPDATE_ARTIFACT_DISPLAY, this.updateArtifactDisplay, this);
        EventManager.eventEmitter.off(EventManager.HUDEvents.CREATE_OR_UPDATE_PEER_INFO, this.peerInfoPopup.updatePeerInfo, this.peerInfoPopup);
        EventManager.eventEmitter.off(EventManager.HUDEvents.DELETE_PEER_INFO, this.peerInfoPopup.removePeerInfo, this.peerInfoPopup);
        EventManager.eventEmitter.off(EventManager.HUDEvents.RESET_HUD, this.resetHUD, this);
        EventManager.eventEmitter.off(EventManager.HUDEvents.SHOW_WEAPON_ARTIFACT_POPUP, this.showWAPopup, this);
    }

    private initializeUI() {
        // ----- Menu Button ------
        let menuButton = UIFactory.createButton(this, "Menu", 50, 50, "small", () => {
            this.menuModal = new MenuModal(this, {
                leaveGameOnclick: () => {
                    this.resetHUD();
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

        // ----- Weapon/Artifact Upgrades popup -----

        this.waPopup = new WAPopup(this);

        // let upgradeButton = UIFactory.createButton(this, "Upgrade", this.game.scale.width - 60, this.game.scale.height - 30, "small", () => {
        //     console.log("Upgrade onclick");
        // });

        

        // ----- Party Info popup -----
        this.peerInfoPopup = new PeerInfoPopup(this);
        this.peerInfoPopup.setVisible(false);
        this.input.keyboard?.on("keydown-SHIFT", () => this.peerInfoPopup.setVisible(true));
        this.input.keyboard?.on("keyup-SHIFT", () => this.peerInfoPopup.setVisible(false));
    }

    public playerDied(data: any) {
        let coins = data?.coins ?? 0;
        let monstersKilledByYou = data?.monstersKilledByYou ?? 0;
        let totalMonstersKilled = data?.totalMonstersKilled ?? 0;
        let timeSurvivedMs = data?.timeSurvivedMs ?? 0;
        this.gameOverModal = new GameOverModal(this, {
            texts: [
                `Coins Earned: ${coins}`,
                `Gems Earned: 0`,
                `Monsters Killed By You: ${monstersKilledByYou}`,
                `Total Monsters Killed: ${totalMonstersKilled}`,
                `Time Survived: ${timeSurvivedMs} ms`,
            ],
            leaveGameOnclick: () => {
                this.resetHUD();
                EventManager.eventEmitter.emit(EventManager.GameEvents.LEAVE_GAME)
                
            },
            spectateOnclick: () => console.log("Spectate onclick")
        })
    }

    
}