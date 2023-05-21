import Phaser from "phaser";
import { Buttons, Dialog, GridSizer, OverlapSizer, ScrollablePanel, Sizer, Slider } from "phaser3-rex-plugins/templates/ui/ui-components";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import TextBox from "../UI/TextBox";
import Layout from "../UI/Layout";
import SceneManager from "../system/SceneManager";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import TextBoxPhaser from "../UI/TextBoxPhaser";
import UIFactory from "../UI/UIFactory";
import { CreateButton } from "../UI/CustomRexUI";

/*
Planning: 
    role section
    - the avatar of the role should be shown.
    - the avatar of the role can be shown in its idle animation.
    - next to the avatar there should be a short description about the avatar. It's base stats and its weapon.
    - the weapon should also be displayed with a short description and stats as well. 
    - there should be a select button to select the role. 
    - there should be multiple pages that will display all the roles.
    pet selection
    - the player can select their pets as well. 
    - if the player has no pets then they cannot select one.
    - they would be able to purchase a pet directly from the pet selection screen.
    dungeon selection
    - the player can select the dungeon to play in.
*/

interface Stats {
    hp?: number;
    mp?: number;
    attackRange?: number;
    attackSpeed?: number;
    speed?: number;
    attack?: number;
    magicAttack?: number;
    critRate?: number;
    critDamage?: number;
    lifeSteal?: number;
    armor?: number;
    magicResist?: number;
    armorPen?: number;
    magicPen?: number;
}

interface RoomPetModalData {
    name: string;
    imageKey?: string;
    description?: string;
    stats?: Stats;
}

interface RoomRoleModalData {
    name: string;
    imageKey?: string;
    description?: string;
    stats?: Stats;
}

interface RoomDungeonModalData {
    name: string;
    imageKey?: string;
    description?: string;
}

interface RoomModalData {
    petData: RoomPetModalData[];
    roleData: RoomRoleModalData[];
    dungeonData: RoomDungeonModalData[];
}

export default class RoomScene extends Phaser.Scene {
    
    private waitingRoom?: Colyseus.Room;

    private playersInRoomText?: Phaser.GameObjects.Text;
    private playersInRoom: number = 0;
    private roomIDText: TextBox | null = null;

    private selectedRole: string = "";
    private selectedPet: string = "";
    private selectedDungeon: string = "";

    private roomModalData: RoomModalData;


    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;

    constructor() {
        super(SceneKey.RoomScene);
        this.roomModalData = {
            petData:[
                {
                    name: "Baby Dragon",
                    stats: {hp:100}
                },
                {
                    name: "Vampire Bat",
                },
                {
                    name: "Iron Golem",
                },
                {
                    name: "Ice Viper",
                },
                {
                    name: "Lava Slime",
                }
            ],
            roleData: [
                {
                    name: "Warrior", 
                },
                {
                    name: "Priest",
                },
                {
                    name: "Rogue",
                },
                {
                    name: "Wizard",
                },
                {
                    name: "Ranger",
                },
                {
                    name: "Berserker",
                }
            ],
            dungeonData: [
                {
                    name: "Demo Map",
                },
                {
                    name: "Dirt Dungeon",
                },
                {
                    name: "Lava Dungeon",
                }
            ],
        }
    }

    preload() {
        let iconBorder = new Phaser.GameObjects.Graphics(this);
        iconBorder.lineStyle(10, ColorStyle.neutrals.hex[100]);
        iconBorder.strokeRoundedRect(0, 0, 128, 128, 10);
        iconBorder.generateTexture("RoleModalIconBorder", 128, 128);
    }

    create() {
        this.playersInRoom = 0;
        this.initializeUI();
        this.joinRoom();
        this.events.on("sleep", (sys: Phaser.Scenes.Systems) => {
            this.leaveRoom();
        });
        this.events.on("wake", (sys: Phaser.Scenes.Systems) => {
            this.joinRoom();
        });
    }

