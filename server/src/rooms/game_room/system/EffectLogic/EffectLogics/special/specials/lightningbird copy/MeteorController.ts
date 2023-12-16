import Entity from "../../../../../../schemas/gameobjs/Entity";
import RangedProjectileController, { RangedProjectileControllerData } from "../../../../../StateControllers/ProjectileControllers/rangestates/RangedProjectileController";
import Fall from "./states/Fall";
import Follow from "./states/Fall";
import Finish from "./states/Finish";
import Idle from "./states/Idle";
import Impact from "./states/Impact";

export default class MeteorController extends RangedProjectileController{
    private owner?: Entity

    protected create(data: RangedProjectileControllerData): void {
        super.create(data)
        
        console.log("ON crete meteor controlelr")
        this.owner = this.getProjectile().getOriginEntity()

        this.addState(new Fall("Fall", this))
        this.addState(new Impact("Impact", this))
        this.addState(new Finish("Finish", this))
        this.addState(new Idle("Idle", this))

        this.changeState("Idle")
    }

    public getOwner(){
        return this.owner
    }
}