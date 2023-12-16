import Entity from "../../../../../../schemas/gameobjs/Entity";
import RangedProjectileController, { RangedProjectileControllerData } from "../../../../../StateControllers/ProjectileControllers/rangestates/RangedProjectileController";
import Follow from "./states/Follow";

export default class LightningBirdController extends RangedProjectileController{
    private owner?: Entity

    protected create(data: RangedProjectileControllerData): void {
        super.create(data)
        
        this.owner = this.getProjectile().getOriginEntity()

        this.addState(new Follow("Follow", this))
        this.changeState("Follow")
    }

    public getOwner(){
        return this.owner
    }
}