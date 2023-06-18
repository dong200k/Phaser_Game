import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData";
import Node from "../../../schemas/Trees/Node/Node";
import ArtifactManager from "../../StateManagers/ArtifactManager";
import WeaponUpgradeFactory from "./WeaponUpgradeFactory";

export default class ArtifactFactory{
    /**
     * @returns returns a fully upgraded hermes boots artifact tree's root to be used by a single player
     */
    static createUpgradedHermesBoot(){
        let artifact = WeaponUpgradeFactory.createUpgrade('upgrade-a4275241-dc56-4ea3-88cc-775c58bd64ce', false) as Node<WeaponData>
        ArtifactManager.selectAllUpgrades(artifact)

        return artifact
    }
}