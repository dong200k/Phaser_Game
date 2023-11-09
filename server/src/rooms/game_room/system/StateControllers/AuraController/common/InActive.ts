import Entity from "../../../../schemas/gameobjs/Entity";
import Aura from "../../../../schemas/gameobjs/aura/Aura";
import GameManager from "../../../GameManager";
import StateNode from "../../../StateMachine/StateNode";
import AuraController from "../AuraController";
import ContractAuraController from "../ContactAura/StatAuraController";


export default class InActive extends StateNode {

    private aura!: Aura;

    public onEnter(): void {
        this.aura = this.getStateMachine<AuraController>().getAura();
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        if(this.aura.isActive()) {
            this.getStateMachine().changeState("Active");
        }
    }
    
}

