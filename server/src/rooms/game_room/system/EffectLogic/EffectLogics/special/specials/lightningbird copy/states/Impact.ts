import Matter from "matter-js";
import MathUtil from "../../../../../../../../../util/MathUtil";
import { getFinalSpeed } from "../../../../../../Formulas/formulas";
import StateNode from "../../../../../../StateMachine/StateNode";
import Entity from "../../../../../../../schemas/gameobjs/Entity";
import Monster from "../../../../../../../schemas/gameobjs/monsters/Monster";
import Player from "../../../../../../../schemas/gameobjs/Player";
import MeteorController from "../MeteorController";
import { GameEvents, IProjectileConfig } from "../../../../../../interfaces";

/** In this state the projectile will play the explode animation and also be collideable */
export default class Impact extends StateNode{    
    private duration = 1
    private timeSoFar = 0

    public onEnter(): void {
        // this.spawnExplodingProjectile()
        this.timeSoFar = 0
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()

        if(projectile.getOriginEntity() instanceof Monster){
            projectile.setCollision("MONSTER_PROJECTILE")
        }else{
            projectile.setCollision("PLAYER_PROJECTILE")
        }
        Matter.Body.setVelocity(projectile.getBody(), {x: 0, y: 0})
        projectile.animation.playAnimation("explode", {
            duration: this.duration
        })
        this.spawnExplosion()
    }
    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        this.timeSoFar += deltaT
        if(this.timeSoFar >= this.duration){
            this.getStateMachine().changeState("Finish")
        }
    }

    public spawnExplosion(){
        let stateMachine = (this.getStateMachine() as MeteorController);
        let projectile = stateMachine.getProjectile()
        let owner = projectile.getOriginEntity()
        if(!owner) return
        let projectileConfig: IProjectileConfig = {
            sprite: "explosion",
            stat: owner.stat,
            spawnX: projectile.x,
            spawnY: projectile.y,
            width: 120,
            height: 120,
            initialVelocity: {x: 0, y:0},
            collisionCategory: "NONE",
            activeTime: 1000,
            poolType: "explosion_circle_indicator_monster_projectile",
            attackMultiplier: 1,
            magicMultiplier: 0,
            classType: "Projectile",
            animationKey: "explode",
            spawnSound: "small_explosion"
        }
        // console.log(`spawning monster projectile at: (${projectileConfig.spawnX}, ${projectileConfig.spawnY})`);
        projectile.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }
}