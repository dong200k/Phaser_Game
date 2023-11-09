import { StatConfig } from "../../../../schemas/effects/temp/StatEffect";
import Entity from "../../../../schemas/gameobjs/Entity";
import { getCategoryType } from "../../../Collisions/Category";
import AuraController, { AuraControllerData } from "../AuraController";
import Active from "./states/Active";

export default class StatAuraController extends AuraController {

    private activeState!: Active;
    private statConfig?: StatConfig;

    protected create(data: AuraControllerData): void {
        super.create(data);

        this.removeState("Active");
        let activeState = new Active("Active", this);
        this.addState(activeState);
        this.activeState = activeState;

        this.changeState("Active");
    }

    public onEnterAura(entity: Entity) {
        if(this.stateName === "Active" && this.collisionTargetCheck(entity)) {
            this.activeState.onEnterAura(entity);
        }
    }

    public onExitAura(entity: Entity) {
        if(this.stateName === "Active" && this.collisionTargetCheck(entity)) {
            this.activeState.onExitAura(entity);
        }
    }

    public setStatConfig(statConfig: StatConfig) {
        this.statConfig = statConfig;
    }

    public getStatConfig() {
        return this.statConfig;
    }
}
