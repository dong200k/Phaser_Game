import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import BaseModal, { BaseModalConfig } from "./BaseModal";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

interface MenuModalConfig {
    settingsOnclick?: Function;
    leaveGameOnclick?: Function;
}

export default class MenuModal extends BaseModal {
   
    constructor(scene: SceneWithRexUI, config: MenuModalConfig) {
        super(scene, config);
    }

    protected createDialog(config: BaseModalConfig): Dialog {
        let dialog = this.scene.rexUI.add.dialog({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]).setStrokeStyle(10, ColorStyle.primary.hex[900]),
            content: this.createModalContent(config),
        });
        return dialog;
    }

    protected createModalContent(config: MenuModalConfig) {
        let modalContent = this.scene.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                top: 100, 
                left: 200,
                bottom: 100,
                right: 200,
                item: 150
            },
        });
        
        modalContent.add(UIFactory.createButton(this.scene, "Back", 0, 0, "large", () => {this.closeModal()}));
        modalContent.add(UIFactory.createButton(this.scene, "Settings", 0, 0, "large", () => {
            if(config.settingsOnclick) config.settingsOnclick();
            else console.log("Settings onclick");
        }));
        modalContent.add(UIFactory.createButton(this.scene, "Leave Game", 0, 0, "large", () => {
            if(config.leaveGameOnclick) {
                this.closeModal();
                this.dialog.setVisible(false);
                config.leaveGameOnclick(); 
            }
            else console.log("Leave game onclick");
        }));


        return modalContent;
    }
}