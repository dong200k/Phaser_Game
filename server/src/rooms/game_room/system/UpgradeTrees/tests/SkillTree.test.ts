import State from "../../../schemas/State"
import SkillData from "../../../schemas/Trees/Node/Data/SkillData"
import Node from "../../../schemas/Trees/Node/Node"
import Player from "../../../schemas/gameobjs/Player"
import Stat from "../../../schemas/gameobjs/Stat"
import GameManager from "../../GameManager"
import SkillTreeFactory from "../factories/SkillTreeFactory"
import SkillTreeManager from "../../StateManagers/SkillTreeManager"
import EffectManager from "../../StateManagers/EffectManager"
import TreeUtil from "../../../../../util/TreeUtil"

describe("Skill Tree Tests", ()=>{
    let gameManager: GameManager
    let playerState: Player

    beforeEach(async ()=>{
        gameManager = new GameManager(new State())
        await gameManager.preload()

        //create player
        let sessionId = "fake-id"
        gameManager.playerManager.createPlayer(sessionId, false)
        playerState = gameManager.playerManager.getPlayerStateAndBody(sessionId).playerState
    })
    test("Equiping a Skill tree grants the player its stats and effects", ()=>{
        EffectManager.updateEffectsOn(playerState, 1)
        let skillTree = SkillTreeFactory.createUpgradedAdventurerSkill() as Node<SkillData>

        // Compute expected stats
        let expectedTreeStat = TreeUtil.computeTotalStat(skillTree)
        let expectedPlayerStatAfterEquipingTree = Stat.add(playerState.stat, expectedTreeStat)

        // Equip skill tree
        SkillTreeManager.equipSkillTree(playerState, skillTree as Node<SkillData>)
        EffectManager.updateEffectsOn(playerState, 1)

        // Check that player stat changed properly
        expect(expectedPlayerStatAfterEquipingTree).toEqual(playerState.stat)
    })
    test("Unequipping a Skill tree removes from the player its stats and effects", ()=>{
        let skillTree = SkillTreeFactory.createUpgradedAdventurerSkill() as Node<SkillData>

        // Equip skill tree
        SkillTreeManager.equipSkillTree(playerState, skillTree as Node<SkillData>)
        EffectManager.updateEffectsOn(playerState, 1)

        // Compute expected stats for removing skill tree
        let expectedTreeStat = SkillTreeManager.getTotalStat(playerState)
        let expectedPlayerStatAfterUnEquipingTree = Stat.sub(playerState.stat, expectedTreeStat)

        /** check stats changed and after unequiping skill tree*/
        SkillTreeManager.unEquipSkillTree(playerState)
        expect(playerState.skillTree.root).toBe(undefined)
        expect(playerState.stat).toEqual(expectedPlayerStatAfterUnEquipingTree)
    })
    test("Switching SkillTree/unequipping a new tree while the player has a tree works properly", ()=>{
        let fullyUpgradedSkillTree= SkillTreeFactory.createUpgradedAdventurerSkill() as Node<SkillData>
        let unUpgradedSkillTree = SkillTreeFactory.createAdventurerSkill() as Node<SkillData>

        /** Unequip current skill tree if any */
        SkillTreeManager.unEquipSkillTree(playerState)

        /** Equip the 1st skill tree */
        SkillTreeManager.equipSkillTree(playerState, fullyUpgradedSkillTree)
        EffectManager.updateEffectsOn(playerState, 1)

        let expectedStatAfterSwap = Stat.sub(playerState.stat, playerState.skillTree.totalStat)

        SkillTreeManager.swapSkillTree(playerState, unUpgradedSkillTree)
        EffectManager.updateEffectsOn(playerState, 1)
        
        // Expect stats to properly update and tree to be swaped
        expect(expectedStatAfterSwap).toEqual(playerState.stat)
        expect(playerState.skillTree.root).toEqual(unUpgradedSkillTree)
    })
    test("Player can receive next available upgrades in the tree", ()=>{
        let unUpgradedSkillTree = SkillTreeFactory.createAdventurerSkill() as Node<SkillData>
        SkillTreeManager.swapSkillTree(playerState, unUpgradedSkillTree)

        let upgrades = SkillTreeManager.getAvailableUpgrades(playerState)
        expect(upgrades.length).toBe(1)

        // Select upgrade to get next set of upgrades
        SkillTreeManager.selectUpgrade(playerState, upgrades, 0)

        upgrades = SkillTreeManager.getAvailableUpgrades(playerState)
        expect(upgrades.length).toBe(9)
    })
    test("Selecting an Skill tree's upgrade applies the upgrade's stat bonus to the Entity's effects", ()=>{
        EffectManager.updateEffectsOn(playerState, 1)
        let unUpgradedSkillTree = SkillTreeFactory.createAdventurerSkill() as Node<SkillData>
        SkillTreeManager.swapSkillTree(playerState, unUpgradedSkillTree)

        let upgrades = SkillTreeManager.getAvailableUpgrades(playerState)
        expect(upgrades.length).toBe(1)

        let expectedPlayerStatAfterUpgrade = Stat.add(playerState.stat, upgrades[0].data.stat)

        // Select upgrade to get next set of upgrades
        SkillTreeManager.selectUpgrade(playerState, upgrades, 0)
        EffectManager.updateEffectsOn(playerState, 1)

        expect(expectedPlayerStatAfterUpgrade).toEqual(playerState.stat)
    })
    // test("Skill tree is properly initialized with its stat effects applied to the player when the game starts", ()=>{
    // })
})