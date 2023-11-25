import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import MonsterController from "../simplemonster/MonsterController";
import Summon from "./states/Summon";

export interface SummonerControllerData {
    monster: Monster;
    summonedMonsterName: string;
    /** Amount of monsters summoned each batch */
    summonedMonsterCount?: number,
    /** Cooldown before another batch of monsters can be summoned */
    summonMonsterCooldown?: number,
}

export default class SummonerController extends MonsterController {

    private summonedMonsterName = "Zombie Wolf"
    /** Amount of monsters summoned each batch */
    private summonedMonsterCount = 5
    /** Cooldown before another batch of monsters can be summoned */
    private summonMonsterCooldown = 5
    protected create(data: SummonerControllerData): void {
        super.create(data)

        this.summonedMonsterName = data.summonedMonsterName
        this.summonMonsterCooldown = data.summonMonsterCooldown ?? 5
        this.summonedMonsterCount = data.summonedMonsterCount ?? 5

        this.removeState('Attack')
        this.addState(new Summon("Attack", this))

        //Set initial state
        this.changeState("Idle");
    }

    public getSummonedMonsterName(){
        return this.summonedMonsterName
    }
    public getSummonedMonsterCount(){
        return this.summonedMonsterCount
    }
    public getSummonMonsterCooldown(){
        return this.summonMonsterCooldown
    }
}