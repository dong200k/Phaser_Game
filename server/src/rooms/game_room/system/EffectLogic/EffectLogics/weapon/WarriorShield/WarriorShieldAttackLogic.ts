import WeaponUpgradeTree from "../../../../../schemas/Trees/WeaponUpgradeTree";
import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import WarriorController from "../../../../StateControllers/WarriorController/WarriorController";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";


export default class WarriorShieldAttackLogic extends EffectLogic {

    effectLogicId: string = "WarriorShieldAttackLogic";

    public useEffect(entity: Entity, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, {mouseX, mouseY}: {mouseX: number, mouseY: number}, chargeRatio: number): void {
        let playerState = entity;
        let playerX = playerState.x;
        let playerY = playerState.y;
        let offsetX = 15;
        let offsetY = -5;
        let width = 70;
        let height = 40;
        let knockback = 0;

        if(entity instanceof Player && entity.playerController instanceof WarriorController) {
            knockback = entity.playerController.getKnockbackAttack();
            // console.log(knockback);
        }

        // If the mouseX position is less than the player's position change offsetX to -offsetX.
        if(mouseX < playerX) offsetX *= -1;

        let projectileConfig: IProjectileConfig = {
            sprite: "invisible",
            stat: playerState.stat,
            spawnX: playerX + offsetX,
            spawnY: playerY + offsetY,
            initialVelocity: {x: 0, y: 0},
            collisionCategory: "PLAYER_PROJECTILE",
            poolType: "Berserker Charge 1",
            activeTime: 300,
            attackMultiplier: 1,
            magicMultiplier: 0,
            originEntityId: playerState.getId(),
            spawnSound: "sword_swish",
            width: width,
            height: height,
            visible: false,
            classType: "MeleeProjectile",
            knockback: {
                distance: knockback,
                direction: {
                    x: offsetX,
                    y: 0,
                }
            },
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

}
