import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";


export default class WarriorShieldAttackLogic extends EffectLogic {

    effectLogicId: string = "WarriorShieldAttackLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        let playerState = entity;
        let playerX = playerState.x;
        let playerY = playerState.y;
        let offsetX = 10;
        let offsetY = 0;
        let width = 60;
        let height = 45;

        console.log("ARGS: ");
        args.forEach((arg: any) => {
            console.log(arg);
        })
        
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
            classType: "MeleeProjectile"
        }

        gameManager.getEventEmitter().emit(GameEvents.SPAWN_PROJECTILE, projectileConfig);
    }

}
