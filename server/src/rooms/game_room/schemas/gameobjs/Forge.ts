import { ArraySchema, type, Schema, filter, MapSchema } from '@colyseus/schema';
import GameManager from '../../system/GameManager';
import GameObject from './GameObject';
import Matter from 'matter-js';
import { Categories } from '../../system/Collisions/Category';
import MaskManager from '../../system/Collisions/MaskManager';
import { IForgeUpgrade } from '../../system/StateManagers/ForgeManager';
import ForgeUpgrade from '../ForgeUpgradeItem';

export interface IForgeConfig{
    x?: number,
    y?: number
}

export default class Forge extends GameObject {
    
    /** Chances each players get at each forge to pick upgrades */
    @type('number') chancesEachForge = 1

    /** Upgrades available for choosing, generated each time forge shows up. Reset when wave ends. */
    @type({map: ForgeUpgrade}) forgeUpgrades = new MapSchema<ForgeUpgrade>()  
    @type('number') ping = 0

    constructor(gameManager: GameManager, forgeConfig: IForgeConfig) {
        super(gameManager, forgeConfig.x ?? 0, forgeConfig.y ?? 0);
        this.name = "Forge";
        this.type = "Forge";
        // this.poolType = "Forge";
        this.width = 50;
        this.height = 50;
        this.sprite = "wood_chest"

        // Create Matter Body
        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            // isStatic: true,
            isSensor: true,
        }); 
        body.collisionFilter = {
            group: 0,
            category: Categories.FORGE,
            mask: MaskManager.getManager().getMask('FORGE'),
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
            category: Categories.FORGE,
            mask: MaskManager.getManager().getMask('FORGE'),
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
}
