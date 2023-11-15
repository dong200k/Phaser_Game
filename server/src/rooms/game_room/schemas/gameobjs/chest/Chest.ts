import { ArraySchema, type, Schema, filter } from '@colyseus/schema';
import GameManager from "../../../system/GameManager";
import GameObject from "../GameObject";
import Matter from 'matter-js';
import { Categories } from '../../../system/Collisions/Category';
import MaskManager from '../../../system/Collisions/MaskManager';
import Player from '../Player';
import { IChestConfig } from '../../../system/interfaces';

export default class Chest extends GameObject {

    items: string[] = [];
    chestOpened: boolean = false;
    @type("string") rarity: string;

    constructor(gameManager: GameManager, chestConfig: IChestConfig) {
        super(gameManager, chestConfig.x ?? 0, chestConfig.y ?? 0);
        this.name = "Chest";
        this.type = "Chest";
        this.poolType = "Chest";
        this.width = 38;
        this.height = 17;
        this.rarity = chestConfig.rarity;
        // Create Matter Body
        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: true,
            isSensor: true,
        });
        body.collisionFilter = {
            group: 0,
            category: Categories.CHEST,
            mask: MaskManager.getManager().getMask('CHEST'),
        }
        this.body = body;
    }

    /**
     * The new config for the chest.
     * Note: The rarity of a chest cannot be changed once created. If another ratity is need create a new chest.
     * @param config IChestConfig
     */
    public setConfig(config: IChestConfig) {
        // this.rarity = config.rarity ?? this.rarity;
        this.x = config.x ?? this.x;
        this.y = config.y ?? this.y;
    }

    /**
     * Opens the chest, passing in the player that opened the chest.
     * @param player The player that opened the chest.
     */
    public openChest(player: Player) {
        if(this.chestOpened) 
            return;
        
        console.log(`Chest has been opened!! by ${player.name}`);
        this.chestOpened = true;
        // play chest opened animation
        this.animation.playAnimation("opening", {loop: false});
        this.disableCollisions();
    }

    public reset() {
        this.enableCollisions();
        this.chestOpened = false;
        this.animation.playAnimation("closed", {loop: false});
    }

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
            category: Categories.CHEST,
            mask: MaskManager.getManager().getMask('CHEST'),
        }
    }
    
}
