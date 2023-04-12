import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import NavButton from "../UI/NavButton";
import { SceneKey } from "../config";
import Button from "../UI/Button";

export default class RoomScene extends Phaser.Scene {
    
    private waitingRoom?: Colyseus.Room;
    //private client: Colyseus.Client;

    private playersInRoomText?: Phaser.GameObjects.Text;
    private playersInRoom: number = 0;

    constructor() {
        super(SceneKey.RoomScene);
        // this.client = Client.getClient().getColyseusClient();
    }

    create() {
        this.playersInRoom = 0;
        this.initializeUI();
        this.joinRoom();
    }

    private initializeUI() {
        let rect = {x: this.game.scale.width / 2, y: 50, width: 200, height: 50, color: 0xAAAAAA}
        let textPos = {x: this.game.scale.width / 2 - 48, y: 42}

        // // leave to lobby button
        // NavButton(this, "Join Lobby", () => {
        //     this.leaveRoom();
        //     this.scene.start('LobbyScene');
        // }, textPos, rect)

        // //start game button
        // NavButton(this, "Start Game", () => {
        //     this.waitingRoom?.send('start')
        // }, {...textPos, y: 142}, {...rect, y: 150})

        let startButton = new Button(this, "Start", 0, 0, "large", () => {
            this.waitingRoom?.send('start');
        })

        this.add.existing(startButton);

        // list of players text
        this.playersInRoomText = this.add.text(this.game.scale.width / 2, 300, "Players in room: 0");
    }

    private updatePlayersInRoom(count: number) {
        this.playersInRoomText?.setText(`Players in room: ${count}`)
    }

    private joinRoom() {
        ClientManager.getClient().joinWaitingRoom().then((room) => {
            this.waitingRoom = room;
            console.log("Joined waiting room");
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
            this.waitingRoom.onMessage("joinGame", (message) => {
                console.log("joinGame message", message);
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