    private initializeUI() {

        // ---------- roleModal Data ---------- 
        // let roleModalData: RoleModalData = {
        //     roles: [
        //         {
        //             name: "Warrior", 
        //             spriteKey: "blah", 
        //             spriteKeyWeapon: "blah", 
        //             roleDescription: "The Warrior is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.",
        //             roleWeaponDescription: "The Ranger’s Longbow is a prized equipment of the ranger. It is legendary grade and is capable of evolving upon defeating enemies.",
        //             roleStats: "HP: 100, MP: 0, ATTACK: 5",
        //             roleWeaponStats: "ATTACK: 5, ATTACK SPEED: 0.5, ATTACK RANGE: 800"
        //         },
        //         {
        //             name: "Priest", 
        //             spriteKey: "blah", 
        //             spriteKeyWeapon: "blah",
        //             roleDescription: "The priest provides excellent support. They possess a unique skill REVIVE which can heal allies and revive them.",
        //             roleWeaponDescription: "The priest's wand is a reliable tool for those who seeks extra safty.",
        //             roleStats: "HP: 100, MP: 100, ATTACK: 5",
        //             roleWeaponStats: "ATTACK: 2, ATTACK SPEED: 0.5, ATTACK RANGE: 800"
        //         },
        //         {
        //             name: "Rogue", 
        //             spriteKey: "blah", 
        //             spriteKeyWeapon: "blah",
        //             roleDescription: "The Rogue is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.",
        //             roleWeaponDescription: "The Ranger’s Longbow is a prized equipment of the ranger. It is legendary grade and is capable of evolving upon defeating enemies.",
        //             roleStats: "HP: 100, MP: 0, ATTACK: 5",
        //             roleWeaponStats: "ATTACK: 5, ATTACK SPEED: 0.5, ATTACK RANGE: 800"
        //         },
        //         {
        //             name: "Wizard", 
        //             spriteKey: "blah", 
        //             spriteKeyWeapon: "blah",
        //             roleDescription: "The Wizard is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.",
        //             roleWeaponDescription: "The Ranger’s Longbow is a prized equipment of the ranger. It is legendary grade and is capable of evolving upon defeating enemies.",
        //             roleStats: "HP: 100, MP: 0, ATTACK: 5",
        //             roleWeaponStats: "ATTACK: 5, ATTACK SPEED: 0.5, ATTACK RANGE: 800"
        //         },
        //         {
        //             name: "Ranger", 
        //             spriteKey: "blah", 
        //             spriteKeyWeapon: "blah",
        //             roleDescription: "The Ranger is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.",
        //             roleWeaponDescription: "The Ranger’s Longbow is a prized equipment of the ranger. It is legendary grade and is capable of evolving upon defeating enemies.",
        //             roleStats: "HP: 100, MP: 0, ATTACK: 5",
        //             roleWeaponStats: "ATTACK: 5, ATTACK SPEED: 0.5, ATTACK RANGE: 800"
        //         },
        //     ],
        //     selected: 0,
        // };

        // ---------- Room ID -----------
        this.roomIDText = new TextBox(this, "", "p4", ColorStyle.neutrals[900]);
        this.roomIDText.setPosition(24, 24);
        this.roomIDText.setOrigin(0, 0);
        this.add.existing(this.roomIDText);

        // --------- Leave Room Button ----------
        let leaveButton = new Button(this, "Leave room", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());
        let leaveButtonLayout = new Layout(this, {originX: 0, originY: 1, x: 48, y: this.game.scale.height - 48});
        leaveButtonLayout.add(leaveButton);
        this.add.existing(leaveButtonLayout);

        // --------- Other Buttons ------------
        let selectRoleButton = new Button(this, "Select role", 0, 0, "regular", () => {
            // Spawns a new role modal. 
            // new RoomSceneRoleModal(this, (roleName) => { this.selectRole(roleName) }, roleModalData);

            let modal = this.createRoleModal((roleName) => { this.selectRole(roleName) });
            modal.setPosition(this.game.scale.width/2, this.game.scale.height/2);
            modal.layout();
            modal.modalPromise({
                manualClose: true, 
            }).then((data) => {
                console.log(data);
                modal.destroy();
            });
        });
        let selectDungeonButton = new Button(this, "Select dungeon", 0, 0, "regular", () => {console.log("select dungeon onclick")});
        let startButton = new Button(this, "Start", 0, 0, "large", () => {
            this.waitingRoom?.send('start');
        });

        let otherButtonLayout = new Layout(this, {
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 100,
            x: this.game.scale.width / 2,
            y: this.game.scale.height / 2 + 200,
        });
        otherButtonLayout.add([selectRoleButton, startButton, selectDungeonButton]);
        this.add.existing(otherButtonLayout);

        // list of players text
        this.playersInRoomText = this.add.text(this.game.scale.width / 2 - 50, 100, "Players in room: 0");
    }

