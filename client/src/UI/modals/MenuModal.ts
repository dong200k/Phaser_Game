import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import BaseModal, { BaseModalConfig } from "./BaseModal";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import SettingsScreen from "../SettingsScreen";

interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

interface MenuModalConfig {
    settingsOnclick?: Function;
    leaveGameOnclick?: Function;
}

/**
 * The MenuModal displays a menu popup when the player clicks on the menu button ingame.
 */
export default class MenuModal extends BaseModal {
   
    constructor(scene: SceneWithRexUI, config: MenuModalConfig) {
        super(scene, config);
        this.scene.input.setTopOnly(false);
    }

    protected createDialog(config: BaseModalConfig): Dialog {
        let dialog = this.scene.rexUI.add.dialog({
            background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]).setStrokeStyle(10, ColorStyle.primary.hex[900]),
            content: this.createModalContent(config),
        });
        return dialog;
    }

    protected createModalContent(config: MenuModalConfig) {
        // let modalContent = this.scene.rexUI.add.sizer({
        //     orientation: "vertical",
        //     space: {
        //         top: 100, 
        //         left: 200,
        //         bottom: 100,
        //         right: 200,
        //         item: 150
        //     },
        // });
        
        // modalContent.add(UIFactory.createButton(this.scene, "Back", 0, 0, "large", () => {this.closeModal()}));
        // modalContent.add(UIFactory.createButton(this.scene, "Settings", 0, 0, "large", () => {
        //     if(config.settingsOnclick) config.settingsOnclick();
        //     else console.log("Settings onclick");
        // }));
        // modalContent.add(UIFactory.createButton(this.scene, "Leave Game", 0, 0, "large", () => {
        //     if(config.leaveGameOnclick) {
        //         this.closeModal();
        //         this.dialog.setVisible(false);
        //         config.leaveGameOnclick(); 
        //     }
        //     else console.log("Leave game onclick");
        // }));


        // return modalContent;

        let tabPages = this.scene.rexUI.add.tabPages({
            tabs: { space: { item: 5 } },
            pages: { fadeIn: 100 },
            align: { tabs: "top" },
            space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }
        })
        .on("tab.focus", (tab: any, key: string) => {
            tab.getElement('background').setStrokeStyle(2, ColorStyle.neutrals[100]);
        })
        .on("tab.blur", (tab: any, key: string) => {
            tab.getElement('background').setStrokeStyle();
        });
        
        tabPages.addPage({
            key: "main",
            tab: this.createTab("General"),
            page: this.createGeneralPage(config),
        });
        tabPages.addPage({
            key: "settings",
            tab: this.createTab("Settings"),
            page: this.createSettingsPage(),
        })

        tabPages.layout();
        tabPages.swapFirstPage();

        return tabPages;
    }

    private createTab(text: string) {
        return this.scene.rexUI.add.label({
            width: 120, height: 38,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, ColorStyle.primary.hex[500]),
            text: UIFactory.createTextBoxPhaser(this.scene, text, "p3"),
            space: { left: 10, right: 10, bottom: 10, top: 10 },
            align: "center",
        })
    }

    private createGeneralPage(config: MenuModalConfig) {
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
        // modalContent.add(UIFactory.createButton(this.scene, "Settings", 0, 0, "large", () => {
        //     if(config.settingsOnclick) config.settingsOnclick();
        //     else console.log("Settings onclick");
        // }));
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

    private createSettingsPage() {
        return new SettingsScreen(this.scene, 500, 500).getSettingsPanel();
    }
}