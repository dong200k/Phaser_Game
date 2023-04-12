import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import TextBox from './TextBox';
import Layout from './Layout';
import { ColorStyle } from '../config';
import Layoutable from './Layoutable';
import Button from './Button';
import SceneManager from '../system/SceneManager';
import ClientManager from '../colyseus/ClientManager';

/** RoomPost is the UI for a single room posting in the lobby. This should only be used in the LobbyScene not elsewhere. */
export default class RoomPost extends Phaser.GameObjects.Container implements Layoutable {
    
    private room: Colyseus.RoomAvailable | null = null;
    private roomNameText: TextBox;
    private roomPlayerCountText: TextBox;
    private roomStateText: TextBox;
    private background: Phaser.GameObjects.Rectangle;
    private joinButton: Button;

    constructor(scene: Phaser.Scene, x=0, y=0) {
        super(scene, x, y);
        this.roomNameText = new TextBox(this.scene, "Room name: N/A", "l6");
        this.roomPlayerCountText = new TextBox(this.scene, "Player count: 0/0", 'l6');
        this.roomStateText = new TextBox(this.scene, "None", "l6");
        this.roomNameText.setOrigin(0, 0);
        this.roomPlayerCountText.setOrigin(0, 0);
        this.roomStateText.setOrigin(0, 0);

        this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 573, 63, ColorStyle.primary.hex[500]);
        this.background.setStrokeStyle(1, ColorStyle.primary.hex[900]);
        this.add(this.background);

        this.joinButton = new Button(this.scene, 'Join', 0, 0, "small", () => {
            if(this.room) {
                ClientManager.getClient().setWaitingRoomId(this.room.roomId);
                SceneManager.getSceneManager().switchToScene("RoomScene");
            }
        });
        this.joinButton.setPosition(this.getLayoutWidth() / 2 - 60, 0);
        this.add(this.joinButton);
    

        let layout = new Layout(this.scene, 1, 0, 0);
        layout.setFlexDirection('col');
        layout.add([this.roomNameText, this.roomPlayerCountText, this.roomStateText]);
        layout.setPosition(-(this.getLayoutWidth() / 2) + 20, -layout.getLayoutHeight() / 2);
        this.add(layout);

        this.updateRoomPostDisplay();
    }

    private updateRoomPostDisplay() {
        if(this.room) {
            this.roomNameText.setText(`Room name: ${this.room.roomId}`);
            this.roomPlayerCountText.setText(`Player count: ${this.room.clients}/${this.room.maxClients}`);
            this.roomStateText.setText(`Open`);
            this.joinButton.setButtonActive(true);
        } else {
            this.roomNameText.setText("Room name: N/A");
            this.roomPlayerCountText.setText("Player count: 0/0");
            this.roomStateText.setText("None");
            this.joinButton.setButtonActive(false);
        }
    }

    public setRoom(room: Colyseus.RoomAvailable | null) {
        this.room = room;
        this.updateRoomPostDisplay();
    }

    public setLayoutPosition(x:number, y:number) {
        this.setPosition(x, y);
    }

    public getLayoutWidth() {
        return this.background.displayWidth;
    }

    public getLayoutHeight() {
        return this.background.displayHeight;   
    }

    public getLayoutOriginX() {
        return this.originX;
    }

    public getLayoutOriginY() {
        return this.originY;
    }
}