    /** Called when the user selects a new role from the role modal. */
    private selectRole(roleName: string) {
        console.log("selected: ", roleName);
        this.selectedRole = roleName;
    }

    private createRoleModal(confirmOnClick: (roleName:string) => void) {
        let modal = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[900]),
            content: this.createRoleModalContent(() => {modal.modalClose()}, confirmOnClick),
        })
        return modal;
    }

    private createRoleModalContent(cancelOnClick: () => void, confirmOnClick: (roleName:string) => void) {
        let modalContent = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                left: 20,
                right: 20,
                bottom: 20,
                top: 20,
                item: 20,
            }
        })
        
        // Left content contains the role options and confirm buttons.
        let leftContent = this.rexUI.add.sizer({
            orientation: "vertical",
            space: {
                item: 20
            }
        })
        leftContent.add(this.createOptions(this.roomModalData.roleData));
        leftContent.add(this.createConfirmButtons({
            cancelText: "Cancel",
            confirmText: "Select Role",
            cancelOnclick: cancelOnClick,
            confirmOnclick: confirmOnClick
        }), {align: "right"});

        // Right content contains the role details panel.
        let rightContent = this.rexUI.add.fixWidthSizer({
            width: 620,
            height: 436,
            space: {
                line: 24,
                item: 20,
                left: 40,
                right: 40,
                top: 40,
                bottom: 40
            }
        })
        rightContent.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, ColorStyle.primary.hex[500]));
        rightContent.add(UIFactory.createTextBoxPhaser(this, "Role Name", "h3"));
        rightContent.addNewLine();
        rightContent.add(this.add.image(0, 0, "texture").setDisplaySize(128, 128));
        rightContent.add(UIFactory.createTextBoxPhaser(this, "The Ranger is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.", "p5").setWordWrapWidth(700).setAlign("left"));
        rightContent.addNewLine();
        rightContent.add(UIFactory.createTextBoxPhaser(this, "STATS", "h5"), {padding: {top: 20}})
        rightContent.addNewLine();
        rightContent.add(this.createStatsDisplay({hp: 100, mp: 0, attack: 5, armor: 0}));

        // Swapped left and right content.
        modalContent.add(rightContent);
        modalContent.add(leftContent);
        
        return modalContent;
    }

    private createStatsDisplay(stats: Stats) {
        let hSizer = this.rexUI.add.sizer({
            orientation: "horizontal",
            space: {
                item: 150
            }
        })
        let vSizer1 = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        if(stats.hp !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this, `HP: ${stats.hp}`, "p5"), {align: "left"});
        if(stats.mp !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this, `MP: ${stats.mp}`, "p5"), {align: "left"});
        if(stats.attackRange !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this, `ATTACK RANGE: ${stats.attackRange}`, "p5"), {align: "left"});
        if(stats.attackSpeed !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this, `ATTACK SPEED: ${stats.attackSpeed}`, "p5"), {align: "left"});
        if(stats.speed !== undefined) vSizer1.add(UIFactory.createTextBoxPhaser(this, `MOVEMENT SPEED: ${stats.speed}`, "p5"), {align: "left"});
        hSizer.add(vSizer1, {align: "top"});

        let vSizer2 = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        if(stats.attack !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this, `ATTACK: ${stats.attack}`, "p5"), {align: "left"});
        if(stats.magicAttack !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this, `MAGIC ATTACK: ${stats.magicAttack}`, "p5"), {align: "left"});
        if(stats.critRate !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this, `CRIT RATE: ${stats.critRate}`, "p5"), {align: "left"});
        if(stats.critDamage !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this, `CRIT DAMAGE: ${stats.critDamage}`, "p5"), {align: "left"});
        if(stats.lifeSteal !== undefined) vSizer2.add(UIFactory.createTextBoxPhaser(this, `LIFE STEAL: ${stats.lifeSteal}`, "p5"), {align: "left"});
        hSizer.add(vSizer2, {align: "top"});

        let vSizer3 = this.rexUI.add.sizer({
            orientation: "vertical",
        })
        if(stats.armor !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this, `ARMOR: ${stats.armor}`, "p5"), {align: "left"});
        if(stats.magicResist !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this, `MAGIC RESIST: ${stats.magicResist}`, "p5"), {align: "left"});
        if(stats.armorPen !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this, `ARMOR PEN: ${stats.armorPen}`, "p5"), {align: "left"});
        if(stats.magicPen !== undefined) vSizer3.add(UIFactory.createTextBoxPhaser(this, `MAGIC PEN: ${stats.magicPen}`, "p5"), {align: "left"});
        hSizer.add(vSizer3, {align: "top"});

        return hSizer;
    }

    private createConfirmButtons(config: {cancelText?: string, confirmText?: string, cancelOnclick: Function, confirmOnclick: Function}) {
        let buttons = this.rexUI.add.sizer({
            orientation: "horizontal",
            width: 320,
            height: 60,
            space: {
                item: 30,
            }
        });
        buttons.add(UIFactory.createButtonRex(this, {
            text: config.cancelText,
            buttonSize: "regular",
        }).onClick((click, gameObject, pointer) => {config.cancelOnclick()}));
        buttons.add(UIFactory.createButtonRex(this, {
            text: config.confirmText,
            buttonSize: "regular",
        }).onClick((click, gameObject, pointer) => {config.confirmOnclick()}));
        return buttons;
    }

    /**
     * Create a scrollable options panel to select roles, dungeons, or pets.
     * @returns A ScrollablePanel
     */
    private createOptions(data: {name: string, imageKey?: string}[]) {
        let options = this.rexUI.add.scrollablePanel({
            x: 0,
            y: 0,
            width: 320,
            height: 350,
            scrollMode: "vertical",
            panel: {
                child: this.rexUI.add.buttons({
                    orientation: "vertical",
                    space: {
                        item: 5,
                    },
                    type: "radio",
                    setValueCallback: (button, value, previousValue) => {
                        (button as any).getByName("background", true).setFillStyle(value? ColorStyle.primary.hex[100]:ColorStyle.primary.hex[500]);
                    },
                    name: "optionButtons",
                }),
                mask: {
                    padding: 1,
                    updateMode: 1,
                }
            },
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 0, ColorStyle.primary.hex[500]),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, ColorStyle.neutrals.hex[900]),
                adaptThumbSize: true,
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.15
            },
            space: {
                panel: 5
            }
        })

        let buttons = options.getElement("panel") as Buttons;
        for(let i = 0; i < data.length; i++) {
            buttons.addButton(this.createOptionItem(data[i].name, data[i].imageKey));
        }

        buttons.on("button.click", () => {
                if(options.isInTouching("mask"))
                    console.log(buttons.value);
            })
            .on("button.over", (child: Sizer) => {
                if(options.isInTouching("mask"))
                    (child.getByName("background", true) as any).setStrokeStyle(3, ColorStyle.neutrals.hex.white);
            })
            .on("button.out", (child: Sizer) => {
                (child.getByName("background", true) as any).setStrokeStyle();
            })
        
        options.on("sizer.out", () => {
            console.log("out");
        })

        return options;
    }

    /**
     * Creates an options item Sizer that includes a name and imageKey.
     * @param name The name.
     * @param imageKey The image texture key.
     * @returns A Sizer.
     */
    private createOptionItem(name: string, imageKey: string = "") {
        let itemWraper = this.rexUI.add.sizer({
            name: name,
            width: 300,
            height: 64,
        });

        let item = this.rexUI.add.sizer({
            orientation: "horizontal",
            width: 300,
            height: 64,
            name: "optionItem",
        })
        item.addBackground(this.rexUI.add.roundRectangle(0, 0, 300, 64, 0, ColorStyle.primary.hex[500]).setName("background"));
        item.add(this.add.image(0, 0, imageKey).setDisplaySize(64, 64));
        item.add(UIFactory.createTextBoxPhaser(this, name, "p3").setWordWrapWidth(470).setMaxLines(2), {align: 'top', padding: {left: 10, top: 8}});
        
        itemWraper.add(item);
        return itemWraper;
    }

   

    private updatePlayersInRoom(count: number) {
        this.playersInRoomText?.setText(`Players in room: ${count}`)
    }

    private joinRoom() {
        ClientManager.getClient().joinWaitingRoom().then((room) => {
            this.waitingRoom = room;
            console.log("Joined waiting room");
            this.roomIDText?.setText(`Room ID: ${room.id}`);
            this.onJoin();
        }).catch(e => {
            console.log("Failed to join waiting room ", e);
        });
    }

    private onJoin() {
        this.playersInRoom = 0;
        if(this.waitingRoom) {
            this.waitingRoom.state.players.onAdd = (player:any, key:string) => {
                console.log(player, "added at ", key);
                this.playersInRoom++;
                this.updatePlayersInRoom(this.playersInRoom);
            }
            this.waitingRoom.state.players.onRemove = (player:any, key:string) => {
                console.log(player, "removed at ", key);
                this.playersInRoom--;
                this.updatePlayersInRoom(this.playersInRoom);
            }
            // ------- JOIN GAME MESSAGE FROM SERVER -----------
            this.waitingRoom.onMessage("joinGame", (message) => {
                // Sets the game room Id for the client.
                ClientManager.getClient().setGameRoomId(message);
                this.scene.start('GameScene');
            })
        }
    }

    private leaveRoom() {
        this.waitingRoom?.leave();
        this.waitingRoom?.removeAllListeners();
    }

}


