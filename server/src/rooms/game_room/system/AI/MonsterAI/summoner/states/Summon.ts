
import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import SummonerController from "../SummonerController";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";
import { SpawnPoint } from "../../../../../schemas/dungeon/Dungeon";

/**
 * The Summon state is entered periodically. In this state the monster will summon other monsters
 */
export default class Summon extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 1;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.95;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 1;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    private summonedMonsterCount = 5
    private timeBetweenAttack = 5
    private timeSoFar  = 0

    public onEnter(): void {
        let stateMachine = this.getStateMachine<SummonerController>();
        this.timeBetweenAttack = stateMachine.getSummonMonsterCooldown()
        this.summonedMonsterCount = stateMachine.getSummonedMonsterCount()

        // Setting the default attack cooldown for this monster.
        let monster = stateMachine.getMonster();
        this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
    }

    public onExit(): void {
        
    }

    protected summon() {
        let stateMachine = this.getStateMachine<SummonerController>();
        let monster = stateMachine.getMonster();
        let summonedMonsterName = stateMachine.getSummonedMonsterName()

        for(let i=0;i<this.summonedMonsterCount;i++){
            stateMachine.getPlayerManager().getGameManager().getDungeonManager().spawnMonster(summonedMonsterName, monster.getBody().position as SpawnPoint)
        }
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<SummonerController>();
        let monster = stateMachine.getMonster();
        let attackRange = getFinalAttackRange(monster.stat, 1);

        this.attackCooldown -= deltaT;

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                // Trigger an attack.
                // monster.animation.playAnimation("death", false);
                this.summon()                
                this.attackTriggered = true;
            }
        }
        
        if(this.attackCooldown <= 0) {
            let aggroTarget = monster.getAggroTarget();

            // If the aggroTarget is null change to the Idle state.
            if(aggroTarget == null) {
                stateMachine.changeState("Idle");
            } else {
                // Checks if this monster is still in range of the aggro target.
                if(MathUtil.distance(monster.x, monster.y, aggroTarget.x, aggroTarget.y) <= attackRange) {
                    // Check that time between attack has passed
                    this.timeSoFar += deltaT
                    if(this.timeSoFar > this.timeBetweenAttack) {
                        this.resetAttack();
                        this.timeSoFar = 0
                    }
                } else {
                    // Switch to follow if not in range.
                    stateMachine.changeState("Follow");
                }
            }
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}