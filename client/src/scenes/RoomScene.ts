import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import Layout from "../UI/Layout";
import SceneManager from "../system/SceneManager";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import RoleModal from "../UI/RoleModal";
import PlayerList, { PlayerListData } from "../UI/roomuis/PlayerList";
import RoomInfo from "../UI/roomuis/RoomInfo";
import RPDDisplay from "../UI/roomuis/RPDDisplay";
import type WaitingRoomState from "../../../server/src/rooms/waiting_room/schemas/State";
import ChatBox from "../UI/ChatBox";

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
    
    private waitingRoom?: Colyseus.Room<WaitingRoomState>;

    private playersInRoom: number = 0;

    private selectedRole: number = 0;
    private selectedPet: number = 0;
    private selectedDungeon: number = 0;
    private ready: boolean = false;
    private leader: boolean = false;

    private roomModalData: RoomModalData;
    private playerListData: PlayerListData;

    private playerList!: PlayerList;
    private roomInfo!: RoomInfo;
    private rolePetDungeonDisplay!: RPDDisplay;
    private chatBox!: ChatBox;

    private startGameOrReadyButton!: Button;

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;

    constructor() {
        super(SceneKey.RoomScene);
        this.playerListData = {
            items: []
        }
        this.roomModalData = {
            petData:[
                {
                    name: "Baby Dragon",
                    stats: {hp:100},
                    description: "Volutpat vulputate tellus eget dui molestie tortor vitae. Risus sollicitudin feugiat quam tortor magna dictum scelerisque. Sed cras tincidunt sit pharetra eleifend sem aliquam nibh vitae. Sit enim arcu sed ullamcorper quisque ac ligula sed. Turpis eget et cursus commodo sem. "
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
        // this.events.on("sleep", (sys: Phaser.Scenes.Systems) => {
        //     // this.leaveRoom();
        // });
        this.events.on("wake", (sys: Phaser.Scenes.Systems) => {
            this.joinRoom();
        });
    }

    update(time: number, delta: number): void {
        this.playerList.update();
    }

    public hideDOM() {
        this.children.each((child) => {
            if(child instanceof Phaser.GameObjects.DOMElement) child.setVisible(false);
            
        })
    }

    public showDOM() {
        this.children.each((child) => {
            if(child instanceof Phaser.GameObjects.DOMElement) child.setVisible(true);
        })
    }

    private initializeUI() {

        // --------- Leave Room Button ----------
        let leaveButton = new Button(this, "Leave room", 0, 0, "regular", () => {
            if(SceneManager.getSceneManager().popScene() === "") {
                // If there is no scene to pop return to the main menu.
                SceneManager.getSceneManager().switchToScene(SceneKey.MenuScene);
            }
            this.leaveRoom();
        });
        let leaveButtonLayout = new Layout(this, {x: 80, y: 120});
        leaveButtonLayout.add(leaveButton);
        this.add.existing(leaveButtonLayout);

        // --------- Other Buttons ------------
        let selectRoleButton = new Button(this, "Select role", 0, 0, "regular", () => {
            // Spawns a new role modal. 

            let modal = new RoleModal(this, {
                confirmOnClick: (roleName) => this.selectRole(roleName), 
                roleModalData: {
                    roles: this.roomModalData.roleData, 
                    selected: this.selectedRole,
                },
                type: "Role",
             });
            modal.getDialog().setPosition(this.game.scale.width/2, this.game.scale.height/2);
            modal.getDialog().layout();
            modal.getDialog().modalPromise({
                manualClose: true, 
            }).then(() => {
                modal.getDialog().destroy();
                this.playerList.show();
                this.showChatBox();
            });
            this.playerList.hide();
            this.hideChatBox();
        });
        let selectDungeonButton = new Button(this, "Select dungeon", 0, 0, "regular", () => {
            let modal = new RoleModal(this, {
                confirmOnClick: (dungeonName) => this.selectDungeon(dungeonName), 
                roleModalData: {
                    roles: this.roomModalData.dungeonData, 
                    selected: this.selectedDungeon,
                },
                type: "Dungeon",
             });
            modal.getDialog().setPosition(this.game.scale.width/2, this.game.scale.height/2);
            modal.getDialog().layout();
            modal.getDialog().modalPromise({
                manualClose: true, 
            }).then(() => {
                modal.getDialog().destroy();
                this.playerList.show();
                this.showChatBox();
            });
            this.playerList.hide();
            this.hideChatBox();
        });
        let selectPetButton = new Button(this, "Select pet", 0, 0, "regular", () => {
            let modal = new RoleModal(this, {
                confirmOnClick: (petName) => this.selectPet(petName), 
                roleModalData: {
                    roles: this.roomModalData.petData, 
                    selected: this.selectedPet,
                },
                type: "Pet",
             });
            modal.getDialog().setPosition(this.game.scale.width/2, this.game.scale.height/2);
            modal.getDialog().layout();
            modal.getDialog().modalPromise({
                manualClose: true, 
            }).then(() => {
                modal.getDialog().destroy();
                this.playerList.show();
                this.showChatBox();
            });
            this.playerList.hide();
            this.hideChatBox();
        });
        
        //Layout the select role, select pet, and select dungeon buttons.
        let buttonLayout1 = new Layout(this, {
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 60,
            x: this.game.scale.width / 2 - 140,
            y: this.game.scale.height / 2 + 50,
        });
        buttonLayout1.add([selectRoleButton, selectPetButton, selectDungeonButton]);
        this.add.existing(buttonLayout1);
        
        // --------- Role, Pet and Dungeon Display ----------
        this.rolePetDungeonDisplay = new RPDDisplay(this);


        // --------- Player Listing ----------
        this.playerList = new PlayerList(this);


        // --------- Room Information -----------
        this.roomInfo = new RoomInfo(this, {});

        // --------- Chat Box ----------
        this.chatBox = new ChatBox(this, {
            width: 390,
            height: 200,
        });
        let chatBoxSizer = this.chatBox.getChatBoxSizer();
        chatBoxSizer.setPosition(chatBoxSizer.width/2 + 10, this.game.scale.height - chatBoxSizer.height/2 - 10);
        this.chatBox.setSubmitCallback((value) => {
            this.waitingRoom?.send("playerMessage", value);
        });

        // --------- Start/Ready Button ---------
        this.startGameOrReadyButton = new Button(this, "Ready", 0, 0, "large", () => {
            this.startGameOrReadyButtonOnclick();
        });
        this.startGameOrReadyButton.setPosition(this.game.scale.width - this.startGameOrReadyButton.width / 2 - 175, this.game.scale.height - this.startGameOrReadyButton.height / 2 - 70);
        this.add.existing(this.startGameOrReadyButton);
    }

    /** Slides the chatbox into view. */
    private showChatBox() {
        let chatBoxSizer = this.chatBox.getChatBoxSizer();
        chatBoxSizer.moveTo(500, chatBoxSizer.width/2 + 10, this.game.scale.height - chatBoxSizer.height/2 - 10, "Cubic");
    }

    /** Slides the chatbox out of view. */
    private hideChatBox() {
        let chatBoxSizer = this.chatBox.getChatBoxSizer();
        chatBoxSizer.moveTo(500, -chatBoxSizer.width/2, this.game.scale.height - chatBoxSizer.height/2 - 10, "Back");
    }

    /** Called when the start/ready button has been clicked. */
    private startGameOrReadyButtonOnclick() {
        if(this.leader) {
            this.waitingRoom?.send('start');   
        } else if(this.ready) {
            this.waitingRoom?.send('unready');
        } else {
            this.waitingRoom?.send('ready');
        }
    }

    /** Called when the user selects a new role from the role modal. */
    private selectRole(roleName: string) {
        //console.log("selected: ", roleName);
        this.roomModalData.roleData.forEach((data, idx) => {
            if(data.name === roleName) {
                // this.selectedRole = idx;
                this.waitingRoom?.send("changeRole", idx);
            }
        })
    }

    /** Called when the user selects a new dungeon from the dungeon modal. */
    private selectDungeon(dungeonName: string) {
        //console.log("selected: ", dungeonName);
        this.roomModalData.dungeonData.forEach((data, idx) => {
            if(data.name === dungeonName) {
                // this.selectedDungeon = idx;
                this.waitingRoom?.send("changeDungeon", idx);
            }
        })
    }

    private selectPet(petName: string) {
        //console.log("selected: ", petName);
        this.roomModalData.petData.forEach((data, idx) => {
            if(data.name === petName) {
                // this.selectedPet = idx
                this.waitingRoom?.send("changePet", idx);
            }
        })
    }

    /** Updates the player in room number on the top right of the screen */
    private updatePlayersInRoom(count: number) {
        this.roomInfo.update({playersInRoom: count});
    }

    /** Updates the player list on the left side of the screen.
     * This includes the player's name, role, level, status and role image.
     */
    private updatePlayerList() {
        this.playerList.updatePlayerList(this.playerListData);
    }

    private joinRoom() {
        if(!this.waitingRoom) {
            ClientManager.getClient().joinWaitingRoom().then((room) => {
                this.waitingRoom = room;
                this.roomInfo.update({roomID: room.id});
                this.onJoin();
            }).catch(e => {
                console.log("Failed to join waiting room ", e);
            });
        }
    }

    private onJoin() {
        this.playersInRoom = 0;
        if(this.waitingRoom) {
            this.waitingRoom.state.players.onAdd = (player, key:string) => {

                this.playerListData.items.push({
                    name: player.name,
                    imageKey: "",
                    key: key,
                    level: 1,
                    role: this.roomModalData.roleData[player.role].name,
                    status: player.isLeader ? "Leader": player.isReady ? "Ready" : "",
                })

                this.updatePlayerList();

                player.onChange = () => {
                    //For the player of this client.
                    if(key === this.waitingRoom?.sessionId) {
                        this.leader = player.isLeader;
                        this.ready = player.isReady;
                        this.selectedRole = player.role;
                        this.selectedPet = player.pet;
                        this.rolePetDungeonDisplay.updateDisplay({
                            roleName: this.roomModalData.roleData[this.selectedRole].name,
                            petName: this.roomModalData.petData[this.selectedPet].name,
                        })
                        this.startGameOrReadyButton.setText(this.leader ? "Start Game" : this.ready ? "Unready" : "Ready");
                    }

                    this.playerListData.items.forEach((item) => {
                        if(item.key === key) {
                            item.name = key === this.waitingRoom?.sessionId ? player.name + " (You)": player.name;
                            item.imageKey = "";
                            item.level = player.level;
                            item.role = this.roomModalData.roleData[player.role].name;
                            item.status = player.isLeader ? "Leader": player.isReady ? "Ready" : "";
                        }
                    })
                    //Update PlayerList
                    this.updatePlayerList();
                }

                //console.log(player, "added at ", key);
                this.playersInRoom++;
                this.updatePlayersInRoom(this.playersInRoom);
            }
            this.waitingRoom.state.players.onRemove = (player, key:string) => {
                //console.log(player, "removed at ", key);
                this.playerListData.items = this.playerListData.items.filter((item) => {
                    return item.key !== key;
                })
                this.updatePlayerList();
                this.playersInRoom--;
                this.updatePlayersInRoom(this.playersInRoom);
            }
            // ------- JOIN GAME MESSAGE FROM SERVER -----------
            this.waitingRoom.onMessage("joinGame", (message) => {
                // Sets the game room Id for the client.
                ClientManager.getClient().setGameRoomId(message);
                SceneManager.getSceneManager().pushScene("GameScene");
            })

            this.waitingRoom.onMessage("serverMessage", (message) => {
                this.chatBox.appendText(`[System] ${message}`);
            })

            this.waitingRoom.onMessage("playerMessage", (message) => {
                this.chatBox.appendText(`${message.name}: ${message.message}`);
            })

            this.waitingRoom.onError((code, message) => {
                console.log(`code: ${code}, message: ${message}`);
            })

            this.waitingRoom.state.onChange = () => {
                this.roomInfo.update({
                    maxPlayersInRoom: this.waitingRoom?.state.maxPlayerCount,
                })
                this.selectedDungeon = this.waitingRoom?.state.dungeon ?? this.selectedDungeon;
                this.rolePetDungeonDisplay.updateDisplay({
                    dungeonName: this.roomModalData.dungeonData[this.selectedDungeon].name,
                })
            }
        }
    }

    private clearPlayerListData() {
        while(this.playerListData.items.length > 0) this.playerListData.items.pop();
    }

    private leaveRoom() {
        this.waitingRoom?.leave();
        this.waitingRoom = undefined;
        this.clearPlayerListData();
    }

}