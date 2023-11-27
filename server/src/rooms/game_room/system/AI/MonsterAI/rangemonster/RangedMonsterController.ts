import Monster from "../../../../schemas/gameobjs/monsters/Monster";
import MonsterController from "../simplemonster/MonsterController";
import RangedAttack from "./states/RangedAttack";

export interface RangedMonsterControllerData {
    monster: Monster;
    projectileSprite?: string;
}

/** The monster controller contains ai that allows a monster to follow a player, and attack a player. */
export default class RangedMonsterController extends MonsterController {

    private projectileSprite: string = "purple_arrow"
    protected create(data: RangedMonsterControllerData): void {
        super.create(data)

        this.projectileSprite = data.projectileSprite ?? "purple_arrow"

        this.removeState("Attack")
        this.addState(new RangedAttack("Attack", this))

        //Set initial state
        this.changeState("Idle");
    }

    public getProjectileSprite(){
        return this.projectileSprite
    }
}