// interface RoleData {
//     name: string;
//     spriteKey: string;
//     spriteKeyWeapon: string;
//     roleDescription: string;
//     roleStats: string;
//     roleWeaponDescription: string;
//     roleWeaponStats: string;
// }

// interface RoleModalData {
//     roles: RoleData[];
//     selected: number;
// }


// class RoomSceneRoleModal {

//     private roleModalData: RoleModalData;
//     private detailsPanel?: GridSizer;
//     private iconBorders: Phaser.GameObjects.Image[] = [];
//     scene: RoomScene;

//     constructor(scene: RoomScene, finishSelectionCallback: (roleName: string) => void, roleModalData: RoleModalData) {
//         this.scene = scene;
//         this.roleModalData = roleModalData;
//         this.initialize(finishSelectionCallback);
//     }

//      /** Creates and shows the role modal. A new role modal is created whenever the user presses the role button. */
//      private initialize(finishSelectionCallback: (roleName: string) => void) {
//         // ------ Create Modal --------
//         let modal = this.scene.rexUI.add.dialog({
//             background: this.scene.rexUI.add.roundRectangle(0,0,720,800,5,ColorStyle.primary.hex[100]),
//             space: {
//                 left: 20,
//                 right: 20,
//                 top: 20,
//                 bottom: 50,
//             },
//         });
//         modal.add(this.createRoleModalContent((roleName) => {
//             finishSelectionCallback(roleName);
//             modal.modalClose();
//         }));
//         modal.setPosition(this.scene.game.scale.width/2, this.scene.game.scale.height/2);
//         modal.layout();
//         modal.modalPromise().then(() => {
//             modal.destroy();
//         }); //Shows the modal.
//         return modal;
//     }

