import EffectFactory from "../../../../../schemas/effects/EffectFactory";
import Entity from "../../../../../schemas/gameobjs/Entity";
import GameManager from "../../../../GameManager";
import EffectManager from "../../../../StateManagers/EffectManager";
import EffectLogic from "../../../EffectLogic";


export default class WarriorAbility extends EffectLogic {

    effectLogicId: string = "warrior-ability";
    slowTimes = [3, 6, 9]; // An array of the slow times that can be upgraded. Starts at index 0.
    slowTimeLevel = 0; // The slowTime index. Starting from 0.

    public useEffect(entity: Entity, gameManager: GameManager, ...args: any): void {
        gameManager.getDungeonManager().aggroAllMonstersOnto(entity);
        gameManager.getDungeonManager().getAllActiveMonsters().forEach((monster) => {
            EffectManager.addEffectsTo(monster, EffectFactory.createSpeedMultiplierEffectTimed(0.6, this.slowTimes[this.slowTimeLevel]));
        });
    }

    /** Upgrades the slow time of the warrior ability. This method wont do anything when the level is 
     * maxxed out.
     * @returns True if the upgrade was successful. False otherwise.
     */
    public upgradeSlowTime() {
        this.slowTimeLevel++;
        if(this.slowTimeLevel >= this.slowTimes.length) {
            this.slowTimeLevel = this.slowTimes.length - 1;
            return false;
        } 
        return true;
    }
    
    
}
