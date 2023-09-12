import Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import TextBox from './TextBox';
import Layout from './Layout';
import { ColorStyle } from '../config';
import Layoutable from './Layoutable';
import Button from './Button';
import SceneManager from '../system/SceneManager';
import ClientManager from '../system/ClientManager';
import TextBoxPhaser from './TextBoxPhaser';
import UIFactory from './UIFactory';

/** RoomPost is the UI for a single room posting in the lobby. This should only be used in the LobbyScene not elsewhere. */
export default class RoomPost extends Phaser.GameObjects.Container implements Layoutable {
    
    private room: Colyseus.RoomAvailable | null = null;
    private roomNameText: TextBoxPhaser;
    private roomPlayerCountText: TextBoxPhaser;
    private roomStateText: TextBoxPhaser;
    private background: Phaser.GameObjects.Rectangle;
    private joinButton: Button;

    constructor(scene: Phaser.Scene, x=0, y=0) {
        super(scene, x, y);
        this.roomNameText = UIFactory.createTextBoxPhaser(this.scene, "Room name: N/A", "l6");
        this.roomPlayerCountText = UIFactory.createTextBoxPhaser(this.scene, "Player count: 0/0", 'l6');
        this.roomStateText = UIFactory.createTextBoxPhaser(this.scene, "None", "l6");
        this.roomNameText.setOrigin(0, 0);
        this.roomPlayerCountText.setOrigin(0, 0);
        this.roomStateText.setOrigin(0, 0);

        this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 573, 63, ColorStyle.primary.hex[500]);
        this.background.setStrokeStyle(1, ColorStyle.primary.hex[900]);
        this.add(this.background);

        this.joinButton = new Button(this.scene, 'Join', 0, 0, "small", () => {
            if(this.room) {
                ClientManager.getClient().setWaitingRoomId(this.room.roomId);
                SceneManager.getSceneManager().pushScene("RoomScene");
            }
        });
        this.joinButton.setPosition(this.getLayoutWidth() / 2 - 60, 0);
        this.add(this.joinButton);
    

        let layout = new Layout(this.scene, {
            x: -this.getLayoutWidth() / 2 + 20,
            y: 0,
            gap: 1,
            flexDirection: 'col',
            alignItems: 'start',
            originX: 0,
        });
        layout.add([this.roomNameText, this.roomPlayerCountText, this.roomStateText]);
        this.add(layout);

        this.updateRoomPostDisplay();
    }

    private updateRoomPostDisplay() {
        if(this.room) {
            let {inGame, passwordProtected, roomName} = this.room.metadata;

            this.roomNameText.setText(`Room name: ${roomName}`);
            this.roomPlayerCountText.setText(`Player count: ${this.room.clients}/${this.room.maxClients}`);
            
            if(!inGame) {
                if(this.room.clients >= this.room.maxClients) {
                    this.roomStateText.setText(`Full`);
                    this.joinButton.setButtonActive(false);
                } else {
                    this.roomStateText.setText(`Open`);
                    this.joinButton.setButtonActive(true);
                }
            } else {
                this.roomStateText.setText(`In Game`);
                this.joinButton.setButtonActive(false);
            }
            
            this.background.setFillStyle(ColorStyle.primary.hex[500]);
        } else {
            this.roomNameText.setText("Vacant slot");
            this.roomPlayerCountText.setText("");
            this.roomStateText.setText("");
            this.joinButton.setButtonActive(false);
            this.background.setFillStyle(ColorStyle.neutrals.hex[700]);
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

