import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import { RoundRectangle, ScrollablePanel, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import ConfirmModal from "../UI/ConfirmModal";

interface RoleItem {
    name: string;
    spriteKey?: string;
    description?: string;
    cost?: number;
    purchased?: boolean;
}

interface RoleData {
    roleItems: RoleItem[];
}

export default class RoleScene extends Phaser.Scene {
    
    rexUI!: UIPlugins; 
    private roleData: RoleData;
    private scrollablePanel?: ScrollablePanel;
    private panelSizer?: Sizer;

    constructor() {
        super(SceneKey.RoleScene);
        this.roleData = {
            roleItems: [
                {
                    name: "Ranger",
                    spriteKey: "demo_hero",
                    description: "The Ranger is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.",
                    cost: 1000,
                    purchased: true,
                },
                {
                    name: "Warrior",
                    spriteKey: "",
                    description: "The Warrior is a tank. They possess a unique skill TAUNT which increase defenses and aggro enemies.",
                    cost: 1000,
                    purchased: false,
                },
                {
                    name: "Priest",
                    spriteKey: "",
                    description: "The Priest is a healer. They possess a unique skill HEAL which places an area healing zone.",
                    cost: 1000,
                    purchased: false,
                },
                {
                    name: "Rogue",
                    spriteKey: "",
                    description: "The Rogue is fast. They possess a unique skill DASH which slashes through enemies dealing massive damage.",
                    cost: 1000,
                    purchased: false,
                },
                {
                    name: "Wizard",
                    spriteKey: "",
                    description: "The Wizard is slow. They possess a unique skill BLAST which shoots a massive fireball.",
                    cost: 1000,
                    purchased: false,
                },
                {
                    name: "Berserker",
                    spriteKey: "",
                    description: "The Berserker is mad. They possess a unique skill ENDURE which increases defenses, movement speed and attack speed.",
                    cost: 1000,
                    purchased: false,
                },
            ]
        }
    }

    private roleItemOnClick(roleName: string) {

        //TODO: UNLOCKING ROLE 
        this.roleData.roleItems.forEach((roleItem) => {
            if(roleItem.name === roleName && (roleItem.purchased === false || roleItem.purchased === undefined)) {
                console.log(`Player spent ${roleItem.cost} coins to unlock ${roleName}`);
                roleItem.purchased = true;
            }
        })

        this.createOrUpdatePanel();
        if(this.scrollablePanel) this.scrollablePanel.layout();
    }

    create() {

        // ------- Scrollable Screen --------
        let scrollablePanel = this.rexUI.add.scrollablePanel({
            x:this.game.scale.width/2,
            y:this.game.scale.height/2 + 44,
            width: this.game.scale.width,
            height: this.game.scale.height - 90,
            panel: {
                child: this.createOrUpdatePanel(),
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
            }
        })
        scrollablePanel.layout();
        this.scrollablePanel = scrollablePanel;
        this.input.setTopOnly(false);
    }

    private createOrUpdatePanel() {
        if(this.panelSizer === undefined) {
            this.panelSizer = this.rexUI.add.sizer({
                orientation: "vertical",
                space: {
                    top: 50,
                    bottom: 50,
                    item: 20,
                }
            })
            // ----- Title ------
            let title = UIFactory.createTextBoxPhaser(this, "Roles", "h3");
            title.setColor(ColorStyle.neutrals[900]);
            this.panelSizer.add(title);
            this.panelSizer.add(this.createPanelContent());
        } else {
            this.panelSizer.remove(this.panelSizer.getByName("panelContent"), true);
            this.panelSizer.add(this.createPanelContent());
        }

        return this.panelSizer;
    }

    private createPanelContent() {
        // ----- Content ------
        let content = this.rexUI.add.fixWidthSizer({
            width: 1058,
            space: {
                top: 50, 
                left: 50,
                bottom: 50,
                right: 50,
                line: 30,
            },
            align: "justify-center"
        });
        content.setName("panelContent");
        content.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]));

        let roleItems = this.roleData.roleItems;
        for(let i = 0; i < roleItems.length; i++) {
            let roleItemUI = this.createRoleDisplayItem(roleItems[i]);
            roleItemUI.setInteractive()
                .on(Phaser.Input.Events.POINTER_UP, () => {
                    if(roleItems[i].purchased === false || roleItems[i].purchased === undefined) {
                        let desc = `Are you sure you want to unlock ${roleItems[i].name} for ${roleItems[i].cost} coins?`
                        new ConfirmModal(this, {
                            cancelButtonText: "Cancel",
                            confirmButtonText: "Unlock",
                            confirmButtonOnclick: () => {this.roleItemOnClick(roleItems[i].name)},
                            description: desc,
                        })
                    }
                        
                })
                .on(Phaser.Input.Events.POINTER_OVER, () => {
                    if(roleItems[i].purchased === false || roleItems[i].purchased === undefined)
                        (roleItemUI.getByName("background") as RoundRectangle).setStrokeStyle(5, ColorStyle.neutrals.hex.white);
                })
                .on(Phaser.Input.Events.POINTER_OUT, () => {
                    (roleItemUI.getByName("background") as RoundRectangle).setStrokeStyle(0, ColorStyle.neutrals.hex.white);
                })
            content.add(roleItemUI);
            if(i % 2 === 1 && i + 1 < roleItems.length) content.addNewLine();
        }
        return content;
    }

    private createRoleDisplayItem(roleItem: RoleItem) {
        let sizer = this.rexUI.add.fixWidthSizer({
            width: 450, 
            height: 200,
            space: {
                top: 20,
                left: 20,
                bottom: 20,
                right: 20,
                item: 20,
                line: 20
            },
            align: "left"
        })
        sizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]).setName("background"));
        sizer.add(UIFactory.createTextBoxPhaser(this, roleItem.name, "h5"));
        sizer.addNewLine();
        sizer.add(this.add.image(0, 0, roleItem.spriteKey ?? "").setDisplaySize(128, 128));
        sizer.add(UIFactory.createTextBoxPhaser(this, roleItem.description ?? "", "p5").setWordWrapWidth(470).setAlign("left"));
        sizer.addNewLine();
        if(!roleItem.purchased)
            sizer.add(UIFactory.createTextBoxPhaser(this, `${roleItem.cost ?? 10000} Coins`, "h5"));
        else 
            sizer.add(UIFactory.createTextBoxPhaser(this, "Unlocked", "h5"));
        return sizer;
    }
}