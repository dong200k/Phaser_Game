import GameObject from "./GameObject";
import type AuraState from "../../../server/src/rooms/game_room/schemas/gameobjs/aura/Aura";

export default class Aura extends GameObject {

    auraState: AuraState;
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene:Phaser.Scene, auraState:AuraState) {
        super(scene, auraState.x, auraState.y, "invisible", auraState);
        this.auraState = auraState;
        this.graphics = this.scene.add.graphics();

        this.graphics.fillStyle(auraState.color, 0.12);
        this.graphics.fillCircle(0, 0, auraState.radius);
    }

    updateGraphicsPosition() {
        this.graphics.setX(this.x);
        this.graphics.setY(this.y);
    }

    setVisible(value: boolean): this {
        super.setVisible(value);
        this.graphics.setVisible(value);
        return this;
    }
}