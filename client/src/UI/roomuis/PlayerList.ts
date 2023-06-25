import UIFactory from "../UIFactory";
import { ColorStyle } from "../../config";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import TextBoxRex from "../TextBoxRex";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";

export interface PlayerListItem {
    imageKey?: string;
    name?: string;
    role?: string;
    level?: number;
    status?: string;
}

export interface PlayerListData {
    items: PlayerListItem[];
}

export default class PlayerList extends RexUIBase {
    
    private playerListSizer: Sizer;
    private playerListItems: Sizer[] = [];

    constructor(scene: SceneWithRexUI) {
        super(scene);

        this.playerListSizer = this.rexUI.add.sizer({
            orientation: "vertical",
            width: 350,
            height: 800,
            space: {
                top: 70,
                bottom: 70,
                left: 20,
                right: 20,
                item: 2
            }
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]));

        for(let i = 0; i < 10; i++) {
            let itemSizer = this.createPlayerListItem();
            this.playerListSizer.add(itemSizer);
            this.playerListItems.push(itemSizer);
            itemSizer.setVisible(false);
        }

        this.playerListSizer.layout();
        this.playerListSizer.setPosition(this.scene.game.scale.width - this.playerListSizer.width / 2, this.scene.game.scale.height / 2);
    }

    public hide() {
        this.playerListSizer.moveTo(500, this.scene.game.scale.width + this.playerListSizer.width / 2, this.scene.game.scale.height / 2, "Back");
    }

    public show() {
        this.playerListSizer.moveTo(500, this.scene.game.scale.width - this.playerListSizer.width / 2, this.scene.game.scale.height / 2, "Cubic");
    }

    public getPlayerListSizer() {
        return this.playerListSizer;
    }

    public updatePlayerList(data: PlayerListData) {
        for(let i = 0; i < 10; i++) {
            if(i < data.items.length) {
                this.playerListItems[i].setVisible(true);
                this.updatePlayerListItem(this.playerListItems[i], data.items[i]);
            } else {
                this.playerListItems[i].setVisible(false);
            }
        }
    }

    private updatePlayerListItem(sizer: Sizer, data?: PlayerListItem) {
        if(sizer.name === "playerListItemSizer") {
            (sizer.getByName("playerListItemImage", true) as Phaser.GameObjects.Image).setTexture(data?.imageKey ?? "");
            (sizer.getByName("playerListItemName", true) as TextBoxRex).setText(data?.name ?? "Name");
            (sizer.getByName("playerListItemRole", true) as TextBoxRex).setText(data?.role ?? "Role");
            (sizer.getByName("playerListItemLevel", true) as TextBoxRex).setText(`Level ${data?.level ?? 1}`);
            (sizer.getByName("playerListItemStatus", true) as TextBoxRex).setText(data?.status ?? "");
            sizer.layout();
        }
    }

    private createPlayerListItem(data?: PlayerListItem) {
        let outerSizer = this.rexUI.add.sizer({
            width: 300,
            orientation: "horizontal",
        }).setName("playerListItemSizer");

        outerSizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]));
        outerSizer.add(this.scene.add.image(0, 0, "").setDisplaySize(64, 64).setName("playerListItemImage"));

        let rightSizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                left: 5,
            }
        });

        rightSizer.add(UIFactory.createTextBoxRex(this.scene, "Endsider", "p4").setName("playerListItemName"), {align: "left", expand: false, padding: {bottom: 6}});
        rightSizer.add(UIFactory.createTextBoxRex(this.scene, "Berserker", "p6").setName("playerListItemRole"), {align: "left", expand: false});
        
        let rightInnerSizer = this.rexUI.add.fixWidthSizer({
            width: 236,
            align: "justify",
        });
        
        rightInnerSizer.add(UIFactory.createTextBoxRex(this.scene, "Level 10", "p6").setName("playerListItemLevel"), {padding: {right: 80}});
        rightInnerSizer.add(UIFactory.createTextBoxRex(this.scene, "Ready", "p6").setName("playerListItemStatus"));

        rightSizer.add(rightInnerSizer, {expand: true});

        outerSizer.add(rightSizer);

        this.updatePlayerListItem(outerSizer, data);

        return outerSizer;
    }
}

