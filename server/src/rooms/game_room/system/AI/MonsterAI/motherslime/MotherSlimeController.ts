import Chest, { ChestRarity } from "../../../../schemas/gameobjs/chest/Chest";
import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import StateMachine from "../../../StateMachine/StateMachine";
import PlayerManager from "../../../StateManagers/PlayerManager";
import Idle from "../simplemonster/Idle";
import MonsterController from "../simplemonster/MonsterController";
import MotherSlimeDeath from "./MotherSlimeDeath";

export interface MotherSlimeControllerData {
    monster: Monster;
    /** slow factor 0.3 means 30% slow */
    slowFactor?: number;
    /** slow time in seconds */
    slowTime?: number;
    /** offset used to spawn the death slow projectile */
    spawnOffset?: number;
    /** width of the slow projectile */
    width?: number;
    /** height of the slow projectile */
    height?: number;
    /** Sprite for the slow projectile */
    slowSprite?: string;
    /** Amount of slow projectiles to spawn */
    amount?: number;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class MotherSlimeController extends MonsterController {

    protected playerManager!: PlayerManager;
    protected monster!: Monster;
    protected deathChestRarity?: ChestRarity

    protected create(data: MotherSlimeControllerData): void {
        super.create(data)
        this.removeState("Death")
        //Death state
        let death = new MotherSlimeDeath("Death", this);
        this.addState(death);
        death.setConfig(data)

        //Set initial state
        this.changeState("Idle");
    }
}