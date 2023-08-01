import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIFactory from "../UI/UIFactory";
import SettingsManager from "../system/SettingsManager";



export default class SettingsScene extends Phaser.Scene {
    
    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;

    private masterVolumeText!: TextBox;
    private soundEffectsVolumeText!: TextBox;
    private backgroundMusicVolumeText!: TextBox;

    constructor() {
        super(SceneKey.SettingsScene)
    }

    create() {
        this.initializeUI();
        this.initializeListeners();
    }

    private initializeUI() {
        // ------- Title --------
        let title = new TextBox(this, "Settings", "h3");
        title.setPosition(this.game.scale.width / 2, 150);
        title.setColor(ColorStyle.neutrals[900]);
        this.add.existing(title);

        // ------- Settings --------
        // ------ Audio Settings -------
        let audioSizer = this.rexUI.add.sizer({
            x: this.game.scale.width / 2,
            y: 300,
            orientation: "vertical",
            space: {
                item: 20,
            }
        })

        // Master Volume
        let masterVolumeSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        let initialMasterVolumePercent = Math.floor(SettingsManager.getManager().getMasterVolume() * 100);
        masterVolumeSizer.add(this.masterVolumeText = UIFactory.createTextBoxDOM(this, `Master Volume: ${initialMasterVolumePercent}`), {
            expand: true,
        });
        masterVolumeSizer.add(this.rexUI.add.slider({
            width: 350,
            height: 20,
            orientation: "horizontal",

            track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
            indicator: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, ColorStyle.neutrals.hex[800]),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, ColorStyle.neutrals.hex[800]),

            valuechangeCallback: (newValue, oldValue, slider) => {
                let percent = Math.floor(newValue * 100);
                SettingsManager.getManager().setMasterVolume(percent / 100);
                this.masterVolumeText.setText(`Master Volume: ${percent}`);
            },
            input: "click",
            value: SettingsManager.getManager().getMasterVolume(),
        }))
        audioSizer.add(masterVolumeSizer);

        // Sound Effects Volume
        let soundEffectsVolumeSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        let initialSoundEffectsVolumePercent = Math.floor(SettingsManager.getManager().getSoundEffectsVolume() * 100);
        soundEffectsVolumeSizer.add(this.soundEffectsVolumeText = UIFactory.createTextBoxDOM(this, `Sound Effects: ${initialSoundEffectsVolumePercent}`), {
            expand: true,
        });
        soundEffectsVolumeSizer.add(this.rexUI.add.slider({
            width: 350,
            height: 20,
            orientation: "horizontal",

            track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
            indicator: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, ColorStyle.neutrals.hex[800]),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, ColorStyle.neutrals.hex[800]),

            valuechangeCallback: (newValue, oldValue, slider) => {
                let percent = Math.floor(newValue * 100);
                SettingsManager.getManager().setSoundEffectsVolume(percent / 100);
                this.soundEffectsVolumeText.setText(`Sound Effects: ${percent}`);
            },
            input: "click",
            value: SettingsManager.getManager().getSoundEffectsVolume(),
        }))
        audioSizer.add(soundEffectsVolumeSizer);

        // Background Music Volume
        let backgroundMusicVolumeSizer = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        let initialBackgroundMusicVolumePercent = Math.floor(SettingsManager.getManager().getBackgroundMusicVolume() * 100);
        backgroundMusicVolumeSizer.add(this.backgroundMusicVolumeText = UIFactory.createTextBoxDOM(this, `Background Music: ${initialBackgroundMusicVolumePercent}`), {
            expand: true,
        });
        backgroundMusicVolumeSizer.add(this.rexUI.add.slider({
            width: 350,
            height: 20,
            orientation: "horizontal",

            track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
            indicator: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, ColorStyle.neutrals.hex[800]),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, ColorStyle.neutrals.hex[800]),

            valuechangeCallback: (newValue, oldValue, slider) => {
                let percent = Math.floor(newValue * 100);
                SettingsManager.getManager().setBackgroundMusicVolume(percent / 100);
                this.backgroundMusicVolumeText.setText(`Background Music: ${percent}`);
            },
            input: "click",
            value: SettingsManager.getManager().getBackgroundMusicVolume(),
        }))
        audioSizer.add(backgroundMusicVolumeSizer);

        audioSizer.layout();

        // ------ Back Button --------
        let backButton = new Button(this, "Back", this.game.scale.width / 2, 680, "large", () => {
            //TODO: Save settings onto database.
            SceneManager.getSceneManager().popScene();
            let settingsString = JSON.stringify(SettingsManager.getManager().getSettingsAsObject());
            window.localStorage.setItem("settings", settingsString);
        });
        this.add.existing(backButton);
    }

    private initializeListeners() {
        // this.events.on("shutdown", () => {
        //     console.log("Settings Scene Shutdown");
        // });
        // this.events.on("sleep", () => {
        //     console.log("Settings Scene Sleep");
        // });
        // this.events.on("wake", () => {
        //     console.log("Settings Scene Wake");
        // });
    }
}