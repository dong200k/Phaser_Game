import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import MonsterController from "../simplemonster/MonsterController";
import Summon from "./states/Summon";

export interface SummonerControllerData {
    monster: Monster;
    summonedMonsterName: string;
}

export default class SummonerController extends MonsterController {

    private summonedMonsterName = "Zombie Wolf"
    protected create(data: SummonerControllerData): void {
        super.create(data)

        this.summonedMonsterName = data.summonedMonsterName

        this.removeState('Attack')
        this.addState(new Summon("Attack", this))

        //Set initial state
        this.changeState("Idle");
    }

    public getSummonedMonsterName(){
        return this.summonedMonsterName
    }
}