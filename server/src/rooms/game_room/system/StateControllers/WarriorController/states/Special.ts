import Player from "../../../../schemas/gameobjs/Player";
import StateMachine from "../../../StateMachine/StateMachine";
import StateNode from "../../../StateMachine/StateNode";
import EffectManager from "../../../StateManagers/EffectManager";
import PlayerController from "../../PlayerControllers/PlayerController";
import SpecialState from "../../PlayerControllers/CommonStates/Special";
import WarriorController from "../WarriorController";
import EffectFactory from "../../../../schemas/effects/EffectFactory";
import MathUtil from "../../../../../../util/MathUtil";
import Matter from "matter-js";

export default class Special extends SpecialState {

    public update(deltaT: number): void {
        this.timePassed += deltaT;

        // Trigger a skill if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            // Trigger skills.
            EffectManager.useTriggerEffectsOn(this.player, "player skill", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY});
            this.useSpecial();
        }

        // End attack once we pass the attackDuration.
        if(this.timePassed >= this.attackDuration) {
            this.playerController.changeState("Idle");
        }
    }

    /** Taunts, Slows, and knocksback enemies. */
    public useSpecial() {
        let gameManager = this.player.gameManager;
        let entity = this.player;
        let slowAmount = (this.playerController as WarriorController).getSlowTime();
        // Taunt Logic
        gameManager.getDungeonManager().aggroAllMonstersOnto(entity);
        let knockback = 0;
        if(entity instanceof Player && entity.playerController instanceof WarriorController) {
            knockback = entity.playerController.getKnockbackAbility();
        }
        gameManager.getDungeonManager().getAllActiveMonsters().forEach((monster) => {
            // Slow Logic           
            EffectManager.addEffectsTo(monster, EffectFactory.createSpeedMultiplierEffectTimed(0.6, slowAmount));
            // Knockback Logic
            if(knockback !== 0) {
                // Handle knockback.
                let direction = MathUtil.normalize({x: monster.x - entity.x, y: monster.y - entity.y});
                Matter.Body.setPosition(monster.getBody(), {
                    x: monster.x + knockback * direction.x,
                    y: monster.y + knockback * direction.y,
                })
            }
        });
    }
    
}