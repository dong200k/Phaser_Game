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
        if(playerThatDamagedMe) playerManager.splitXpToPlayers(20, playerManager.getAllPlayersWithinRange(playerThatDamagedMe.x, playerThatDamagedMe.y, 1000));

        // --- Give coins to player ---
        playerManager.giveAllPlayersCoin(10);

        // --- Tally up monster killed --- 
        playerManager.getGameManager().state.monstersKilled++;
        if(playerThatDamagedMe) playerThatDamagedMe.monstersKilled++;


        // console.log(playerThatDamagedMe?.xp);
        monster.animation.playAnimation("death");
        // monster.sound.playSoundEffect("player_death");
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