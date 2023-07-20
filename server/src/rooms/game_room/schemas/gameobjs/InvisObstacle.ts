import { Schema, type, MapSchema } from '@colyseus/schema';
import GameObject from './GameObject';
import GameManager from '../../system/GameManager';

/** The InvisObstacle is used to put up boundaries for the player and or monsters. */
export default class InvisObstacle extends GameObject {

    constructor(gameManager: GameManager, x:number, y:number, width:number, height:number) {
        super(gameManager, x, y);
        this.width = width;
        this.height = height;
        this.type = "InvisObstacle";
    }
}