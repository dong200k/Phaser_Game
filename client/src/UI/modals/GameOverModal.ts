import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import BaseModal, { BaseModalConfig } from "./BaseModal";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

interface GameOverModalConfig extends BaseModalConfig {
    texts: string[];
    title?: string;
    leaveGameOnclick?: Function;
    spectateOnclick?: Function;
    showSpectateButton: boolean;
}

/**
 * The GameOverModal is displayed when the player dies.
 */
export default class GameOverModal extends BaseModal {
    
    constructor(scene: SceneWithRexUI, config: GameOverModalConfig) {
        super(scene, config);
    }

    public closeModal() {
        this.dialog.modalClose();
    }

    protected createDialog(config: GameOverModalConfig): Dialog {
        let dialog = this.scene.rexUI.add.dialog({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]),
            content: this.createModalContent(config),
        })
        return dialog;
    }

    protected createModalContent(config: GameOverModalConfig) {
        let modalContent = this.scene.rexUI.add.fixWidthSizer({
            width: 550,
            space: {
                top: 20, 
                left: 20,
                bottom: 20,
                right: 20,
                line: 20,
            },
            align: "justify-center"
        });
        
        // Displays game over text and summary texts.
        let descriptionBox = this.scene.rexUI.add.sizer({
            width: 530, 
            orientation: "vertical",
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                item: 5,
            },
        });
        descriptionBox.addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]));
        descriptionBox.add(UIFactory.createTextBoxPhaser(this.scene, config.title, "h2"), {padding: {bottom: 20}});
        config.texts.forEach((text) => {
            descriptionBox.add(UIFactory.createTextBoxPhaser(this.scene, text, "p3"));
        })

        modalContent.add(descriptionBox);
        modalContent.addNewLine();

        if(config.showSpectateButton) {
            // Spectate Button
            modalContent.add(UIFactory.createButtonRex(this.scene, {
                text: "Spectate",
                buttonSize: "large",
            }).onClick((click, gameObject, pointer) => {
                if(config.spectateOnclick !== undefined)
                    config.spectateOnclick();
                this.closeModal();
            }));
        }

        // Leave Game Button
        modalContent.add(UIFactory.createButtonRex(this.scene, {
            text: "Leave Game",
            buttonSize: "large",
        }).onClick((click, gameObject, pointer) => {
            if(config.leaveGameOnclick !== undefined)
                config.leaveGameOnclick();
            this.closeModal();
        }));

        return modalContent;
    }
}