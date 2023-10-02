import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";


export default class WarriorAbility extends EffectLogic {

    effectLogicId: string = "warrior-ability";
    slowTime: number = 3;

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        gameManager.getDungeonManager().aggroAllMonstersOnto(entity);
        gameManager.getDungeonManager().getAllActiveMonsters().forEach((monster) => {
            EffectManager.addEffectsTo(monster, EffectFactory.createSpeedMultiplierEffectTimed(0.6, 3));
        });
    }

    
    
}
