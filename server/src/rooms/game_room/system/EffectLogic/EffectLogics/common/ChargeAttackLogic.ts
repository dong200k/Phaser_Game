import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import Entity from "../../../../schemas/gameobjs/Entity";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import EffectLogic from "../../EffectLogic";


export default abstract class ChargeAttackLogic extends EffectLogic{
    public abstract useEffect(entity: Entity, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Matter.Body, {mouseX, mouseY}: {mouseX: number, mouseY: number}, chargeRatio: number): void

    /**
     * Takes in a charge ratio/percentage and returns whether or not the ratio is enough to use this charge attacks effect
     * 
     * Note: Overwrite this method for unique charge attacks with multiple charge stages. 
     * This is called by the player's controller when deciding whether to use charge attacks or player attacks. Although
     * it could be used anywhere.
     * @param chargeRatio Time charging / total charge time
     * @returns 
     */
    public abstract chargeThresholdReached(chargeRatio: number): boolean

}