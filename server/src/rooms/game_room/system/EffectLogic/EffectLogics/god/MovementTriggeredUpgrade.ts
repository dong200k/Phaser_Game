import { Body } from "matter-js";
import Player from "../../../../schemas/gameobjs/Player";
import GameManager from "../../../GameManager";
import GodUpgrade from "./GodUpgrade";
import WeaponUpgradeTree from "../../../../schemas/Trees/WeaponUpgradeTree";
import MathUtil from "../../../../../../util/MathUtil";

export default class MovementTriggeredUpgrade extends GodUpgrade{
    protected firstTime = true
    protected gameManager?: GameManager
    protected playerState?: Player
    protected distanceTraveled = 0
    protected distanceThreshold = 100
    public useEffect(playerState: Player, gameManager: GameManager, tree: WeaponUpgradeTree, playerBody: Body): void {
        if(this.firstTime){
            this.firstTime = false
            this.gameManager = gameManager
            this.playerState = playerState
        }
    }

    public update(deltaT: number): void {
        if(!this.playerState || !this.gameManager) return

        while(this.distanceTraveled > this.distanceThreshold){
            this.distanceTraveled -= this.distanceThreshold
            this.useSpecial(this.playerState, this.gameManager)
        }

        let speed = MathUtil.getSpeedFromVelocity(this.playerState.getBody().velocity)
        this.distanceTraveled += speed * deltaT/1000
    }
}