import Phaser from "phaser";
import { Dialog, Slider } from "phaser3-rex-plugins/templates/ui/ui-components";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import TextBox from "../UI/TextBox";
import Layout from "../UI/Layout";
import SceneManager from "../system/SceneManager";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import TextBoxPhaser from "../UI/TextBoxPhaser";

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
*/

export default class RoomScene extends Phaser.Scene {
    
    private waitingRoom?: Colyseus.Room;

    private playersInRoomText?: Phaser.GameObjects.Text;
    private playersInRoom: number = 0;
    private roomIDText: TextBox | null = null;

    // Plugin for UI elements that will be injected at scene creation.
    rexUI!: UIPlugins;

    constructor() {
        super(SceneKey.RoomScene);
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
            this.createRoleModal();
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
    }

    /** Creates and shows the role modal. A new role modal is created whenever the user presses the role button. */
    private createRoleModal() {
        let modal = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0,0,720,800,20,ColorStyle.neutrals.hex[400]),
            content: this.createRoleModalContent((roleName) => {
                this.selectRole(roleName);
                modal.modalClose();
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 50,
            },
        });
        modal.setPosition(this.game.scale.width/2, this.game.scale.height/2);
        modal.layout();
        modal.modalPromise({
            clickOutsideClose: true,
        })
        return modal;
    }

    private createRoleModalContent(finishSelectionCallback: (roleName: string) => void) {
        let data = {
            roles: [
                {name: "Warrior", spriteKey: "blah"},
                {name: "Priest", spriteKey: "blah"},
                {name: "Rogue", spriteKey: "blah"},
                {name: "Wizard", spriteKey: "blah"},
                {name: "Ranger", spriteKey: "blah"},
            ]
        }

        let content = this.rexUI.add.gridSizer({
            row: 1,
            column: 2,
            space: {
                column: 50,
            }
        });
        content.add(this.rexUI.add.gridSizer({
            row: 5,
            column: 1,
            createCellContainerCallback: (scene, x, y, config) => {
                config.expand = true;
                let idx = config.row? config.row : 0;
                return this.createRoleIcons(data.roles[idx].spriteKey, data.roles[idx].name);
            },
            space: {
                row: 5,
            }
        }), 0, 0);
        content.add(this.rexUI.add.gridSizer({
                row: 3,
                column: 1,
                space: {
                    row: 20,
                }
            })
            .add(this.add.existing(new TextBoxPhaser(this, "Ranger", "h3")), {column: 0, row: 0, expand: false, align: "center"})
            .add(this.rexUI.add.gridSizer({
                    row: 2,
                    column: 1,
                    space: {
                        row: 70,
                    }
                })
                .add(this.createRoleModalRoleDetails(), 0, 0)
                .add(this.add.existing(new Button(this, "Finish Selection", 0, 0, "large", () => {
                    finishSelectionCallback("Ranger");
                })), {column: 0, row: 1, expand: false})
                .layout(), 0, 1)
            .layout()
        );
        return content;
    }

    private createRoleModalRoleDetails() {
        let detailPanel = this.rexUI.add.gridSizer({
            row: 4,
            column: 1,
            space: {
                top: 20,
                bottom: 20,
                left: 20, 
                right: 20,
                row: 28,
            }
        })
        .addBackground(this.rexUI.add.roundRectangle(0, 0, 472, 576, 5, ColorStyle.primary.hex[900]))
        .add(this.createRoleModalImageDescription())
        .add(this.createRoleModalStatDescription())
        .add(this.createRoleModalImageDescription())
        .add(this.createRoleModalStatDescription());
        return detailPanel;
    }

    private createRoleModalImageDescription() {
        let content = this.rexUI.add.gridSizer({
            column: 2,
            row: 1,
            space: {
                column: 20,
            }
        })
        content.add(this.add.sprite(0, 0, "imagekey").setDisplaySize(128, 128), {row: 0, column: 0, expand: false});
        let text = new TextBoxPhaser(this, "The Ranger is a excellent sniper. They possess a unique skill SNIPER which can penetrate multiple enemies.", "p4");
        text.setWordWrapWidth(900);
        text.setAlign("left");
        text.setLineSpacing(5);
        this.add.existing(text);
        content.add(text, {column: 1, row: 0, expand: false, align: "top"});
        return content;
    }

    private createRoleModalStatDescription() {
        let content = this.rexUI.add.gridSizer({
            column: 1,
            row: 2,
            space: {
                row: 10,
            }
        })
        let title = new TextBoxPhaser(this, "STATS", "h5");
        this.add.existing(title);
        content.add(title, {row: 0, column: 0, expand: false, align: "left"});
        let stats = new TextBoxPhaser(this, "HP: 100, MP: 0, ATTACK: 5, ARMOR: 10, MAGIC RESIST: 0");
        this.add.existing(stats);
        content.add(stats, 0, 1);
        return content;
    }

    private createRoleIcons(spriteKey: string, name: string) {
        let icon = this.rexUI.add.overlapSizer({
            space: {
                top: 5,
                bottom: 5,
                left: 10,
                right: 10,
            }
        });
        icon.addBackground(this.rexUI.add.roundRectangle(0, 0, 128, 128, 5, ColorStyle.primary.hex[900]));

        // Create icon content.
        let content = this.rexUI.add.gridSizer({
            row: 2,
            column: 1,
            space: {
                row: 0,
            }
        })
        content.add(this.add.sprite(0, 0, spriteKey).setDisplaySize(88, 88), 0, 0);
        let roleName = new TextBoxPhaser(this, name, "l3");
        this.add.existing(roleName);
        content.add(roleName);

        icon.add(content);
        icon.layout();
        return icon;
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