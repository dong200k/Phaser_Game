import { type } from "@colyseus/schema"
import WeaponUpgradeTree from "./WeaponUpgradeTree";

export default class Artifact extends WeaponUpgradeTree {

    @type("number") artifactLevel = 1;

    public reset(): this {
        super.reset();
        this.artifactLevel = 1;
        return this;
    }

}