import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import BaseModal, { BaseModalConfig } from "./BaseModal";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

interface ErrorModalConfig extends BaseModalConfig {
    description: string;
    closeOnClick?: Function;
}

/** 
 * The ConfirmModal is used as a popup when there is a yes or no choice required. The modal is automatically displayed on construction.
 * It is also automatically destroyed when the player closes it. Create a new instance for each modal popup.
 */
export default class ErrorModal extends BaseModal {

    constructor(scene: SceneWithRexUI, config: ErrorModalConfig) {
        super(scene, config);
    }

    public closeModal() {
        this.dialog.modalClose();
    }

    protected createDialog(config: ErrorModalConfig): Dialog {
        let dialog = this.scene.rexUI.add.dialog({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.neutrals.hex[800]),
            content: this.createModalContent(config),
        })
        // Error modal should be on top of everything else.
        dialog.setDepth(100000);
        return dialog;
    }

    protected createModalContent(config: ErrorModalConfig) {
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
        
        let descriptionBox = this.scene.rexUI.add.fixWidthSizer({
            width: 530, 
            height: 200,
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                item: 100,
            },
            align: "center",
        });
        descriptionBox.addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]));
        descriptionBox.add(UIFactory.createTextBoxPhaser(this.scene, config.description, "p1").setWordWrapWidth(500));

        modalContent.add(descriptionBox);
        modalContent.addNewLine();

        modalContent.add(UIFactory.createButtonRex(this.scene, {
            text: "Close",
            buttonSize: "large",
        }).onClick((click, gameObject, pointer) => {
            if(config.closeOnClick) config.closeOnClick();
            this.closeModal();
        }));

        return modalContent;
    }
}