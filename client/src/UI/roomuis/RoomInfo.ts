import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import UIFactory from "../UIFactory";
import TextBoxPhaser from "../TextBoxPhaser";
import RexUIBase, { SceneWithRexUI } from "../RexUIBase";
import { ColorStyle } from "../../config";

interface RoomInfoData {
    roomID: string;
    // passwordProtected: boolean;
    // roomPassword: string;
    privateRoom: boolean;
    playersInRoom: number;
    maxPlayersInRoom: number;
}

export default class RoomInfo extends RexUIBase{

    private infoSizer!: Sizer;
    private roomInfoData: RoomInfoData;

    constructor(scene: SceneWithRexUI, roomInfoData: Partial<RoomInfoData>) {
        super(scene);
        this.roomInfoData = {
            roomID: "Unknown",
            // passwordProtected: false,
            // roomPassword: "",
            privateRoom: false,
            playersInRoom: 0,
            maxPlayersInRoom: 0,
        };
        Object.assign(this.roomInfoData, roomInfoData);
        if(roomInfoData)
        this.initialize();
        this.update({});
    }

    public update(data: Partial<RoomInfoData>) {
        Object.assign(this.roomInfoData, data);
        (this.infoSizer.getByName("RoomInfoRoomID", true) as TextBoxPhaser).setText(`RoomID: ${this.roomInfoData.roomID}`);
        // (this.infoSizer.getByName("RoomInfoPP", true) as TextBoxPhaser).setText(`Password Protected: ${this.roomInfoData.passwordProtected ? "Yes" : "No"}`);
        // (this.infoSizer.getByName("RoomInfoRP", true) as TextBoxPhaser).setText(`Room Password: ${this.roomInfoData.roomPassword}`);
        (this.infoSizer.getByName("RoomInfoPR", true) as TextBoxPhaser).setText(`Private Room: ${this.roomInfoData.privateRoom ? "Yes" : "No"}`);
        (this.infoSizer.getByName("RoomInfoPIR", true) as TextBoxPhaser).setText(`Players In Room: ${this.roomInfoData.playersInRoom}/${this.roomInfoData.maxPlayersInRoom}`);
        this.infoSizer.layout();
    }

    private initialize() {
        this.infoSizer = this.rexUI.add.sizer({
            orientation: "vertical",
            anchor: {
                top: "top",
                left: "left",
            },
            space: {
                top: 10,
                left: 10,
                bottom: 10,
                right: 10,
                item: 2,
            }
        });
        this.infoSizer.addBackground(this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, ColorStyle.primary.hex[900]));
        this.infoSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Room ID: Unknown`, "p4").setName("RoomInfoRoomID"), {expand: false, align: "left"});
        // this.infoSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Password Protected: Unknown`, "p4").setName("RoomInfoPP"), {expand: false, align: "left"});
        // this.infoSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Room Password:`, "p4").setName("RoomInfoRP"), {expand: false, align: "left"});
        this.infoSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Private Room: Unknown`, "p4").setName("RoomInfoPR"), {expand: false, align: "left"});
        this.infoSizer.add(UIFactory.createTextBoxPhaser(this.scene, `Players In Room: Unknown/Unknown`, "p4").setName("RoomInfoPIR"), {expand: false, align: "left"});
        this.infoSizer.layout();
    }

    
}