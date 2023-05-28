import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../config";
import UIFactory from "./UIFactory";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

interface ConfirmModalConfig {
    description: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
    cancelButtonOnclick?: Function;
    confirmButtonOnclick?: Function;
}

export default class ConfirmModal {
    scene: SceneWithRexUI;
    private dialog: Dialog;
    private defaultInputTopOnly: boolean;

    constructor(scene: SceneWithRexUI, config: ConfirmModalConfig) {
        this.scene = scene;
        this.dialog = this.scene.rexUI.add.dialog({
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]),
            content: this.createModalContent(config),
        })
        this.dialog.setPosition(this.scene.game.scale.width / 2, this.scene.game.scale.height / 2);
        this.dialog.layout();
        this.defaultInputTopOnly = this.scene.input.topOnly;
        this.scene.input.setTopOnly(true); // Makes it so that only the modal can be interacted.
        this.dialog.modalPromise({
            manualClose: true,
        }).then(() => {
            this.scene.input.setTopOnly(this.defaultInputTopOnly);
            this.dialog.destroy();
        })
    }

    public closeModal() {
        this.dialog.modalClose();
    }

    private createModalContent(config: ConfirmModalConfig) {
        let modalContent = this.scene.rexUI.add.fixWidthSizer({
            width: 500,
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
            width: 500, 
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
        descriptionBox.add(UIFactory.createTextBoxPhaser(this.scene, config.description, "p1").setWordWrapWidth(1000));

        modalContent.add(descriptionBox);
        modalContent.addNewLine();

        modalContent.add(UIFactory.createButtonRex(this.scene, {
            text: config.cancelButtonText ?? "Cancel",
            buttonSize: "large",
        }).onClick((click, gameObject, pointer) => {
            if(config.cancelButtonOnclick !== undefined)
                config.cancelButtonOnclick();
            this.closeModal();
        }));

        modalContent.add(UIFactory.createButtonRex(this.scene, {
            text: config.confirmButtonText ?? "Confirm",
            buttonSize: "large",
        }).onClick((click, gameObject, pointer) => {
            if(config.confirmButtonOnclick !== undefined)
                config.confirmButtonOnclick();
            this.closeModal();
        }));

        return modalContent;
    }
}