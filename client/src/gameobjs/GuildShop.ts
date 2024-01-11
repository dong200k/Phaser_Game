import GameObject from "./GameObject";
import type GuildShopState from "../../../server/src/rooms/game_room/schemas/gameobjs/GuildShop";

export default class GuildShop extends GameObject {
    constructor(scene: Phaser.Scene, guildShopState: GuildShopState) {
        super(scene, guildShopState.x, guildShopState.y, "merchant", guildShopState);
        this.setDepth(100);
        this.positionOffsetY = -20;
    }
}
