import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import { RoundRectangle, ScrollablePanel, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";

interface SkillItemLevel {
    value: string;
    cost: number;
}

interface SkillItem {
    name: string;
    levels: SkillItemLevel[];
    currentLevel: number;
}

interface SkillTreeData {
    skillItems: SkillItem[];
}

export default class SkillTreeScene extends Phaser.Scene {

    rexUI!: UIPlugins;
    private skillTreeData: SkillTreeData;
    private panelSizer?: Sizer;
    private scrollablePanel?: ScrollablePanel;

    constructor() {
        super(SceneKey.SkillTreeScene);
        this.skillTreeData = {
            skillItems: [
                {
                    name: "Attack speed",
                    currentLevel: 3,
                    levels: [{cost: 100, value: "10%"}, {cost: 200, value: "20%"}, {cost: 500, value: "30%"}]
                },
                {
                    name: "Attack",
                    currentLevel: 0,
                    levels: [{cost: 100, value: "5"}, {cost: 200, value: "10"}, {cost: 300, value: "15"}, {cost: 500, value: "20"}, {cost: 1000, value: "30"}, {cost: 3000, value: "40"}]
                },
                {
                    name: "Movement speed",
                    currentLevel: 3,
                    levels: [{cost: 500, value: "5%"}, {cost: 1000, value: "10%"}, {cost: 5000, value: "15%"}, {cost: 10000, value: "20%"}]
                },
            ]
        }
    }

    create() {

        // ------- Scrollable Screen --------
        let scrollablePanel = this.rexUI.add.scrollablePanel({
            x: this.game.scale.width / 2,
            y: this.game.scale.height / 2 + 44,
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
            },
        })
        scrollablePanel.layout();

        this.scrollablePanel = scrollablePanel;
        this.input.setTopOnly(false);
    }

    private skillItemOnClick(itemName: string) {

        this.skillTreeData.skillItems.forEach((item) => {
            if(item.name === itemName && item.levels.length > item.currentLevel) {
                console.log(`Player spent ${item.levels[item.currentLevel].cost} coins to level up ${itemName}`);
                item.currentLevel++;
            }
        })

        this.createOrUpdatePanel();
        if(this.scrollablePanel) this.scrollablePanel.layout();
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
            });

            // ----- Title ------
            let title = UIFactory.createTextBoxPhaser(this, "Skills", "h3");
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
        let content = this.rexUI.add.fixWidthSizer({
            width: 1058,
            space: {
                top: 50, 
                left: 50,
                bottom: 50,
                right: 50,
                line: 30,
                item: 35,
            },
            align: "center"
        });
        content.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]));
        content.setName("panelContent");

        let totalItems = this.skillTreeData.skillItems.length;
        for(let i = 0; i < totalItems; i++) {
            let skillItemData = this.skillTreeData.skillItems[i];
            let skillItemUI = this.createSkillItem(skillItemData);
            skillItemUI.layout();
            skillItemUI.setInteractive()
                .on(Phaser.Input.Events.POINTER_UP, () => {
                    if(skillItemData.levels.length > skillItemData.currentLevel)
                        this.skillItemOnClick(skillItemData.name);
                })
                .on(Phaser.Input.Events.POINTER_OVER, () => {
                    if(skillItemData.levels.length > skillItemData.currentLevel)
                        (skillItemUI.getByName("background") as RoundRectangle).setStrokeStyle(5, ColorStyle.neutrals.hex.white);
                })
                .on(Phaser.Input.Events.POINTER_OUT, () => {
                    (skillItemUI.getByName("background") as RoundRectangle).setStrokeStyle(0, ColorStyle.neutrals.hex.white);
                })
            content.add(skillItemUI);
            if(i % 3 == 2 && i + 1 < totalItems) content.addNewLine();
        }

        // content.setChildrenInteractive({
        //     click: {
        //         enable: true,
        //         clickInterval: 0.2
        //     },
        //     over: true,
        // });
        // content.on("child.over", () => {
        //     console.log("over");
        // })

        return content;
    }

    private createSkillItem(skillItem: SkillItem) {

        let verticalSizer = this.rexUI.add.sizer({
            width: 290,
            height: 150,
            orientation: 'vertical',
            name: "skillItem"
        })
        verticalSizer.addBackground(this.rexUI.add.roundRectangle(0,0,100,100,0,ColorStyle.primary.hex[500]).setName("background"));

        let sizer = this.rexUI.add.fixWidthSizer({
            width: 290,
            height: 120,
            align: "justify-center",
            space: {
                top: 10, 
                left: 10,
                bottom: 10,
                right: 10,
            }
        });
        

        let textSizer = this.rexUI.add.fixWidthSizer({
            width: 220,
            space: {
                line: 2
            }
        });
        textSizer.add(UIFactory.createTextBoxPhaser(this, skillItem.name.toUpperCase(), "l4"));
        textSizer.addNewLine();
        textSizer.add(UIFactory.createTextBoxPhaser(this, `${skillItem.currentLevel === 0 ? "None" : skillItem.levels[skillItem.currentLevel - 1].value}` , "l4"));
        if(skillItem.currentLevel < skillItem.levels.length)
            textSizer.add(UIFactory.createTextBoxPhaser(this, ` -> ${skillItem.levels[skillItem.currentLevel].value}`, "l4").setColor(ColorStyle.neutrals[200]));
        else 
            textSizer.add(UIFactory.createTextBoxPhaser(this, ` MAXED`, "l4").setColor(ColorStyle.neutrals[200]));

        sizer.add(textSizer);
        sizer.add(this.createVerticalBoxes(skillItem.currentLevel, skillItem.levels.length));
        
        
        verticalSizer.add(sizer);
        if(skillItem.currentLevel < skillItem.levels.length)
            verticalSizer.add(UIFactory.createTextBoxPhaser(this, `${skillItem.levels[skillItem.currentLevel].cost} Coins`, "l4"));

        return verticalSizer;
    }

    private createVerticalBoxes(filled: number, total: number){

        let horizontalSizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 7,
            }
        })

        let sizer = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 7,
            }
        })

        for(let i = 0; i < total; i++) {
            if(i < filled) sizer.add(this.rexUI.add.roundRectangle(0, 0, 11, 11, 0, ColorStyle.neutrals.hex[900]));
            else sizer.add(this.rexUI.add.roundRectangle(0, 0, 11, 11, 0, ColorStyle.neutrals.hex[100]));
            if(i % 5 === 4 && i + 1 < total) {
                horizontalSizer.add(sizer, {align: "top"});
                sizer = this.rexUI.add.sizer({
                    orientation: "vertical",
                    space: {
                        item: 7,
                    }
                });
            }
        }

        horizontalSizer.add(sizer, {align: "top"});

        return horizontalSizer;
    }
}