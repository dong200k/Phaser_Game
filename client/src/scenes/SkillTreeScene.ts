import Phaser from "phaser";
import { ColorStyle, SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import UIFactory from "../UI/UIFactory";
import { RoundRectangle, ScrollablePanel, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import ConfirmModal from "../UI/modals/ConfirmModal";
import Node from "../../../server/src/rooms/game_room/schemas/Trees/Node/Node";
import SkillData from "../../../server/src/rooms/game_room/schemas/Trees/Node/Data/SkillData";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";
import PlayerService from "../services/PlayerService";
import SkillItemModal from "../UI/modals/SkillItemModal";
import ButtonRex from "../UI/ButtonRex";
import Button from "../UI/Button";

interface SkillItemLevel {
    value: string;
    cost: number;
    id?: string,
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
        // let playerData = ClientFirebaseConnection.getConnection().playerData
        // if(playerData) {
        //     this.skillTreeData = this.convertSkillTree(playerData.skillTree.root)
        //     console.log("SKILL TREE DATA");
        //     console.log(this.skillTreeData);
        // }
        // else {
            this.skillTreeData = {
                skillItems : [
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
        // }
    }

    /**
     * Converts skill tree to SkillTreeData format. If a skill node has multiple non zero stats shows only the first one.
     */
    convertSkillTree(root: Node<SkillData>){
        let skillItems: SkillItem[] = []

        // Builds one skill item
        function dfs(node: Node<SkillData>, skillItem: SkillItem){
            let nonZeroStat = 0
            Object.entries(node.data.stat).forEach(([key, val])=>{
                if(val > 0){
                    nonZeroStat = val
                }  
            })

            let skillItemLevel = {
                id: node.id,
                cost: node.data.coinCost,
                value: String(nonZeroStat)
            }
            skillItem.levels.push(skillItemLevel)

            if(node.data.status === "selected") skillItem.currentLevel += 1

            node.children.forEach(child=>{
                dfs(child, skillItem)
            })
        }

        // SkillTree has a root node and many branches each of which is a SkillItem
        root.children.forEach((child)=>{
            let skillItem = {
                currentLevel: 0,
                levels: [],
                name: child.data.name
            }

            dfs(child, skillItem)
            skillItems.push(skillItem)
        })

        // console.log("converted skill tree", skillItems)
        return {skillItems}
    }

    create() {
        // Listen for player data changes
        let initPlayerData = (playerData: any)=>{
            if(playerData) this.skillTreeData = this.convertSkillTree(ClientFirebaseConnection.getConnection().playerData.skillTree.root)
            // // this.createOrUpdatePanel()
            // console.log("SKILL TREE DATA");
            // console.log(this.skillTreeData);
        }
        ClientFirebaseConnection.getConnection().addPlayerDataListener("SkillTree", initPlayerData)  

        // Init data in case listener was added after data was loaded
        initPlayerData(ClientFirebaseConnection.getConnection().playerData)


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

    private selectAllUpgrades(skillTreeData: SkillTreeData) {
        let upgrades: string[] = []
        skillTreeData.skillItems.forEach(skillItem=>{
            // Grab upgrades that are not yet selected
            for(let i=skillItem.currentLevel; i<skillItem.levels.length; i++) {
                let id = skillItem.levels[i].id
                if(id) upgrades.push(id)
            }
        })

        // Attempt to upgrade all of them
        let idToken = ClientFirebaseConnection.getConnection().idToken
        if(idToken){
            PlayerService.updatePlayerSkillTree(upgrades, idToken)
                .then(()=>{
                    // Set all items to be max level
                    this.skillTreeData.skillItems.forEach(skillItem=>{
                        skillItem.currentLevel = skillItem.levels.length
                    })
                    this.createOrUpdatePanel();
                    if(this.scrollablePanel) this.scrollablePanel.layout();
                })
                .catch(e=>{
                    alert("Insufficient Coins")
                })
        }
    }

    private removeAllUpgrades(skillTreeData: SkillTreeData) {
        let upgrades: string[] = []
        skillTreeData.skillItems.forEach(skillItem=>{
            // grab upgrades that are selected
            for(let i=skillItem.currentLevel - 1; i>=0; i--){
                let id = skillItem.levels[i].id
                if(id) upgrades.push(id)
            }
        })

        let idToken = ClientFirebaseConnection.getConnection().idToken
        if(idToken){
            PlayerService.unUpgradePlayerSkillTree(upgrades, idToken)
                .then(()=>{
                    this.skillTreeData.skillItems.forEach(skillItem=>{
                        skillItem.currentLevel = 0
                    })
                    this.createOrUpdatePanel();
                    if(this.scrollablePanel) this.scrollablePanel.layout();
                })
                .catch(e=>{
                    alert(e.message)
                })
        }
    }

    private skillItemOnClick(itemName: string) {
        this.skillTreeData.skillItems.forEach((item) => {
            if(item.name === itemName && item.levels.length > item.currentLevel) {
                let idToken = ClientFirebaseConnection.getConnection().idToken
                if(idToken) {
                    let upgrades = [item.levels[item.currentLevel].id as string] // upgrade ids
                    
                    PlayerService.updatePlayerSkillTree(upgrades, idToken)
                        .then(()=>{
                            console.log(`Player spent ${item.levels[item.currentLevel].cost} coins to level up ${itemName}`);
                            item.currentLevel++;
                            this.createOrUpdatePanel();
                            if(this.scrollablePanel) this.scrollablePanel.layout();
                        })
                        .catch(e=>{
                            alert(e.message)
                        })
                }
            }
        })
    }

    private skillUnUpgrade(itemName: string) {
        this.skillTreeData.skillItems.forEach((item) => {
            if(item.name === itemName && item.currentLevel > 0) {
                let idToken = ClientFirebaseConnection.getConnection().idToken
                if(idToken) {
                    let upgrades = [item.levels[item.currentLevel - 1].id as string] // upgrade ids
                    
                    PlayerService.unUpgradePlayerSkillTree(upgrades, idToken)
                        .then(()=>{
                            console.log(`Upgrade removed, gained ${item.levels[item.currentLevel - 1].cost} coins, ${itemName}`);
                            item.currentLevel--;
                            this.createOrUpdatePanel();
                            if(this.scrollablePanel) this.scrollablePanel.layout();
                        })
                        .catch(e=>{
                            alert(e.message)
                        })
                }
            }
        })
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

            // Button to upgrade every skill at once
            let upgradeAllButton = this.createButton("Upgrade All")
            upgradeAllButton
                .layout()
                .setInteractive()
                .on(Phaser.Input.Events.POINTER_UP, () => {
                    let totalCost = 0
                    let totalUpgrades = 0
                    this.skillTreeData.skillItems.forEach(skillItem=>{
                        // Grab upgrades that are not yet selected
                        for(let i=skillItem.currentLevel; i<skillItem.levels.length; i++) {
                            totalCost += skillItem.levels[i].cost
                            totalUpgrades += 1
                        }
                    })
                    if(totalUpgrades === 0){
                        return alert("Skill Tree already maxed out!")
                    }
                    else{
                        new ConfirmModal(this, {
                            cancelButtonText: "Cancel",
                            confirmButtonText: "Confirm",
                            confirmButtonOnclick: ()=>this.selectAllUpgrades(this.skillTreeData),
                            description: `Purchase remaining upgrades for ${totalCost} coins?`,
                        })
                    }
                    
                })
                .on(Phaser.Input.Events.POINTER_OVER, () => {
                    (upgradeAllButton.getByName("background") as RoundRectangle).setStrokeStyle(5, ColorStyle.neutrals.hex.white);
                })
                .on(Phaser.Input.Events.POINTER_OUT, () => {
                    (upgradeAllButton.getByName("background") as RoundRectangle).setStrokeStyle(0, ColorStyle.neutrals.hex.white);
                })

            // Button to remove every skill upgraded
            let unUpgradeAllButton = this.createButton("Remove All Upgrades")
            unUpgradeAllButton
                .layout()
                .setInteractive()
                .on(Phaser.Input.Events.POINTER_UP, () => {
                    let totalRefund = 0
                    let totalUpgradesToRemove = 0
                    this.skillTreeData.skillItems.forEach(skillItem=>{
                        // grab upgrades that are selected
                        for(let i=skillItem.currentLevel - 1; i>=0; i--){
                            totalRefund += skillItem.levels[i].cost
                            totalUpgradesToRemove += 1
                        }
                    })
                    if(totalUpgradesToRemove === 0){
                        return alert("Skill Tree has no upgrades to remove!")
                    }
                    else{
                        new ConfirmModal(this, {
                            cancelButtonText: "Cancel",
                            confirmButtonText: "Confirm",
                            confirmButtonOnclick: ()=>this.removeAllUpgrades(this.skillTreeData),
                            description: `Removes all upgrades currently on the skill tree and receive ${totalRefund} coins?`,
                        })
                    }
                    
                })
                .on(Phaser.Input.Events.POINTER_OVER, () => {
                    (unUpgradeAllButton.getByName("background") as RoundRectangle).setStrokeStyle(5, ColorStyle.neutrals.hex.white);
                })
                .on(Phaser.Input.Events.POINTER_OUT, () => {
                    (unUpgradeAllButton.getByName("background") as RoundRectangle).setStrokeStyle(0, ColorStyle.neutrals.hex.white);
                })
            
            this.panelSizer.add(upgradeAllButton)
            this.panelSizer.add(unUpgradeAllButton)

            this.panelSizer.add(this.createPanelContent());
        } else {
            this.panelSizer.remove(this.panelSizer.getByName("panelContent"), true);
            
            this.panelSizer.add(this.createPanelContent());
        }
        return this.panelSizer;
    }

    /** Creates the main panel where all the upgrades are housed. */
    private createPanelContent() {
        let content = this.rexUI.add.fixWidthSizer({
            width: 1100,
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
                    if(skillItemData.levels.length > skillItemData.currentLevel){
                        let desc = `Do you want to upgrade ${skillItemData.name} to ${skillItemData.levels[skillItemData.currentLevel].value} for ${skillItemData.levels[skillItemData.currentLevel].cost} coins?`
                        if(skillItemData.currentLevel === 0){
                            new ConfirmModal(this, {
                                cancelButtonText: "Cancel",
                                confirmButtonText: "Upgrade",
                                confirmButtonOnclick: () => {this.skillItemOnClick(skillItemData.name)},
                                description: desc,
                            })
                        }else{
                            new SkillItemModal(this, {
                                cancelButtonText: "Cancel",
                                confirmButtonText: "Upgrade",
                                removeButtonText: "Level Down",
                                confirmButtonOnclick: () => {this.skillItemOnClick(skillItemData.name)},
                                removeButtonOnClick: () => this.skillUnUpgrade(skillItemData.name),
                                description: desc,
                            })
                        } 
                    }
                })
                .on(Phaser.Input.Events.POINTER_OVER, () => {
                    if(skillItemData.levels.length > skillItemData.currentLevel)
                        (skillItemUI.getByName("background") as RoundRectangle).setStrokeStyle(5, ColorStyle.neutrals.hex.white);
                })
                .on(Phaser.Input.Events.POINTER_OUT, () => {
                    (skillItemUI.getByName("background") as RoundRectangle).setStrokeStyle(0, ColorStyle.neutrals.hex.white);
                })
            content.add(skillItemUI);
            // if(i % 3 == 2 && i + 1 < totalItems) content.addNewLine();
        }

        return content;
    }

    private createButton(text: string){
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
        textSizer.add(UIFactory.createTextBoxPhaser(this, text, "l4"));
        sizer.add(textSizer)
        verticalSizer.add(sizer)

        verticalSizer

        return verticalSizer
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
        textSizer.add(UIFactory.createTextBoxPhaser(this, skillItem.name.toUpperCase(), "l4").setWordWrapWidth(220).setAlign("left"));
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