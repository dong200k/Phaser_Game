import { ArraySchema, type, Schema, filter } from '@colyseus/schema';
import GameManager from '../../system/GameManager';
import GameObject from './GameObject';
import Matter from 'matter-js';
import { Categories } from '../../system/Collisions/Category';
import MaskManager from '../../system/Collisions/MaskManager';
import Player from './Player';
import Stat from './Stat';
import EffectFactory from '../effects/EffectFactory';
import EffectManager from '../../system/StateManagers/EffectManager';

export interface IFountainConfig{
    x?: number,
    y?: number,
    /** Number of times the player can interact with fountain to heal */
    chances?: number,
    /** Flat heal */
    healAmount?: number,
    /** heals based on a percentage of the player's max health */
    healPercent?: number,
    /** Number of times this fountain can be used per player */
    healChances?: number
}

export default class Fountain extends GameObject {
    private healAmount = 0
    private healPercent = 0
    /** Map of player id to chances remaining for healing */
    private chanceMap: Map<string, number> = new Map()
    /** Heal chances for this fountain per player*/
    private healChances = 1

    constructor(gameManager: GameManager, config: IFountainConfig) {
        super(gameManager, config.x ?? 0, config.y ?? 0);
        this.name = "Fountain";
        this.type = "Fountain";
        this.width = 50;
        this.height = 50;
        this.healAmount = config.healAmount ?? 0
        this.healPercent = config.healPercent ?? 0.5
        this.healChances = config.healChances ?? 1

        // Create Matter Body
        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            // isStatic: true,
            isSensor: true, 
        }); 
        body.collisionFilter = {
            group: 0,
            category: Categories.FOUNTAIN,
            mask: MaskManager.getManager().getMask('FOUNTAIN'),
        }
        this.setBody(body)
    }
    
    /**
     * This method will reset the heal chances for every player for this fountain.
     */
    public resetChances(){
        this.chanceMap.forEach((_, id)=>{
            this.chanceMap.set(id, this.healChances)
        })
    }

     /**
     * Called when player interacts with the fountain (currently called on collision)
     * @param player 
     * @param fountain 
     */
     public handleInteractFountain(player: Player, fountain: GameObject){
        console.log("Fountain collision")

        // First time using fountain, add player and their healChances to map
        let playerId = player.getId()
        if(!this.chanceMap.has(playerId)){
            this.chanceMap.set(playerId, this.healChances)
        }

        // Check that player still has heals left
        let healChances = this.chanceMap.get(playerId)
        if(healChances && healChances > 0){
            // Heal player and reduce chances
            this.chanceMap.set(playerId, healChances - 1)
            this.healPlayer(player)
        }else{
            // Dont heal
            console.log(`Player ${player.name} has used up all chances at the fountain`)
        }   
    }

    private healPlayer(player: Player){
        let healAmount = this.getHealAmount(player.stat)
        let healEffect = EffectFactory.createHealEffect(healAmount)
        EffectManager.addEffectsTo(player, healEffect)

        // Player heal sound effect
        player.sound.playSoundEffect("fountain_heal")
    }
    
    private getHealAmount({maxHp}: Stat){
        let amount = maxHp * this.healPercent + this.healAmount
        if(amount < 0) amount = 0
        return Math.round(amount)
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
            category: Categories.FOUNTAIN,
            mask: MaskManager.getManager().getMask('FOUNTAIN'),
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
