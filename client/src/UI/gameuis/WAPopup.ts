import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import { Dialog, FixWidthSizer, RoundRectangle, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIBase from "../RexUIBase";
import Button from "phaser3-rex-plugins/plugins/button";

export interface WAPopupItem {
    typeName: string;
    name: string;
    imageKey: string;
    description: string;
    onClick: Function;
}

export interface WAPopupData {
    title: string;
    items: WAPopupItem[];
}

/** Creates a Weapon and Artifact Popup Manager that can spawn popups with the displayPopup(...) method. 
 * The player is then able to show or hide the popup and select their upgrades.
*/
export default class WAPopup extends RexUIBase {

    private popup?: Dialog;

    /**
     * Displays a new popup with weapon or artifact upgrade choices.
     * @param data WAPopupData.
     * @example Using the EventManager.
     * ```Typescript
     * EventManager.eventEmitter.emit(EventManager.HUDEvents.SHOW_WEAPON_ARTIFACT_POPUP, {
            title: "LEVEL 1 UPGRADES",
            items: [
                {
                    typeName: "Artifact + 1",
                    name: "Spining Stars",
                    imageKey: "",
                    description: "Surround you with a circle of blades",
                    onClick: () => {console.log("Spining Stars onclick")}
                },
                {
                    typeName: "New Artifact",
                    name: "Gloves",
                    imageKey: "",
                    description: "Increase Damage by 10",
                    onClick: () => {console.log("Gloves onclick")}
                }
            ]
        })
     * ```
     */
    public displayPopup(data: WAPopupData) {
        if(this.popup) {
            this.popup.destroy();
        }
        this.popup = this.createPopup(data)
            .setVisible(true)
            .layout()
            .on("destroy", () => {
                this.popup = undefined;
            });
        
        // Set popup initial position.
        this.popup.setPosition(this.scene.game.scale.width/2, this.scene.game.scale.height + this.popup.height/2);
        this.sideUpPopup();
    }

    /** Returns true if the popup exists and can be shown. False otherwise.
     * Used to update the upgrade_icon from enabled to disabled.
     */
    public isPopupActive() {
        return this.popup !== undefined;
    }

    /** Destroys the popup. This wont destroy this class. Popups can 
     * still be shown with display popup.
     */
    public destroyPopup() {
        if(this.popup) this.popup.destroy();
    }

    /** Move the popup so that only the top tab is visible. */
    public sideDownPopup() {
        if(this.popup) {
            let gameWidth = this.scene.game.scale.width;
            let gameHeight = this.scene.game.scale.height;
            this.popup.moveTo(700, gameWidth/2, gameHeight + this.popup.height/2, "Back");
            this.scene.input.setTopOnly(true);
        }
    }

    /** Move the popup so that the whole popup is visible. */
    public sideUpPopup() {
        if(this.popup) {
            let gameWidth = this.scene.game.scale.width;
            let gameHeight = this.scene.game.scale.height;
            this.popup.moveTo(700, gameWidth/2, gameHeight/2, "Cubic");
            this.scene.input.setTopOnly(false);
        }
    }

    private popupTabOnclick() {
        if(this.popup) {
            let popupDownPosition = this.scene.game.scale.height + this.popup.height / 2;
            if(Math.abs(this.popup.y - popupDownPosition) < 50) { // Manual check too see if the dialog is hidden.
                this.sideUpPopup();
            } else {
                this.sideDownPopup();
            }
        }
        
    }

    private createPopup(data: WAPopupData) {
        let dialog = this.rexUI.add.dialog({
            width: 1000,
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[900]),
            title: this.rexUI.add.fixWidthSizer({
                width: 600,
                height: 33,
                align: "center",
            })
            .setName("waTitleButton")
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[500]).setName("waTitleBackground"))
            .add(UIFactory.createTextBoxDOM(this.scene, data.title ?? "UPGRADES", "h4"), {padding: {top: 6}}),
            content: this.createDialogueContent(data),
            space: {
                top: 0,
                left: 0,
                bottom: 10,
                right: 0,
                action: 10,
                title: 15,
            },
        })

        let titleButton = dialog.getByName("waTitleButton", true) as FixWidthSizer;
        titleButton.on(Phaser.Input.Events.POINTER_OVER, () => {
            (titleButton.getByName("waTitleBackground") as RoundRectangle).setStrokeStyle(1, ColorStyle.neutrals.hex.white);
        })
        titleButton.on(Phaser.Input.Events.POINTER_OUT, () => {
            (titleButton.getByName("waTitleBackground") as RoundRectangle).setStrokeStyle();
        })
        titleButton.onClick(() => {
            (titleButton.getByName("waTitleBackground") as RoundRectangle).setStrokeStyle();
            this.popupTabOnclick();
        })

        return dialog;
    }

    private createDialogueContent(data: WAPopupData) {
        let content = this.rexUI.add.scrollablePanel({
            panel: {
                child: this.createDialogContentItems(data),
                mask: {
                    padding: 1,
                }
            },
            scrollMode: "horizontal",
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, ColorStyle.neutrals.hex[800]),
                adaptThumbSize: true,
                hideUnscrollableSlider: true,
            },
            mouseWheelScroller: {
                focus: false,
                speed: 1
            },
            space: {
                panel: 5,
            },
        })
        return content;
    }

    private createDialogContentItems(data: WAPopupData) {
        let itemButtons = this.rexUI.add.buttons({
            orientation: "horizontal",
            space: {
                item: 10,
                left: 10,
                right: 10,
            },
            click: {
                mode: "pointerup",
                clickInterval: 100,
            },
            buttons: data.items.map((item) => {
                // Create upgrade items.
                let sizer = this.rexUI.add.sizer({
                    orientation: "vertical",
                    width: 314,
                    height: 500,
                    space: {
                        item: 40,
                        top: 26,
                        bottom: 40,
                    },
                });

                // Background of the upgrade items.
                let backgroundSizer = this.rexUI.add.overlapSizer();
                backgroundSizer.add(this.scene.add.image(0, 0, "upgrade_bg").setDisplaySize(314, 500));
                backgroundSizer.add(this.rexUI.add.roundRectangle(0, 0, 314, 500, 0, ColorStyle.primary.hex[500], 0).setName("waItemBackground"));
                sizer.addBackground(backgroundSizer);

                // sizer2 includes the upgrade type, upgrade name, and upgrade icon.
                let sizer2 = this.rexUI.add.sizer({
                    orientation: "vertical",
                    space: {
                        item: 8,
                    }
                })
                if(item.typeName) {
                    if(item.typeName.toLowerCase().includes("weapon")) {
                        sizer2.add(UIFactory.createTextBoxPhaser(this.scene, item.typeName, "p6").setColor("#FF9E2D"), {expand: false, align: "center"});
                    } else if(item.typeName.toLowerCase().includes("artifact")) {
                        sizer2.add(UIFactory.createTextBoxPhaser(this.scene, item.typeName, "p6").setColor("#2D8EFF"), {expand: false, align: "center"});
                    } else {
                        sizer2.add(UIFactory.createTextBoxPhaser(this.scene, item.typeName, "p6").setColor("#2D8EFF"), {expand: false, align: "center"});
                    }
                }

                //The item's name will have a max of 2 lines. Around 30 characters.
                sizer2.add(UIFactory.createTextBoxPhaser(this.scene, item.name + "\n\n", "h5").setWordWrapWidth(300).setAlign("center").setMaxLines(2), {expand: false, align: "center"});
                let image = this.scene.add.image(0, 0, item.imageKey).setDisplaySize(64, 64);
                image.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
                sizer2.add(image, {align: "center"});


                sizer.add(sizer2, {align: "center"});
                sizer.add(UIFactory.createTextBoxPhaser(this.scene, item.description, "p5").setWordWrapWidth(250, false), {expand: false, align: "center"});
                sizer.setData("onClick", item.onClick);
                
                return sizer;
            })
        });
        
        itemButtons.layout();
        
        itemButtons 
            .on("button.over", (button: Sizer) => {
                (button.getByName("waItemBackground", true) as RoundRectangle).setStrokeStyle(1, ColorStyle.neutrals.hex.white);
            })
            .on("button.out", (button: Sizer) => {
                (button.getByName("waItemBackground", true) as RoundRectangle).setStrokeStyle();
            })
            .on("button.click", (button: Sizer, groupName: string, index: number) => {
                // Hide upgrades. And destroy.
                button.getData("onClick")();
                if(this.popup) {
                    this.popup.moveToDestroyPromise(1000, this.popup.x, this.scene.game.scale.height + this.popup.height / 2, "Back")
                    .then(() => {
                        this.popup = undefined;
                    });
                }
            })

        return itemButtons;
    }

}