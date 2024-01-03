import Matter from "matter-js";
import StateNode from "../../../../StateMachine/StateNode";
import { getFinalAttackCooldown, getFinalAttackRange } from "../../../../Formulas/formulas";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import MathUtil from "../../../../../../../util/MathUtil";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import DragonController from "../DragonController";
import MeteorController from "../../../../EffectLogic/EffectLogics/special/specials/lightningbird copy/MeteorController";

/**
 * The Attack state is entered when the monster is in attackRange of its aggroTarget.
 * The monster will then perform its attack on its aggroTarget.
 */
export default class Meteor extends StateNode {

    /** The time it takes for a attack to complete. */ 
    protected defaultAttackCooldown: number = 3;

    /** The percent of the attack cooldown before the attack triggers. Ex. Monster slashes. */
    protected attackTriggerPercent: number = 0.85;

    /** The attack cooldown. Goes from defaultAttackCooldown to 0. */
    protected attackCooldown: number = 3;

    /** Has the attack been triggered. */
    protected attackTriggered: boolean = false;

    private timeSoFar = 0
    private attackTime = 0.5
    private projectileSpeed = 6

    public onEnter(): void {
        // Setting the default attack cooldown for this monster.
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        this.defaultAttackCooldown = getFinalAttackCooldown(monster.stat);
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
        // Stop movement
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        monster.animation.playAnimation("meteor", {
            duration: this.attackCooldown
        })
        monster.sound.playSoundEffect("dragon_roar")
    }

    public onExit(): void {
        
    }

    private summonMeteor(){
        let stateMachine = this.getStateMachine<DragonController>();
        let monster = stateMachine.getMonster();
        let width = 50
        let height = 50
        let {x, y} = monster.getBody().position

        // let offsetX = (width/2 + playerState.width/2)
        // let playerVelocityX = playerState.getBody().velocity.x 
        // if(playerVelocityX < 0) offsetX *= -1
        // let velocityX = playerVelocityX > 0 ? 1 : -1
        
        let projectileConfig: IProjectileConfig = {
            sprite: "meteor",
            stat: monster.stat,
            spawnX: x + 300,
            spawnY: y - 300,
            width,
            height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "NONE",
            poolType: "meteor",
            attackMultiplier: 1,
            magicMultiplier: 0,
            dontDespawnOnObstacleCollision: true,
            piercing: -1,
            // activeTime: this.getDuration() * 1000,
            // repeatAnimation: true,
            // spawnSound: "flame_dash",
            classType: "Projectile",
            originEntityId: monster.getId(),
            data: {
                owner: monster,
            },
            projectileControllerCtor: MeteorController,
            dontRotate: true,
            repeatAnimation: true,
            projectileSpeed: 200
        }
        
        monster.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, {
            ...projectileConfig,
        });
    }

    public update(deltaT: number): void {
        let stateMachine = this.getStateMachine<DragonController>();

        this.attackCooldown -= deltaT;

        if(!this.attackTriggered) {
            if(this.attackCooldown <= this.defaultAttackCooldown * (this.attackTriggerPercent)) {
                // Trigger an attack.
                // monster.animation.playAnimation("death", false);
                this.attackTriggered = true;
            }
        }
        
        if(this.attackCooldown <= 0) {
            stateMachine.changeState("Idle");
        }

        if(this.attackTriggered){
            this.timeSoFar += deltaT
            if(this.attackTime <= this.timeSoFar) {
                this.timeSoFar = 0
                let timeBetweenMeteor = 100
                for(let i=0;i<10;i++){
                    setTimeout(()=>{
                        this.summonMeteor()
                    }, timeBetweenMeteor * i);
                }
            }
        }
    }

    private resetAttack() {
        this.attackCooldown = this.defaultAttackCooldown;
        this.attackTriggered = false;
    }

}