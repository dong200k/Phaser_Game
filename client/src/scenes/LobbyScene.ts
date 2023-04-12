import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../colyseus/ClientManager";
import { SceneKey } from "../config";
import TextBox from "../UI/TextBox";
import Layout from "../UI/Layout";
import TextField from "../UI/TextField";
import Button from "../UI/Button";
import SceneManager from "../system/SceneManager";
import RoomPost from "../UI/RoomPost";


export default class LobbyScene extends Phaser.Scene {
    
    private lobbyRoom?: Colyseus.Room;
    private allRooms: (Colyseus.RoomAvailable | null)[] = [];
    private page: number = 1;
    private roomPosts: RoomPost[] = [];

    //private lobbyConnectionText?: Phaser.GameObjects.Text;
    //private waitingRooms: Phaser.GameObjects.Text[] = [];

    constructor() {
        super(SceneKey.LobbyScene);
    }

    create() {
        this.allRooms = [];
        this.page = 1;

        this.initializeUI();
        this.joinLobby();
        console.log("Menu Sleeping", this.scene.isSleeping(SceneKey.MenuScene));
        console.log("Navbar Sleeping", this.scene.isSleeping(SceneKey.NavbarScene));
        console.log("Lobby Sleeping", this.scene.isSleeping(SceneKey.LoadingScene));
    }

    private initializeUI() {
        let layout = new Layout(this, 10, this.game.scale.width/2, 120);
        layout.setFlexDirection('col');
        // ------ Server Location ------
        let serverLocationText = new TextBox(this, "US Server", "h4");
        layout.add(serverLocationText);
        // ------ Search Field ------
        let searchField = new TextField(this, 0, 0, "small");
        searchField.setLabel("Search with room name:");
        searchField.setLabelVisible(true);
        layout.add(searchField);
        // ------ Room List ------

        for(let i = 0; i < 6; i++) {
            let roomPost = new RoomPost(this, 0, 0);
            this.roomPosts.push(roomPost);
            layout.add(roomPost);
        }
        

        // ------ Back Button ------
        let backButton = new Button(this, "Back", 0, 0, "regular", () => SceneManager.getSceneManager().popScene());
        let hostGameButton = new Button(this, "Host Game", 0, 0, "regular", () => SceneManager.getSceneManager().switchToScene("RoomScene"));
        layout.add([hostGameButton, backButton]);

        
        this.add.existing(layout);
    }

    // private addWaitingRoom(){
    //     console.log("adding waiting room")
    //     let i = this.waitingRooms.length 
    //     this.waitingRooms.push(this.add.text(100, i*30 + 100, ""));
    //     this.waitingRooms[i].setInteractive();
    //     this.waitingRooms[i].on(Phaser.Input.Events.POINTER_UP, () => {
    //         if(this.allRooms.length > i) {
    //             ClientManager.getClient().setWaitingRoomId(this.allRooms[i].roomId);
    //             this.scene.start("RoomScene");
    //         }
    //     })
    // }

    private leaveLobby() {
        this.lobbyRoom?.leave();
        this.lobbyRoom?.removeAllListeners();
        this.allRooms.splice(0, this.allRooms.length);
        console.log("---Leaving lobby---");
    }

    private joinLobby() {
        // Connecting to the server
        // console.log("connecting to the lobby...");
        // this.lobbyConnectionText = this.add.text(this.game.scale.width / 2 - 48, 80, "");
        // this.lobbyConnectionText.setText("connecting to the lobby...");
        ClientManager.getClient().joinLobby().then((room) => {
            this.lobbyRoom = room;
            this.onJoin();
            console.log("Joined Lobby Room!");
        }).catch((e) => {
            console.log("Join Lobby Error: ", e);
        });
    }

    update(deltaT:number) {
        //this.renderWaitingRoom();
    }

    // private renderWaitingRoom() {
    //     this.waitingRooms.forEach((text, idx) => {
    //         text.setText(`Join Room: ${this.allRooms.length > idx ? this.allRooms[idx].roomId : "No Room"}`);
    //     })
    // }

    private updateRoomPost() {
        let numberOfRoomPostPerPage = this.roomPosts.length;
        let start = (this.page - 1) * numberOfRoomPostPerPage;
        this.roomPosts.forEach((roomPost) => {
            roomPost.setRoom(this.allRooms[start]);
            start++;
        })
    }

    private onJoin() {
        if(this.lobbyRoom) {
            this.lobbyRoom.onMessage("rooms", (rooms) => {
                this.allRooms = rooms;
                console.log("All rooms received: ", rooms);
                //while(this.allRooms.length > this.waitingRooms.length) this.addWaitingRoom()
            });

            this.lobbyRoom.onMessage("+", ([roomId, room]) => {
                let idx = this.allRooms.findIndex((r) => r?.roomId === roomId);
                if(idx !== -1) {
                    this.allRooms[idx] = room;
                } else {
                    this.allRooms.push(room);
                }
                console.log("Added/Updated room: ", room);
                this.updateRoomPost();
            });

            this.lobbyRoom.onMessage("-", (roomId: string) => {
                this.allRooms = this.allRooms.filter((r) => r?.roomId !== roomId); // removed
                console.log("Removed Room: ", roomId);
                this.updateRoomPost();
            });

            this.lobbyRoom.onLeave(() => {
                console.log("You have left the lobby");
                this.updateRoomPost();
            });
        } else {
            console.log("Error: Lobby Room is null");
        }
    }
}