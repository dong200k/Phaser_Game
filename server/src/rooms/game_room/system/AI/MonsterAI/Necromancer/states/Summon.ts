
import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import MathUtil from "../../../../../../../util/MathUtil";
import { SpawnPoint } from "../../../../../schemas/dungeon/Dungeon";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import NecromancerController from "../NecromancerController";

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

    private summonedMonsterCount = 100

    public onEnter(): void {
        let stateMachine = this.getStateMachine<NecromancerController>();

        // Setting the default attack cooldown for this monster.
        let monster = stateMachine.getMonster();
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
    }

    public onExit(): void {
        
    }

    protected summon() {
        let stateMachine = this.getStateMachine<NecromancerController>();
        let monster = stateMachine.getMonster();
        let summonedMonsterName = stateMachine.getSummonedMonsterName()

        for(let i=0;i<this.summonedMonsterCount;i++){
            let pos = this.getSummonPosition()
            this.spawnSummoningCircle(pos)
            stateMachine.getPlayerManager().getGameManager().getDungeonManager().spawnMonster(summonedMonsterName, pos)
        }
    }

    private spawnSummoningCircle(pos: SpawnPoint){
        let stateMachine = this.getStateMachine<NecromancerController>();
        let monster = stateMachine.getMonster();

        let projectileConfig: IProjectileConfig;
        projectileConfig = {
            sprite: "summon_circle",
            stat: monster.stat,
            spawnX: pos.x,
            spawnY: pos.y,
            width: 64,
            height: 64,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "NONE",
            activeTime: 1000,
            poolType: "summon_circle",
            attackMultiplier: 1,
            magicMultiplier: 0,
            classType: "Projectile",
            repeatAnimation: true,
            dontDespawnOnObstacleCollision: true,
        }

        stateMachine.getPlayerManager().getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

    private getSummonPosition(){
        let stateMachine = this.getStateMachine<NecromancerController>();
        let monster = stateMachine.getMonster();
        let pos = {...monster.getBody().position} as SpawnPoint
        let offsetX = Math.random() * 150 + 50
        let offsetY = Math.random() * 150 + 50
        if(Math.random()<0.5) offsetX *= -1
        if(Math.random()<0.5) offsetY *= -1

        pos.x += offsetX
        pos.y += offsetY
        return pos
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<NecromancerController>();
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

            stateMachine.changeState("Idle");
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}