//     private createRoleModalContent(finishSelectionCallback: (roleName: string) => void) {
//         let content = this.scene.rexUI.add.gridSizer({
//             row: 1,
//             column: 2,
//             space: {
//                 column: 50,
//             }
//         });
//         // -------- Left icons ------------
//         content.add(this.scene.rexUI.add.gridSizer({
//             row: this.roleModalData.roles.length,
//             column: 1,
//             createCellContainerCallback: (scene, x, y, config) => {
//                 config.expand = true;
//                 let idx = config.row? config.row : 0;
//                 let iconName = this.roleModalData.roles[idx].name;
//                 let icon = this.createRoleIcons(this.roleModalData.roles[idx].spriteKey, iconName);
//                 // ------ Create a border for the icon --------
//                 let iconBorder = this.scene.add.image(0, 0, "RoleModalIconBorder");
//                 iconBorder.setVisible(false);
//                 this.iconBorders.push(iconBorder);
//                 icon.add(iconBorder);

//                 if(this.roleModalData.selected === idx)
//                     iconBorder.setVisible(true);
                
//                 icon.onClick(() => {
//                     this.roleModalData.selected = idx;
//                     if(this.detailsPanel)
//                         this.updateRoleModalRoleDetails(this.detailsPanel, this.roleModalData.roles[this.roleModalData.selected]);
//                     // Display icon border for selected icon.
//                     this.iconBorders.forEach((ib) => ib.setVisible(false));
//                     iconBorder.setVisible(true);
//                 });
//                 return icon;
//             },
//             space: {
//                 row: 5,
//             }
//         }));
//         // --------- Role Details and Finish Button ------------
//         content.add(this.scene.rexUI.add.gridSizer({
//                 row: 2,
//                 column: 1,
//                 space: {
//                     row: 70,
//                 }
//             })
//             .add(this.createRoleModalRoleDetails(this.roleModalData.roles[this.roleModalData.selected]), {row: 0, column: 0})
//             .add(this.scene.add.existing(new Button(this.scene, "Finish Selection", 0, 0, "large", () => {
//                 finishSelectionCallback(this.roleModalData.roles[this.roleModalData.selected].name);
//             })), {row: 1, column: 0})
//         );
//         return content;
//     }

