import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import TextBox from "../UI/TextBox";
import Layout from "../UI/Layout";
import SceneManager from "../system/SceneManager";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import RoleModal from "../UI/RoleModal";

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

    private selectedRole: number = 0;
    private selectedPet: number = 0;
    private selectedDungeon: number = 0;

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
            });
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
            });
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
            });
        });
        let startButton = new Button(this, "Start", 0, 0, "large", () => {
            this.waitingRoom?.send('start');
        });

        let otherButtonLayout = new Layout(this, {
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 70,
            x: this.game.scale.width / 2,
            y: this.game.scale.height / 2 + 200,
        });
        otherButtonLayout.add([selectRoleButton, selectPetButton, selectDungeonButton, startButton]);
        this.add.existing(otherButtonLayout);

        // list of players text
        this.playersInRoomText = this.add.text(this.game.scale.width / 2 - 50, 100, "Players in room: 0");
    }

    /** Called when the user selects a new role from the role modal. */
    private selectRole(roleName: string) {
        console.log("selected: ", roleName);
        this.roomModalData.roleData.forEach((data, idx) => {
            if(data.name === roleName) this.selectedRole = idx;
        })
    }

    /** Called when the user selects a new dungeon from the dungeon modal. */
    private selectDungeon(dungeonName: string) {
        console.log("selected: ", dungeonName);
        this.roomModalData.dungeonData.forEach((data, idx) => {
            if(data.name === dungeonName) this.selectedDungeon = idx;
        })
    }

    private selectPet(petName: string) {
        console.log("selected: ", petName);
        this.roomModalData.petData.forEach((data, idx) => {
            if(data.name === petName) this.selectedPet = idx;
        })
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