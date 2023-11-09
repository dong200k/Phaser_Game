import { GameEvents, IProjectileConfig } from "../../../interfaces";
import Combo1 from "./Combo1";

export default class Combo2 extends Combo1 {
    protected attackMultiplier: number = 5

    public onEnter(): void {
        this.onEnterHelper()

        this.player.canMove = true
        this.player.animation.playAnimation("Spin_Attack", {
            duration: this.animationDuraction,
            flip: this.flip
        });
    }

    protected attack(): void {
        // Spawn arrows and make them fly up
        let playerX = this.player.getBody().position.x
        let playerY = this.player.getBody().position.y
        let offsetX = 10
        let offsetY = -5
        if(this.mouseX - this.player.getBody().position.x < 0) offsetX *= -1

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: this.player.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Combo 2",
            activeTime: 1000,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.player.getId(),
            // spawnSound: this.spawnSound,
            width: 140,
            height: 55,
            visible: false,
            classType: "FollowingMeleeProjectile",
            data: {
                owner: this.player,
                offsetX,
                offsetY
            },
            spawnSound: "clean_fast_slash"
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }
}
