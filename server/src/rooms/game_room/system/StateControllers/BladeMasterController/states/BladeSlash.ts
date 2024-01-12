import MathUtil from "../../../../../../util/MathUtil";
import EffectManager from "../../../StateManagers/EffectManager";
import { GameEvents, IProjectileConfig } from "../../../interfaces";
import Attack from "../../PlayerControllers/CommonStates/Attack";

export default class BladeSlash extends Attack{
    protected triggerPercent: number = 0.1
    protected animationKey: string = "attack"
    private attackMultiplier = 1
    private projectileSpeed = 2
    
    

    public update(deltaT: number): void {
        this.timePassed += deltaT;
        // Trigger an attack if it hasn't been triggered and the timePassed is at the triggerPercent.
        if(!this.triggered && this.timePassed >= this.triggerPercent * this.attackDuration) {
            this.triggered = true;
            // Trigger the attack.
            this.fireSlash()
            // EffectManager.useTriggerEffectsOn(this.player, "player attack", this.player.getBody(), {mouseX: this.mouseX, mouseY: this.mouseY})            
        }

        // End attack once we pass the attackDuration.
        if(this.timePassed >= this.attackDuration) {
            this.playerController.changeState("Idle");
        }
    }
    
    private fireSlash(){
        let gameManager = this.player.gameManager
        let playerX = this.player.x
        let playerY = this.player.y
        let velocity = MathUtil.getNormalizedSpeed(this.mouseX - playerX, this.mouseY - playerY, this.projectileSpeed)

        let projectileConfig: IProjectileConfig = {
            sprite: "claymore",
            stat: this.player.stat,
            spawnX: playerX,
            spawnY: playerY,
            initialVelocity: velocity,
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Blade Master Slash",
            activeTime: 1000,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.player.getId(),
            width: 90,
            height: 80,
            // visible: false,
            classType: "FollowingMeleeProjectile",
            spawnSound: "clean_fast_slash",
            piercing: -1,
            repeatAnimation: false,
            data: {
                unTriggerPercent: 0.2,
                triggerPercent: 0.9,
                attackDuration: this.attackDuration,
                owner: this.player
            }
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }
}