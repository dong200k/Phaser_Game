import TreeUtil from "../../../../../util/TreeUtil"
import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import WeaponUpgradeTree from "../../../schemas/Trees/WeaponUpgradeTree"
import Player from "../../../schemas/gameobjs/Player"
import Stat from "../../../schemas/gameobjs/Stat"
import GameManager from "../../GameManager"
import ArtifactManager from "../../StateManagers/ArtifactManager"
import EffectManager from "../../StateManagers/EffectManager"
import SkillTreeManager from "../../StateManagers/SkillTreeManager"
import WeaponManager from "../../StateManagers/WeaponManager"
import { IUpgradeEffect } from "../../interfaces"
import WeaponUpgradeFactory from "../factories/WeaponUpgradeFactory"

describe("Artifact Tests", ()=>{
    let gameManager: GameManager
    let playerState: Player

    beforeEach(async ()=>{
        gameManager = new GameManager(new State())
        await gameManager.preload()

        //create player
        let sessionId = "fake-id"
        gameManager.getPlayerManager().createPlayer(sessionId, false)
        playerState = gameManager.getPlayerManager().getPlayerStateAndBody(sessionId).playerState

        // Unequip all artifacts, skilltrees, and weapons
        playerState.artifacts.forEach(artifact=>ArtifactManager.unEquipArtifact(playerState, artifact))
        SkillTreeManager.unEquipSkillTree(playerState)
        WeaponManager.unEquipWeaponUpgrade(playerState)

        // Update any effects from equiping initial weapon, artifacts, and skilltrees
        EffectManager.updateEffectsOn(playerState, 1)
    })

    test("Equiping a artifact grants the player its stats and effects", ()=>{
        EffectManager.updateEffectsOn(playerState, 1)
        let fullyUpgradedTestArtifact = WeaponUpgradeFactory.createUpgrade("upgrade-d251298f-b878-4a95-8864-d2a7e53fb098") as Node<WeaponData>
        expect(fullyUpgradedTestArtifact.data.name).toBe("auto-generated")
        expect(fullyUpgradedTestArtifact.data.status).toBe("selected")

        /** Calculate the stat bonus the tree should provide manually*/
        let expectedTreeStatBonus = Stat.getZeroStat()
        expectedTreeStatBonus.addScalar(1)
        expectedTreeStatBonus.addScalar(1)

        /** Make sure hard coded tree bonus is same as computed one */
        expect(TreeUtil.computeTotalStat(fullyUpgradedTestArtifact)).toEqual(expectedTreeStatBonus)

        let expectedPlayerStatAfterEquipingTree = Stat.add(expectedTreeStatBonus, playerState.stat)
        
        /** Equip artifact and compare actual player stats with expected stats */
        ArtifactManager.equipArtifact(playerState, fullyUpgradedTestArtifact)
        EffectManager.updateEffectsOn(playerState, 1)
        expect(playerState.stat).toEqual(expectedPlayerStatAfterEquipingTree)
        expect(playerState.artifacts[0].weaponId).toBe("weapon-4933503f-cd70-4076-8a99-8d90de74ab73")

        /** Check that the tree's 3 upgrade effects are on the player */
        expect(playerState.effects.length).toBe(4) // 1 stat compound effect + 3 upgrade effects

        /** Check that the 3 upgrade effects have the effectLogicIds which is use to reference the effectLogic */
        let sort = (a: string, b: string)=> a===b? 0: a<b? -1 : 1
        let effectLogicIds = ["test-effect2", "test-effect2", "test-effect1"].sort(sort)
        let effectLogicIdsOnPlayer = playerState.effects.filter(effect=>"effectLogicId" in effect).map((effect: IUpgradeEffect)=>effect.effectLogicId).sort(sort)
        expect(effectLogicIds).toEqual(effectLogicIdsOnPlayer)
    })
    test("Unequipping a artifact removes from the player its stats and effects", ()=>{
        let fullyUpgradedTestArtifact = WeaponUpgradeFactory.createUpgrade("upgrade-d251298f-b878-4a95-8864-d2a7e53fb098") as Node<WeaponData>
        expect(fullyUpgradedTestArtifact.data.name).toBe("auto-generated")
        expect(fullyUpgradedTestArtifact.data.status).toBe("selected")
        
        /** Equip artifact */
        let artifactTree = ArtifactManager.equipArtifact(playerState, fullyUpgradedTestArtifact)
        expect(artifactTree instanceof WeaponUpgradeTree).toBeTruthy()
        EffectManager.updateEffectsOn(playerState, 1)
        
        /** Compute expected stat after unequipping artifact */
        let artifactTotalStat = TreeUtil.getTotalStat(artifactTree as WeaponUpgradeTree)
        let expectedPlayerStatAfterUnEquipingTree = Stat.sub(playerState.stat, artifactTotalStat)

        /** Unequip artifact */
        ArtifactManager.unEquipArtifact(playerState, artifactTree as WeaponUpgradeTree)

        /** Check player stat changed correctly */
        expect(expectedPlayerStatAfterUnEquipingTree).toEqual(playerState.stat)
    })
    test(`Player can equip upto ${ArtifactManager.MAX_ARTIFACT_COUNT} artifacts`, ()=>{
        let count = ArtifactManager.MAX_ARTIFACT_COUNT + 1

        for(let i=0;i<count;i++){
            let fullyUpgradedTestArtifact = WeaponUpgradeFactory.createUpgrade("upgrade-d251298f-b878-4a95-8864-d2a7e53fb098") as Node<WeaponData>
            ArtifactManager.equipArtifact(playerState, fullyUpgradedTestArtifact)
        }

        expect(playerState.artifacts.length).toBe(ArtifactManager.MAX_ARTIFACT_COUNT)
    })
})