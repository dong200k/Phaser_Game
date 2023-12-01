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

    public isMaxed() {
        let nextUpgrade = this.getNextUpgrade()
        return nextUpgrade.data.status !== "none"
    }

    /** returns ugprade description for the next upgrade. If there are no upgrades remaining return the last upgrade description*/
    public getNextUpgradeDescription() {
        let curr = this.root

        while(curr?.children.length !== 0 && curr?.data.status !== "none"){
            curr = curr?.children[0]
        }

        return curr.data.description
    }

    /** return the next upgrade. If there are none it returns the last upgrade */
    public getNextUpgrade() {
        let curr = this.root

        while(curr?.children.length !== 0 && curr?.data.status !== "none"){
            curr = curr?.children[0]
        }

        return curr
    }
}