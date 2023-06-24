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

    /**
     * @returns returns a fully upgraded frost glaive artifact tree's root to be used by a single player
     */
    static createUpgradeFrostGlaive(){
        let artifact = WeaponUpgradeFactory.createUpgrade('upgrade-6c21dc6f-d21f-430d-b31a-93ca9583d842', false) as Node<WeaponData>
        ArtifactManager.selectAllUpgrades(artifact)

        return artifact
    }

    static createDemo(){
        let artifact = WeaponUpgradeFactory.createUpgrade('upgrade-f831783f-9c3b-40fb-aa62-4e29dfe84664', false) as Node<WeaponData>
        ArtifactManager.selectAllUpgrades(artifact)

        return artifact
    }

}