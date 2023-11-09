import { GameEvents, IProjectileConfig } from "../../../interfaces";
import Combo1 from "./Combo1";

export default class Combo3 extends Combo1 {
    protected attackMultiplier: number = 10

    public onEnter(): void {
        this.onEnterHelper()

        this.player.animation.playAnimation("3_atk_new", {
            duration: this.animationDuraction,
            flip: this.flip
        });
    }

    protected attack(): void {
        let playerX = this.player.getBody().position.x
        let playerY = this.player.getBody().position.y

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: this.player.stat,
            spawnX: playerX,
            spawnY: playerY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Combo",
            activeTime: 1000,
            attackMultiplier: 10,
            magicMultiplier: 0,
            originEntityId: this.player.getId(),
            // spawnSound: this.spawnSound,
            width: this.player.width,
            height: this.player.height,
            visible: false,
            classType: "MeleeProjectile",
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);

        let offsetX = 50
        let offsetY = -Math.abs(90 - this.player.width)/2 - 2
        if(this.mouseX - this.player.getBody().position.x < 0) offsetX *= -1

        projectileConfig = {
            sprite: "invisible",
            stat: this.player.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Combo 3",
            activeTime: 1000,
            attackMultiplier: this.attackMultiplier,
            magicMultiplier: 0,
            originEntityId: this.player.getId(),
            // spawnSound: this.spawnSound,
            width: 105,
            height: 90,
            visible: false,
            classType: "MeleeProjectile",
            spawnSound: "small_explosion"
        }

        this.gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }
}
