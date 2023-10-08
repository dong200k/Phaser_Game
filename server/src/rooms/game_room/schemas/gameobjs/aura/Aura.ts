import Matter from "matter-js";
import { Schema, type } from '@colyseus/schema';
import { IAuraConfig } from "../../../system/interfaces";
import GameObject from "../GameObject";
import { Categories } from "../../../system/Collisions/Category";
import MaskManager from "../../../system/Collisions/MaskManager";
import Entity from "../Entity";
import AuraController from "../../../system/StateControllers/AuraController/AuraController";
import GameManager from "../../../system/GameManager";
import ctors, { IAuraControllerClasses } from "../../../system/StateControllers/AuraController/AuraControllerClasses";


export default class Aura extends GameObject {

    private DEFAULT_COLOR = 0x555555;
    @type("number") color = this.DEFAULT_COLOR;
    @type("number") radius = 100;

    auraController!: AuraController;

    constructor(gameManager: GameManager, config?: IAuraConfig) {
        super(gameManager, 0, 0);
        this.poolType = "aura";
        this.type = "Aura";
        this.active = true;
        this.visible = true;
        this.setController("Aura");
        this.setConfig(config ?? {name: "Aura"});
        this.createBody();
    }

    /**
     * Initializes this aura. This should be called when a new aura is created, or reused.
     * @param config IAuraConfig.
     */
    public setConfig(config: IAuraConfig) {
        this.color = config.color ?? this.color;
        this.radius = config.radius ?? this.radius;
        this.name = config.name ?? this.name;
        this.x = config.x ?? this.x;
        this.y = config.y ?? this.y;
        if(config.controller) this.setController(config.controller);
    }

    /** Helper method to create the matter body for this aura. */
    private createBody() {
        let body = Matter.Bodies.circle(this.x, this.y, this.radius, {
            isStatic: false,
            isSensor: true,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
        })

        body.collisionFilter = {
            ...body.collisionFilter,
            group: 0,
            category: Categories["AURA"],
            mask: MaskManager.getManager().getMask("AURA") 
        };

        body.label = "AURA"
        this.setBody(body);
    }

    /**
     * If there is a controller tied to the role then the player's controller will be set to that. Else it will be set to the default PlayerController.
     * @param name 
     */
    public setController(name: string){
        if(ctors.hasOwnProperty(name)){
            this.auraController = new ctors[name as IAuraControllerClasses]({
                aura: this,
            })
        }else{
            this.auraController = new AuraController({aura: this});
        }
    }

    /** Disable collision on the Matter body associated with this object. */
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
            ...this.body.collisionFilter,
            group: 0,
            category: Categories["AURA"],
            mask: MaskManager.getManager().getMask("AURA") 
        };
    }

    /** Makes the aura active and enable collistions, or deactive and 
     * disable collisions.
     * @param value A boolean.
     */
    public setActive(value: boolean): void {
        super.setActive(value);
        if(!value) {
            this.disableCollisions();
        } else {
            this.enableCollisions();
        }
    }
}