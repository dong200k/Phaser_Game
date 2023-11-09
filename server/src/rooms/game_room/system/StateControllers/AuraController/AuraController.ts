import Matter from "matter-js";
import Entity from "../../../schemas/gameobjs/Entity";
import Aura from "../../../schemas/gameobjs/aura/Aura";
import { getCategoryType } from "../../Collisions/Category";
import GameManager from "../../GameManager";
import StateMachine from "../../StateMachine/StateMachine";
import Active from "./common/Active";
import InActive from "./common/InActive";

export interface AuraControllerData {
    aura: Aura;
}

export default class AuraController extends StateMachine<AuraControllerData> {
    
    protected gameManager!: GameManager;
    protected aura!: Aura;
    protected collisionTargets = ["PLAYER", "MONSTER"];
    protected followTarget?: Entity;

    protected create(data: AuraControllerData): void {
        this.aura = data.aura;
        this.gameManager = this.aura.gameManager;

        let activeState = new Active("Active", this);
        this.addState(activeState);

        let inactiveState = new InActive("InActive", this);
        this.addState(inactiveState);

        this.changeState("InActive");
    }

    protected postUpdate(deltaT: number): void {
        if(!this.aura.active) {
            this.changeState("InActive");
        }
        if(this.followTarget) {
            let postion = {...this.followTarget.getBody().position};
            Matter.Body.setPosition(this.aura.getBody(), postion);
        }
    }

    public onEnterAura(entity: Entity) {
        
    }

    public onExitAura(entity: Entity) {

    }

    public getGameManager() {
        return this.gameManager;
    }

    public getAura() {
        return this.aura;
    }

    public setCollisionTargets(collisionTargets: string[]) {
        this.collisionTargets = collisionTargets;
    }

    /**
     * Sets a target for this aura to follow. If undefined is provided this aura will 
     * stop following its target.
     * @param followTarget The followTarget.
     */
    public setFollowTarget(followTarget: Entity | undefined) {
        this.followTarget = followTarget;
    }

    /**
     * Checks if the entity collision should be handled.
     * @param entity The entity.
     * @returns Returns true if the entity is a type of collisionTargets. False otherwise.
     */
    protected collisionTargetCheck(entity: Entity) {
        let category = entity.getBody().collisionFilter.category;
        if(category === undefined) return false;
        let categoryString = getCategoryType(category);
        return this.collisionTargets.includes(categoryString);
    }
}