//     private createRoleModalRoleDetails(data: RoleData) {
//         let detailPanel = this.scene.rexUI.add.gridSizer({
//             row: 5,
//             column: 1,
//             space: {
//                 top: 20,
//                 bottom: 20,
//                 left: 20, 
//                 right: 20,
//                 row: 28,
//             }
//         })
//         .addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 472, 576, 5, ColorStyle.primary.hex[900]));
//         this.updateRoleModalRoleDetails(detailPanel, this.roleModalData.roles[this.roleModalData.selected]);
//         this.detailsPanel = detailPanel;
//         return detailPanel;
//     }

//     private updateRoleModalRoleDetails(detailPanel: GridSizer, roleData: RoleData) {
//         detailPanel.removeAll(true)
//         .add(this.scene.add.existing(new TextBoxPhaser(this.scene, roleData.name, "h3")), {column: 0, row: 0, expand: false, align: "center"})
//         .add(this.createRoleModalImageDescription(roleData.spriteKey, roleData.roleDescription))
//         .add(this.createRoleModalStatDescription(roleData.roleStats))
//         .add(this.createRoleModalImageDescription(roleData.spriteKeyWeapon, roleData.roleWeaponDescription))
//         .add(this.createRoleModalStatDescription(roleData.roleWeaponStats))
//         .layout();
//         detailPanel.setMinWidth(650);
//     }

//     private createRoleModalImageDescription(imageKey: string, description: string) {
//         let content = this.scene.rexUI.add.gridSizer({
//             column: 2,
//             row: 1,
//             space: {
//                 column: 20,
//             }
//         })
//         content.add(this.scene.add.sprite(0, 0, imageKey).setDisplaySize(128, 128), {row: 0, column: 0, expand: false});
//         let text = new TextBoxPhaser(this.scene, description, "p4");
//         text.setWordWrapWidth(900);
//         text.setAlign("left");
//         text.setLineSpacing(5);
//         this.scene.add.existing(text);
//         content.add(text, {column: 1, row: 0, expand: false, align: "top"});
//         return content;
//     }

//     private createRoleModalStatDescription(statData: string) {
//         let content = this.scene.rexUI.add.gridSizer({
//             column: 1,
//             row: 2,
//             space: {
//                 row: 10,
//             }
//         })
//         let title = new TextBoxPhaser(this.scene, "STATS", "h5");
//         this.scene.add.existing(title);
//         content.add(title, {row: 0, column: 0, expand: false, align: "left"});
//         let stats = new TextBoxPhaser(this.scene, statData);
//         this.scene.add.existing(stats);
//         content.add(stats, 0, 1);
//         return content;
//     }

//     private createRoleIcons(spriteKey: string, name: string) {
//         let icon = this.scene.rexUI.add.overlapSizer({
            
//         });
//         icon.add(this.scene.rexUI.add.roundRectangle(0, 0, 128, 128, 5, ColorStyle.primary.hex[900]));

//         // Create icon content.
//         let content = this.scene.rexUI.add.gridSizer({
//             row: 2,
//             column: 1,
//             space: {
//                 row: 0,
                
//                 top: 10,
//                 left: 20,
//             }
//         })
//         content.add(this.scene.add.sprite(0, 0, spriteKey).setDisplaySize(88, 88), 0, 0);
//         let roleName = new TextBoxPhaser(this.scene, name, "l3");
//         this.scene.add.existing(roleName);
//         content.add(roleName);

//         icon.add(content);

//         // iconBorder.strokeRoundedRect(0, 0, 128, 128, 3);
//         //iconBorder.setVisible(false);
//         //this.scene.add.existing(iconBorder);
//         //this.iconBorders.push(iconBorder);
//         //icon.add(this.scene.rexUI.add.);
//         // icon.add(this.scene.add.image(0, 0, "RoleModalIconBorder"));

//         return icon;
//     }

// }

interface DungeonData {
    name: string;
    spriteKey: string;
    description: string;
}

interface DungeonModalData {
    dungeons: DungeonData[];
    selected: number;
}

class RoomSceneDungeonModal {

}