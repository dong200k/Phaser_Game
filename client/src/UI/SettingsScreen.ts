import { ScrollablePanel } from "phaser3-rex-plugins/templates/ui/ui-components";
import { ColorStyle } from "../config";
import SettingsManager from "../system/SettingsManager";
import RexUIBase, { SceneWithRexUI } from "./RexUIBase";
import TextBox from "./TextBox";
import UIFactory from "./UIFactory";
import TextBoxPhaser from "./TextBoxPhaser";

export default class SettingsScreen extends RexUIBase{

    private settingsPanel: ScrollablePanel;

    constructor(scene: SceneWithRexUI, minWidth: number, minHeight: number) {
        super(scene);

        

        // ------- Settings --------
        // ------- Scrollable Screen --------
        let settingsPanel = this.rexUI.add.scrollablePanel({
            // x:this.scene.game.scale.width/2,
            // y:this.scene.game.scale.height/2 + 44,
            width: minWidth,
            height: minHeight,
            panel: {
                child: this.createUI(),
                mask: {
                    padding: 1,
                }
            },
            scrollMode: "vertical",
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, ColorStyle.neutrals.hex[800]),
                adaptThumbSize: true,
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.2
            },
            space: {
                panel: 5
            },
        })
        settingsPanel.layout();
        this.settingsPanel = settingsPanel;
        this.scene.input.setTopOnly(false);


        

        // // ------ Back Button --------
        // let backButton = new Button(this, "Back", this.game.scale.width / 2, 680, "large", () => {
        //     //TODO: Save settings onto database.
        //     SceneManager.getSceneManager().popScene();
        //     let settingsString = JSON.stringify(SettingsManager.getManager().getSettingsAsObject());
        //     window.localStorage.setItem("settings", settingsString);
        // });
        // this.add.existing(backButton);

    }

    public getSettingsPanel() {
        return this.settingsPanel;
    }

    private createUI() {
        // // ------- Title --------
        // let title = UIFactory.createTextBoxPhaser(this.scene, "Settings", "h3");
        // title.setPosition(this.scene.game.scale.width / 2, 150);
        // title.setColor(ColorStyle.neutrals[900]);

        // ------ Audio Settings -------
        let audioSizer = this.rexUI.add.sizer({
            x: this.scene.game.scale.width / 2,
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
        masterVolumeSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Master Volume: ${initialMasterVolumePercent}`).setName("masterVolumeText"), {
            expand: false,
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
                let masterVolumeText = masterVolumeSizer.getByName("masterVolumeText", true) as TextBoxPhaser;
                masterVolumeText.setText(`Master Volume: ${percent}`);
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
        soundEffectsVolumeSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Sound Effects: ${initialSoundEffectsVolumePercent}`).setName("soundEffectsVolumeText"), {
            expand: false,
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
                let soundEffectsVolumeText = soundEffectsVolumeSizer.getByName("soundEffectsVolumeText", true) as TextBoxPhaser;
                soundEffectsVolumeText.setText(`Sound Effects: ${percent}`);
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
        backgroundMusicVolumeSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Background Music: ${initialBackgroundMusicVolumePercent}`).setName("backgroundMusicVolumeText"), {
            expand: false,
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
                let backgroundMusicVolumeText = backgroundMusicVolumeSizer.getByName("backgroundMusicVolumeText", true) as TextBoxPhaser;
                backgroundMusicVolumeText.setText(`Background Music: ${percent}`);
            },
            input: "click",
            value: SettingsManager.getManager().getBackgroundMusicVolume(),
        }))
        audioSizer.add(backgroundMusicVolumeSizer);

        audioSizer.layout();

        return audioSizer;
    }



}