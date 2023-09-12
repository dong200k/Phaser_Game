import { Schema, type } from '@colyseus/schema';
import Cooldown from './Cooldown';
import Player from './Player';
import GameManager from '../../system/GameManager';
import { IAbility } from '../../system/interfaces';
import EffectLogic from '../../system/EffectLogic/EffectLogic';
export default class Ability extends Schema{
    @type(Cooldown) cooldown: Cooldown
    @type("string") effectLogicId: string
    @type("string") description: string
    @type("string") name: string
    @type("string") id: string
    // @type("string") sprite: string

    private gameManager: GameManager
    private owner?: Player
    private effectLogic?: EffectLogic
    
    constructor(IAbility: IAbility, gameManager: GameManager){
        super()
        this.gameManager = gameManager
        this.cooldown = new Cooldown(Number(IAbility.cooldown))
        this.effectLogicId = IAbility.effectLogicId
        this.name = IAbility.name
        this.description = IAbility.description
        this.id = IAbility.id
        // this.sprite = IAbility.displaySprite
        let ctor = gameManager.getEffectLogicManager().getEffectLogicConstructor(this.effectLogicId)
        if(ctor) this.effectLogic = new ctor()
    }

    update(deltaT: number){
        this.cooldown.tick(deltaT)
    }

    useAbility(){
        // use logic referenced by ability's effectLogicId when cooldown is finished.
        if(this.cooldown.isFinished && this.owner && this.effectLogic){
            this.cooldown.reset()
            this.effectLogic.useEffect(this.owner, this.gameManager)
            return true
        }
        return false
    }

    setOwner(owner: Player){
        this.owner = owner
    }
}