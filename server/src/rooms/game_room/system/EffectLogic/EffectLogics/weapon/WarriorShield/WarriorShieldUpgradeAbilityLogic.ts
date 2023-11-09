import Entity from "../../../../../schemas/gameobjs/Entity";
import Player from "../../../../../schemas/gameobjs/Player";
import GameManager from "../../../../GameManager";
import WarriorController from "../../../../StateControllers/WarriorController/WarriorController";
import { GameEvents, IProjectileConfig } from "../../../../interfaces";
import EffectLogic from "../../../EffectLogic";
import WarriorAbility from "../../abilities/WarriorAbility/WarriorAbility";


export default class WarriorShieldUpgradeAbilityLogic extends EffectLogic {

    effectLogicId: string = "WarriorShieldUpgradeAbilityLogic";

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        // Search for the player's ability class and run the upgradeSlowTime() method on it.
        // let playerState = entity;
        // if(playerState instanceof Player) {
        //     playerState.abilities.forEach((ability) => {
        //         if(ability.effectLogicId === "warrior-ability") {
        //             let warriorAbility = ability.getEffectLogic();
        //             if(warriorAbility) (warriorAbility as WarriorAbility).upgradeSlowTime();
        //         }
        //     })
        // }
        if(entity instanceof Player && entity.playerController instanceof WarriorController) {
            entity.playerController.upgradeSlowTime();
        }
    }

}
