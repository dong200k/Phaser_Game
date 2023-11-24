import Cooldown from "../../../../schemas/gameobjs/Cooldown";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import MonsterController from "../simplemonster/MonsterController";
import Attack from "./states/Attack";
import Charge from "./states/Charge";
import Follow from "./states/Follow";

export interface ChargingMonsterControllerData {
    monster: Monster;
}

export default class ChargingMonsterController extends MonsterController {

    private chargeCooldown: Cooldown = new Cooldown(5)

    protected create(data: ChargingMonsterControllerData): void {
        super.create(data)

        this.removeState("Attack")
        this.addState(new Attack("Attack", this))

        this.addState(new Charge("Charge", this))

        this.removeState("Follow")
        this.addState(new Follow("Follow", this))

        //Set initial state
        this.changeState("Idle");
    }

    public update(deltaT: number): void {
        super.update(deltaT)

        this.chargeCooldown.tick(deltaT)
    }

    public isChargeReady(){
        return this.chargeCooldown.isFinished
    }

    public turnOnCooldown(){
        this.chargeCooldown.reset()
    }
}