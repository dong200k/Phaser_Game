import Matter from "matter-js";
import StateNode from "../../../StateMachine/StateNode";
import MonsterController from "./MonsterController";

/** The death state is entered when the monster dies. This state is used to let the client
 * play a death animation before deactivating the monster.
 */
export default class Death extends StateNode {

    /** Time before the monster is returned to the pool. This is the time used to play the death animation */
    private defaultDeathTimer: number = 1;
    private deathTimer!: number;

    public onEnter(): void {
        this.deathTimer = this.defaultDeathTimer;
        let stateMachine = this.getStateMachine<MonsterController>();
        let monster = stateMachine.getMonster();
        Matter.Body.setVelocity(monster.getBody(), {x: 0, y: 0});
        monster.disableCollisions();

        // --- Give xp to player ---
        let playerManager = stateMachine.getPlayerManager();
        let playerThatDamagedMe = playerManager.getPlayerWithId(monster.getLastToDamage() ?? "");
        if(playerThatDamagedMe) playerManager.addXpToPlayer(20, playerThatDamagedMe);

        // console.log(playerThatDamagedMe?.xp);
        monster.animation.playAnimation("death", false);
    }

    public onExit(): void {
        
    }

    public update(deltaT: number): void {
        this.deathTimer -= deltaT;

        // Once the death timer reaches zero make the monster inactive and change to the idle state.
        if(this.deathTimer <= 0) {
            let stateMachine = this.getStateMachine<MonsterController>();
            let monster = stateMachine.getMonster();
            monster.setActive(false);
            stateMachine.changeState("Idle");
        }

    }

}