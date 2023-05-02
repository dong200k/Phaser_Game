import MonsterController from "../../../system/AI/MonsterAI/simplemonster/MonsterController";
import StateMachine from "../../../system/StateMachine/StateMachine";
import Entity from "../Entity";
import { type } from "@colyseus/schema";


export default class Monster extends Entity {

    @type("string") private monsterName: string;
    @type(MonsterController) private controller: MonsterController | null = null;
    private aggroTarget: Entity | null = null;


    constructor(monsterName: string, controller?:MonsterController) {
        super();
        this.monsterName = monsterName;
        this.type = "Monster";
        if(controller !== undefined) this.controller = controller;
    }

    public setController(contorller: MonsterController) {
        this.controller = contorller;
    }

    public getMonsterName() {
        return this.monsterName;
    }

    /**
     * Sets a new aggroTarget for this monster.
     * @param aggroTarget The aggroTarget.
     */
    public setAggroTarget(aggroTarget: Entity) {
        this.aggroTarget = aggroTarget;
    }

    public getAggroTarget() {
        return this.aggroTarget;
    }

    /**
     * Updates this monster by updating its ai controller.
     * @param deltaT time passed in seconds.
     */
    public update(deltaT: number) {
        this.controller?.update(deltaT);
    }
}