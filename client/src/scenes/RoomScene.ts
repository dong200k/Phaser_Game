import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import NavButton from "../UI/NavButton";
import { ColorStyle, SceneKey } from "../config";
import Button from "../UI/Button";
import TextBox from "../UI/TextBox";
import Layout from "../UI/Layout";
import SceneManager from "../system/SceneManager";

export default class RoomScene extends Phaser.Scene {
    
    private waitingRoom?: Colyseus.Room;
    //private client: Colyseus.Client;

    private playersInRoomText?: Phaser.GameObjects.Text;
    private playersInRoom: number = 0;
    private roomIDText: TextBox | null = null;

    constructor() {
        super(SceneKey.RoomScene);
        // this.client = Client.getClient().getColyseusClient();
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
        // let rect = {x: this.game.scale.width / 2, y: 50, width: 200, height: 50, color: 0xAAAAAA}
        // let textPos = {x: this.game.scale.width / 2 - 48, y: 42}

        // // leave to lobby button
        // NavButton(this, "Join Lobby", () => {
        //     this.leaveRoom();
        //     this.scene.start('LobbyScene');
        // }, textPos, rect)

        // //start game button
        // NavButton(this, "Start Game", () => {
        //     this.waitingRoom?.send('start')
        // }, {...textPos, y: 142}, {...rect, y: 150})

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
        let selectRoleButton = new Button(this, "Select role", 0, 0, "regular", () => {console.log("select role button onclick")});
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