import GameObject from "./GameObject";
import type GuildShopState from "../../../server/src/rooms/game_room/schemas/gameobjs/GuildShop";
import EventManager from "../system/EventManager";

export default class GuildShop extends GameObject {
    constructor(scene: Phaser.Scene, guildShopState: GuildShopState) {
        super(scene, guildShopState.x, guildShopState.y, "merchant", guildShopState);
        this.setDepth(100);
        this.positionOffsetY = -20;
        scene.anims.createFromAseprite("merchant", undefined, this);
        this.play({key: "play", repeat: -1});

        this.setInteractive();
        this.on(Phaser.Input.Events.POINTER_UP, () => {
            console.log("Guild shop clicked!!!");
            EventManager.eventEmitter.emit(EventManager.HUDEvents.SHOW_SKILLTREE_MODAL);
        })
    }
}
