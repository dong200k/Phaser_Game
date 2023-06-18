import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColorStyle } from "../../config";
import UIFactory from "../UIFactory";
import { Dialog, FixWidthSizer, RoundRectangle, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";


interface SceneWithRexUI extends Phaser.Scene {
    rexUI: UIPlugins;
}

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

/** Creates a Weapon and Artifact Popup Manager that can spawn popups with the displayPopup() method. */
export default class WAPopup {

    private scene: SceneWithRexUI;
    private rexUI: UIPlugins;
    private popup?: Dialog;

    constructor(scene: SceneWithRexUI) {
        this.scene = scene;
        this.rexUI = scene.rexUI;

        // this.displayPopup(this.popupData);
    }

    public displayPopup(data: WAPopupData) {
        if(this.popup) {
            this.popup.destroy();
        }
        this.popup = this.createPopup(data)
            .setVisible(true)
            .layout();
        
        // Set popup initial position.
        this.popup.setPosition(this.scene.game.scale.width - this.popup.width / 2, this.scene.game.scale.height + this.popup.height / 2);
        this.sideDownPopup();
    }

    /** Move the popup so that only the top tab is visible. */
    public sideDownPopup() {
        if(this.popup) {
            let gameWidth = this.scene.game.scale.width;
            let gameHeight = this.scene.game.scale.height;
            this.popup.moveTo(1000, gameWidth - this.popup.width / 2, gameHeight + this.popup.height / 2 - 35, "Back");
        }
    }

    /** Move the popup so that the whole popup is visible. */
    public sideUpPopup() {
        if(this.popup) {
            let gameWidth = this.scene.game.scale.width;
            let gameHeight = this.scene.game.scale.height;
            this.popup.moveTo(1000, gameWidth - this.popup.width / 2, gameHeight - this.popup.height / 2, "Cubic");
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
            width: 600,
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[900]),
            title: this.rexUI.add.fixWidthSizer({
                width: 600,
                height: 33,
                align: "center",
            })
            .setName("waTitleButton")
            .addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[500]).setName("waTitleBackground"))
            .add(UIFactory.createTextBoxDOM(this.scene, data.title ?? "UPGRADES", "h4"), {padding: {top: 15}}),
            actions: data.items?.map((item) => {
                let sizer = this.rexUI.add.sizer({
                    orientation: "vertical",
                    width: 280,
                    space: {
                        item: 15,
                        top: 15,
                        bottom: 10,
                    },
                });
                let sizer2 = this.rexUI.add.sizer({
                    orientation: "vertical",
                    space: {
                        item: 15,
                    }
                })

                if(item.typeName) {
                    if(item.typeName.toLowerCase().includes("weapon")) {
                        sizer2.add(UIFactory.createTextBoxDOM(this.scene, item.typeName, "p6").setColor("#FF9E2D"), {expand: false});
                    } else if(item.typeName.toLowerCase().includes("artifact")) {
                        sizer2.add(UIFactory.createTextBoxDOM(this.scene, item.typeName, "p6").setColor("#2D8EFF"), {expand: false});
                    } else {
                        sizer2.add(UIFactory.createTextBoxDOM(this.scene, item.typeName, "p6").setColor("#2D8EFF"), {expand: false});
                    }
                }

                sizer2.add(UIFactory.createTextBoxDOM(this.scene, item.name?.substring(0, 15), "h5"), {expand: false});

                sizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[500]).setName("waItemBackground"));
                sizer.add(sizer2, {align: "center"});
                sizer.add(this.scene.add.image(0, 0, item.imageKey).setDisplaySize(64, 64), {align: "center"});
                sizer.add(UIFactory.createTextBoxPhaser(this.scene, item.description, "p5").setWordWrapWidth(500, false), {expand: false, align: "center"});

                sizer.setData("onClick", item.onClick);
                return sizer;
            }),
            space: {
                top: 0,
                left: 0,
                bottom: 10,
                right: 0,
                action: 10,
                title: 15,
            },
        })
            .on("button.over", (button: Sizer) => {
                (button.getByName("waItemBackground") as RoundRectangle).setStrokeStyle(1, ColorStyle.neutrals.hex.white);
            })
            .on("button.out", (button: Sizer) => {
                (button.getByName("waItemBackground") as RoundRectangle).setStrokeStyle();
            })
            .on("button.click", (button: Sizer, groupName: string, index: number) => {
                // Hide upgrades. And destroy.
                button.getData("onClick")();
                dialog.moveToDestroyPromise(1000, dialog.x, this.scene.game.scale.height + dialog.height / 2, "Back")
                .then(() => {
                    this.popup = undefined;
                });
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


}