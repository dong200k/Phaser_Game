import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MotherSlimeController, { MotherSlimeControllerData } from "./MotherSlimeController";
import Death from "../simplemonster/Death";
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import Entity from "../../../../schemas/gameobjs/Entity";

/** The death state is entered when the monster dies. This state is used to let the client
 * play a death animation before deactivating the monster.
 */
export default class MotherSlimeDeath extends Death {
    private projectileSprite = ""
    private slowFactor = 0.5
    private slowTime = 2
    private amount = 3
    private width = 50
    private height = 50
    private spawnOffset = 30
    private activeTime = 5
    public onEnter(): void {
        super.onEnter()
        // Spawn slowing projectile
        let stateMachine = this.getStateMachine<MotherSlimeController>();
        let monster = stateMachine.getMonster();
    }

    private spawnSlowProjectile(entity: Entity){
        let stateMachine = this.getStateMachine<MotherSlimeController>();
        let monster = stateMachine.getMonster();
        console.log(`x: ${monster.x}, y: ${monster.y}`)

        let projectileConfig: IProjectileConfig;
        projectileConfig = {
            sprite: this.projectileSprite,
            stat: monster.stat,
            spawnX: monster.x + Math.random()*this.spawnOffset,
            spawnY: monster.y + Math.random()*this.spawnOffset,
            width: this.width,
            height: this.height,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "MONSTER_PROJECTILE",
            activeTime: this.activeTime * 1000,
            poolType: "slow_monster_projectile",
            attackMultiplier: 0,
            magicMultiplier: 0,
            classType: "SlowProjectile",
            piercing: -1,
            data: {
                slowFactor: this.slowFactor,
                slowTime: this.slowTime
            }
        }
        // console.log(`spawning monster projectile at: (${projectileConfig.spawnX}, ${projectileConfig.spawnY})`);
        stateMachine.getPlayerManager().getGameManager().getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

    setConfig(data: MotherSlimeControllerData){
        this.slowFactor = data.slowFactor ?? this.slowFactor
        this.slowTime = data.slowTime ?? this.slowTime
        this.spawnOffset = data.spawnOffset ?? this.spawnOffset
        this.projectileSprite = data.slowSprite ?? this.projectileSprite
        this.width = data.width ?? this.width
        this.height = data.height ?? this.height
        this.amount = data.amount ?? this.amount
    }

    public update(deltaT: number): void {
        this.deathTimer -= deltaT;

        // Once the death timer reaches zero make the monster inactive and change to the idle state.
        if(this.deathTimer <= 0) {
            let stateMachine = this.getStateMachine<MotherSlimeController>();
            let monster = stateMachine.getMonster();
            for(let i=0;i<this.amount;i++) this.spawnSlowProjectile(monster)
            monster.setActive(false);
            stateMachine.changeState("Idle");
            
        }

    }
}