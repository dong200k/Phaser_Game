import GameObject from "./GameObject";
import type StatueState from "../../../server/src/rooms/game_room/schemas/gameobjs/Statue";

export default class Statue extends GameObject {
    constructor(scene: Phaser.Scene, statueState: StatueState) {
        super(scene, statueState.x, statueState.y, statueState.name, statueState);
    }
}