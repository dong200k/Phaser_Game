import GameObject from "./GameObject";
import MerchantState from "../../../server/src/rooms/game_room/schemas/gameobjs/Merchant";
import MerchantItem from "../../../server/src/rooms/game_room/schemas/merchant_items/MerchantItem";

export default class Merchant extends GameObject
{
    /** Items the merchant is selling */
    public items: MerchantItem[] = []
    private merchantState: MerchantState;
    /** Is the walking animation playing or not. */
    walking: boolean = false;

    // static count: number = 0;

    constructor(scene:Phaser.Scene, merchantState: MerchantState) {
        super(scene, merchantState.x, merchantState.y, "wood", merchantState);
        this.merchantState = merchantState;
        scene.anims.createFromAseprite("merchant", undefined, this);
        this.play({key: "play", repeat: -1});
    }
}