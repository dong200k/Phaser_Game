import { Schema, type } from '@colyseus/schema';
import Cooldown from './Cooldown';
import Player from './Player';
import GameManager from '../../system/GameManager';
import { IAbility } from '../../system/interfaces';
export default class Ability extends Schema{
    @type(Cooldown) cooldown: Cooldown
    @type("string") effectLogicId: string
    @type("string") description: string
    @type("string") name: string
    @type("string") id: string
    // @type("string") sprite: string

    private gameManager: GameManager
    private owner?: Player
    
    constructor(IAbility: IAbility, gameManager: GameManager){
        super()
        this.gameManager = gameManager
        this.cooldown = new Cooldown(Number(IAbility.cooldown))
        this.effectLogicId = IAbility.effectLogicId
        this.name = IAbility.name
        this.description = IAbility.description
        this.id = IAbility.id
        // this.sprite = IAbility.displaySprite
    }

    update(deltaT: number){
        this.cooldown.tick(deltaT)
    }

    useAbility(){
        // use logic referenced by ability's effectLogicId when cooldown is finished.
        if(this.cooldown.isFinished && this.owner){
            this.cooldown.reset()
            this.gameManager.getEffectLogicManager().useEffect(this.effectLogicId, this.owner)
            return true
        }
        return false
    }

    setOwner(owner: Player){
        this.owner = owner
    }
}