import MathUtil from "../../../../../../../util/MathUtil";
import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Cooldown from "../../../../../schemas/gameobjs/Cooldown";
import Player from "../../../../../schemas/gameobjs/Player";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import { spawnProjectilesRotated } from "../../helper";
import CooldownGodUpgrade from "../CooldownGodUpgrade";

export default class GiantHeartBeat extends CooldownGodUpgrade{
    effectLogicId: string = "GiantHeartBeat"
    protected cooldownTime = 5
    protected cooldown?: Cooldown | undefined = new Cooldown(this.cooldownTime)
    protected attackSound = "giant_heart_beat"
    protected attackMultiplier: number = 0.01
    protected range = 10000

    public initUpgradeFunctions(): void {
        this.upgradeFunctions = [this.upgrade1.bind(this), this.upgrade2.bind(this), this.upgrade3.bind(this), this.upgrade4.bind(this), this.upgrade5.bind(this)]
    }

    protected useSpecial(playerState: Player, gameManager: GameManager): void {
        gameManager.gameObjects.forEach(obj=>{
            if(obj instanceof Monster && obj.isActive()){
                let distance = MathUtil.distance(obj.x, obj.y, playerState.x, playerState.y)
                if(distance > this.range) return
                let damageEffect = EffectFactory.createDamageEffect(playerState.stat.maxHp * this.attackMultiplier)
                EffectManager.addEffectsTo(obj, damageEffect)
            }
        })
    }

    private upgrade1(){
        this.cooldownTime -= 1
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade2(){
        this.attackMultiplier += 0.01
    }

    private upgrade3(){
        this.cooldownTime -= 1
        this.cooldown?.setTime(this.cooldownTime)
    }

    private upgrade4(){
        this.attackMultiplier += 0.025
    }

    private upgrade5(){
        this.cooldownTime -= 1
        this.cooldown?.setTime(this.cooldownTime)
    }
}