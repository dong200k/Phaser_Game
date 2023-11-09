import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import BerserkerBossController from "../BerserkerBossController";
import Monster from "../../../../../schemas/gameobjs/monsters/Monster";
import Entity from "../../../../../schemas/gameobjs/Entity";
import { getFinalSpeed } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";

/**
 * In this state the monster will follow its target.
 */
export default class Follow extends StateNode {

    protected controller!: BerserkerBossController
    protected boss!: Monster;
    protected target?: Entity

    public onEnter(): void {
        this.controller = this.getStateMachine()
        this.boss = this.controller.getBoss()
        this.boss.animation.playAnimation("walk", {loop: true});
        this.target = this.controller.getTarget()
    }
    public onExit(): void {
        let body = this.boss.getBody()
        Matter.Body.setVelocity(body, {x: 0, y: 0});
    }
    public update(deltaT: number): void {

        if(!this.target) {
            this.getStateMachine().changeState("Idle");
        } else {
            let bossBody = this.boss.getBody()
            let {x: bossX, y: bossY} = bossBody.position;
            let {x: targetX, y: targetY} = this.target.getBody().position;

            let speed = getFinalSpeed(this.boss.stat) * deltaT;
            let velocity = MathUtil.getNormalizedSpeed(targetX - bossX, targetY - bossY, speed);
            if(bossBody) Matter.Body.setVelocity(bossBody, velocity);

            // let attackRange = g(monster.stat, 1);
            let attackRange = 40
            let distance = MathUtil.distance(bossX, bossY, targetX, targetY)
            if(distance <= attackRange) {
                // Choose random attack and change to attack mode.
                let attacks = ["attack_1", "attack_2", "attack_3", "attack_4"]
                this.controller.stateMap["Attack"]?.setAttackName(attacks[Math.floor(Math.random()*attacks.length)])
                this.getStateMachine().changeState("Attack");
            }
            if(distance > 40 && distance < 120){
                this.getStateMachine().changeState("Roll")
            }
        }
    }

}