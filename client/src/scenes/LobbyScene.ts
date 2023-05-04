import Phaser from "phaser";
import * as Colyseus from 'colyseus.js';
import ClientManager from "../system/ClientManager";
import { ColorStyle, SceneKey } from "../config";
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
    private pageText: TextBox | null = null; 
    private pageNextButton: Button | null = null;
    private pagePrevButton: Button | null = null;
    private roomPosts: RoomPost[] = [];

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
        this.events.on("sleep", (sys: Phaser.Scenes.Systems) => {
            this.leaveLobby();
        });
        this.events.on("wake", (sys: Phaser.Scenes.Systems) => {
            this.joinLobby();
        });
    }

    private initializeUI() {
        let layout = new Layout(this, {
            x:this.game.scale.width/2,
            y:110,
            gap: 10,
            flexDirection: 'col',
            originY: 0,
        });
        // ------ Server Location ------
        let serverLocationText = new TextBox(this, "US Server", "h3");
        serverLocationText.setColor(ColorStyle.neutrals[900]);
        layout.add(serverLocationText);
        // ------ Search Field ------
        let searchField = new TextField(this, {
            textFieldSize: 'small',
            label: "Search room name:",
            labelVisible: true,
        });
        layout.add(searchField);
        // ------ Room List ------

        for(let i = 0; i < 6; i++) {
            let roomPost = new RoomPost(this, 0, 0);
            this.roomPosts.push(roomPost);
            layout.add(roomPost);
        }

        this.add.existing(layout);

        // ------ Back Button And Host Game Button ------
        let backButton = new Button(this, "Back to menu", 0, 0, "regular", () => SceneManager.getSceneManager().switchToScene("GameModeScene"));
        let hostGameButton = new Button(this, "Host Game", 0, 0, "regular", () => SceneManager.getSceneManager().pushScene("RoomScene"));
        let layout2 = new Layout(this, {
            x:this.game.scale.width / 2 - layout.getLayoutWidth() / 2,
            y:720,
            gap: 18,
            flexDirection: 'row',
            originX: 0,
            originY: 1,
        });
        layout2.add([backButton, hostGameButton]);
        
        this.add.existing(layout2);
        
        // ------ Switching pages layout ------
        this.pageText = new TextBox(this, "Page 1/1000", 'h5');
        this.pageText.setColor(ColorStyle.neutrals[900]);
        this.pageNextButton = new Button(this, "Next", 0, 0, "small", () => this.switchToNextPage());
        this.pagePrevButton = new Button(this, "Prev", 0, 0, "small", () => this.switchToPrevPage());
        let layout3 = new Layout(this, {
            x:this.game.scale.width / 2 + layout.getLayoutWidth() / 2 - this.pageNextButton.getLayoutWidth() / 2,
            y:691,
            gap: 20,
            flexDirection: 'row-reverse',
        });
        layout3.add([this.pageNextButton, this.pagePrevButton]);
        this.pageText.setPosition(this.game.scale.width / 2 + layout.getLayoutWidth() / 2, 650);

        let layout4 = new Layout(this, {
            x:this.game.scale.width / 2 + layout.getLayoutWidth() / 2,
            y:720,
            gap: 10,
            flexDirection: 'col',
            alignItems: 'center',
            originX: 1,
            originY: 1,
        })
        layout4.add([this.pageText, layout3]);
        this.add.existing(layout4);

        this.updateLobbyDisplay();
    }

    private switchToNextPage() {
        let totalPages = Math.floor(this.allRooms.length / this.roomPosts.length) + 1;
        if(this.page < totalPages) this.page += 1;
        this.updateLobbyDisplay();
    }

    private switchToPrevPage() {
        if(this.page > 1) this.page -= 1;
        this.updateLobbyDisplay();
    }

    private updateLobbyDisplay() {
        this.updatePageDisplay();
        this.updateRoomPost();
    }

    private updatePageDisplay() {
        let totalPages = Math.floor(this.allRooms.length / this.roomPosts.length) + 1;
        this.pageText?.setText(`Page ${this.page}/${totalPages}`);
        if(this.page <= 1) this.pagePrevButton?.setButtonActive(false);
        else this.pagePrevButton?.setButtonActive(true);
        if(this.page >= totalPages) this.pageNextButton?.setButtonActive(false);
        else this.pageNextButton?.setButtonActive(true);
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
                this.updateLobbyDisplay();
            });

            this.lobbyRoom.onMessage("+", ([roomId, room]) => {
                let idx = this.allRooms.findIndex((r) => r?.roomId === roomId);
                if(idx !== -1) {
                    this.allRooms[idx] = room;
                } else {
                    this.allRooms.push(room);
                }
                console.log("Added/Updated room: ", room);
                this.updateLobbyDisplay();
            });

            this.lobbyRoom.onMessage("-", (roomId: string) => {
                //this.allRooms = this.allRooms.filter((r) => r?.roomId !== roomId); // removed
                this.allRooms.forEach((r, idx) => {if(r?.roomId === roomId) this.allRooms[idx] = null}); // flagged as null
                console.log("Removed Room: ", roomId);
                this.updateLobbyDisplay();
            });

            this.lobbyRoom.onLeave(() => {
                console.log("You have left the lobby");
                this.updateLobbyDisplay();
            });
        } else {
            console.log("Error: Lobby Room is null");
        }
    }
}