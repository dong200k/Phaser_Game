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
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";

export default class LobbyScene extends Phaser.Scene {
    
    rexUI!: UIPlugins;
    
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
        this.events.on("wake", (sys: Phaser.Scenes.Systems) => {
            this.page = 1;
            this.joinLobby();
        });
        this.events.on("sleep", () => {
            this.leaveLobbyNoSceneChange();
        })
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
        let backButton = new Button(this, "Back to menu", 0, 0, "regular", () => this.leaveLobby());
        let hostGameButton = new Button(this, "Host Game", 0, 0, "regular", () => {
            ClientManager.getClient().clearWaitingRoomId();
            SceneManager.getSceneManager().pushScene("RoomScene");
        });
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

    /** Leaves the lobby room and switches to the GameModeScene. */
    private leaveLobby() {
        if(this.lobbyRoom) {
            this.lobbyRoom.leave();
            this.allRooms.splice(0, this.allRooms.length);
            if(SceneManager.getSceneManager().popScene() === "")
                SceneManager.getSceneManager().switchToScene("GameModeScene");
        }
        this.lobbyRoom = undefined;
    }

    /** Leaves the lobby room. */
    private leaveLobbyNoSceneChange() {
        if(this.lobbyRoom) {
            this.lobbyRoom.leave();
            this.allRooms.splice(0, this.allRooms.length);
        }
        this.lobbyRoom = undefined;
    }

    private joinLobby() {
        // Connecting to the server
        ClientManager.getClient().joinLobby()
        .then((room) => this.onJoin(room))
        .catch((e) => this.handleJoinLobbyError(e))
    }

    // Updates the list of rooms that is displayed on the lobby.
    private updateRoomPost() {
        let numberOfRoomPostPerPage = this.roomPosts.length;
        let start = (this.page - 1) * numberOfRoomPostPerPage;
        this.roomPosts.forEach((roomPost) => {
            roomPost.setRoom(this.allRooms[start]);
            start++;
        })
    }

    private onJoin(room: Colyseus.Room) {

        this.lobbyRoom = room;
        this.lobbyRoom.onMessage("rooms", (rooms) => {
            this.allRooms = rooms;
            this.updateLobbyDisplay();
        });

        this.lobbyRoom.onMessage("+", ([roomId, room]) => {
            // Added/Updated room.
            // First make sure that a room with the same id is not added twice.
            let idx = this.allRooms.findIndex((r) => r?.roomId === roomId);
            if(idx !== -1) {
                this.allRooms[idx] = room;
            } else {
                // Add new room, seaching for empty slots first.
                let added = false;
                for(let i = 0; i < this.allRooms.length; i++) {
                    if(this.allRooms[i] === null) {
                        this.allRooms[i] = room;
                        added = true;
                        i = this.allRooms.length;
                    }
                }
                if(!added) this.allRooms.push(room);
            }
            this.updateLobbyDisplay();
        });

        this.lobbyRoom.onMessage("-", (roomId: string) => {
            // Removed Rooms are marked as null and becomes a vacant slot.
            this.allRooms.forEach((r, idx) => {if(r?.roomId === roomId) this.allRooms[idx] = null}); // flagged as null
            this.updateLobbyDisplay();
        });

        this.lobbyRoom.onLeave((code) => {
            this.updateLobbyDisplay();
            this.leaveLobby();
        });

        this.lobbyRoom.onError((code, message) => {
            this.updateLobbyDisplay();
            this.leaveLobby();
            console.log(`Lobby Error. Code: ${code} Message: ${message}`);
        })
        
    }

    private handleJoinLobbyError(e: any) {
        console.log("Failed to join lobby ", e);
        // TODO: Add a indication that the lobby join failed.
        // new ErrorModal(this, {
        //     description: "Error! Cannot connect to lobby!",
        //     closeOnClick: () => { this.leaveLobby() }
        // })
    }
}