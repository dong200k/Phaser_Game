import { ArraySchema, type, Schema, filter } from '@colyseus/schema';
import GameManager from '../../system/GameManager';
import GameObject from './GameObject';
import Matter from 'matter-js';
import { Categories } from '../../system/Collisions/Category';
import MaskManager from '../../system/Collisions/MaskManager';
import MerchantItem from '../merchant_items/MerchantItem';
export interface IMerchantConfig{
    x?: number,
    y?: number
}

export default class Merchant extends GameObject {
    @type([MerchantItem]) items: MerchantItem[] = [];
    @type('number') ping = 0

    constructor(gameManager: GameManager, config: IMerchantConfig) {
        super(gameManager, config.x ?? 0, config.y ?? 0);
        this.name = "Merchant";
        this.type = "Merchant";
        this.width = 100;
        this.height = 100;

        // Create Matter Body
        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            // isStatic: true,
            isSensor: true,
        }); 
        body.collisionFilter = {
            group: 0,
            category: Categories.MERCHANT,
            mask: MaskManager.getManager().getMask('MERCHANT'),
        }
        this.setBody(body)
    }

    /**
     * Opens the Forge, playing an animation and sound effect.
     */
    // public openForge(): boolean {
    //     // play forge opened animation
    //     this.animation.playAnimation("opening", {loop: false});
    //     this.sound.playSoundEffect("wood_chest_open_sfx");
    //     this.disableCollisions();
    // }

    public disableCollisions() {
        this.body.collisionFilter = {
            ...this.body.collisionFilter,
            group: -1,
            mask: 0,
        }
    }

    /** Enable collision on the Matter body associated with this object. */
    public enableCollisions() {
        this.body.collisionFilter = {
            group: 0,
            category: Categories.MERCHANT,
            mask: MaskManager.getManager().getMask('MERCHANT'),
        }
    }

    public hide(){
        this.setActive(false)
        this.disableCollisions()
        this.setVisible(false)
    }

    public show(pos: {x: number, y: number}){
        this.setActive(true)
        this.enableCollisions()
        this.setVisible(true)

        let body = this.getBody()
        Matter.Body.setPosition(body, pos)
    }

    public setItems(items: MerchantItem[]){
        this.items = items
    }

    public getItems(){
        return this.items
    }
}
