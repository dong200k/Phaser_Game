import Matter from "matter-js";
import { Schema, type } from '@colyseus/schema';
import { IAuraConfig } from "../../../system/interfaces";
import GameObject from "../GameObject";
import { Categories } from "../../../system/Collisions/Category";
import MaskManager from "../../../system/Collisions/MaskManager";


export default class Aura extends GameObject {

    private DEFAULT_COLOR = 0x555555;
    @type("number") color = this.DEFAULT_COLOR;
    @type("number") radius = 100;

    /**
     * Initializes this aura. This should be called when a new aura is created.
     * @param config IAuraConfig.
     */
    public initialize(config: IAuraConfig) {
        this.createBody(config);
        this.color = config.color ?? this.DEFAULT_COLOR;
        this.radius = config.radius ?? 100;
        this.poolType = "aura";
        this.type = "Aura";
    }

    private createBody(config: IAuraConfig) {
        let body = Matter.Bodies.circle(this.x, this.y, config.radius ?? 100, {
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

}