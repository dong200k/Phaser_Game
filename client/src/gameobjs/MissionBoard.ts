import GameObject from "./GameObject";
import type MissionBoardState from "../../../server/src/rooms/game_room/schemas/gameobjs/MissionBoard";

export default class MissionBoard extends GameObject {
    constructor(scene: Phaser.Scene, missionBoardState: MissionBoardState) {
        super(scene, missionBoardState.x, missionBoardState.y, "mission_board", missionBoardState);
        this.setDepth(100);
    }
}
