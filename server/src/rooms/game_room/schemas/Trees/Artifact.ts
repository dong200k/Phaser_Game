import { type } from "@colyseus/schema"
import WeaponUpgradeTree from "./WeaponUpgradeTree";

export default class Artifact extends WeaponUpgradeTree {

    @type("number") artifactLevel = 1;
    private id?: string;    

    public reset(): this {
        super.reset();
        this.id = undefined;
        this.artifactLevel = 1;
        return this;
    }

    public setId(id: string) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

}