import TreeUtil from "../../../../../util/TreeUtil"
import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import CompoundEffect from "../../../schemas/effects/combo/CompoundEffect"
import Player from "../../../schemas/gameobjs/Player"
import Stat from "../../../schemas/gameobjs/Stat"
import GameManager from "../../GameManager"
import EffectManager from "../../StateManagers/EffectManager"
import WeaponManager from "../../StateManagers/WeaponManager"
import { IUpgradeEffect } from "../../interfaces"
import WeaponUpgradeFactory from "../factories/WeaponUpgradeFactory"

describe("Weapon Upgrade Tests", ()=>{
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

    test("Player has correct starter weapon based on role", ()=>{
        /** TODO */
    })
    test("Equiping a WeaponUpgradeTree grants the player its stats and effects", ()=>{
        WeaponManager.unEquipWeaponUpgrade(playerState)
        
        let fullyUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-0e4060c7-7928-4324-8833-4ac00d1936c5") as Node<WeaponData>
        expect(fullyUpgradedTestWeapon.data.name).toBe("test")

        /** Calculate the stat bonus the tree should provide manually*/
        let expectedTreeStatBonus = Stat.getZeroStat()
        expectedTreeStatBonus.addScalar(1)
        expectedTreeStatBonus.speed += 2 
        expectedTreeStatBonus.maxHp += 100

        /** Make sure hard coded tree bonus is same as computed one */
        expect(TreeUtil.computeTotalStat(fullyUpgradedTestWeapon)).toEqual(expectedTreeStatBonus)

        let expectedPlayerStatAfterEquipingTree = Stat.add(expectedTreeStatBonus, playerState.stat)
        
        /** Equip weapon and compare actual player stats with expected stats */
        WeaponManager.equipWeaponUpgrade(playerState, fullyUpgradedTestWeapon)
        EffectManager.updateEffectsOn(playerState, 1)
        expect(playerState.stat).toEqual(expectedPlayerStatAfterEquipingTree)
        expect(playerState.weaponUpgradeTree.weaponId).toBe("weapon-4933503f-cd70-4076-8a99-8d90de74ab73")

        /** Check that the tree's 2 upgrade effects are on the player */
        expect(playerState.effects.length).toBe(3) // 1 stat compound effect + 2 upgrade effects

        /** Check that the 2 upgrade effects have the effectLogicIds which is use to reference the effectLogic */
        let sort = (a: string, b: string)=> a===b? 0: a<b? -1 : 1
        let effectLogicIds = ["test-effect2", "test-effect3"].sort(sort)
        let effectLogicIdsOnPlayer = playerState.effects.filter(effect=>"effectLogicId" in effect).map((effect: IUpgradeEffect)=>effect.effectLogicId).sort(sort)
        expect(effectLogicIds).toEqual(effectLogicIdsOnPlayer)
    })
    test("Unequipping a WeaponUpgradeTree removes from the player its stats and effects", ()=>{
        WeaponManager.unEquipWeaponUpgrade(playerState)
        EffectManager.updateEffectsOn(playerState, 1)

        /** Equip the tree to test */
        let fullyUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-0e4060c7-7928-4324-8833-4ac00d1936c5") as Node<WeaponData>
        WeaponManager.equipWeaponUpgrade(playerState, fullyUpgradedTestWeapon)
        EffectManager.updateEffectsOn(playerState, 1)

        /** Check that the tree's 2 upgrade effects are on the player */
        expect(playerState.effects.length).toBe(3) // 1 stat compound effect + 2 upgrade effects

        let expectedStatAfterUnequip = Stat.sub(playerState.stat, playerState.weaponUpgradeTree.totalStat)

        /** Unequip and check that stats are correct */
        WeaponManager.unEquipWeaponUpgrade(playerState)
        expect(playerState.stat).toEqual(expectedStatAfterUnequip)

        /** Check upgrade effects removed */
        expect(playerState.effects.length).toBe(1) // Only the compound effect left
        expect(playerState.effects[0] instanceof CompoundEffect).toBeTruthy()
    })
    test("Switching WeaponUpgradeTree/Equiping a new tree while the player has a tree updates properly", ()=>{
        let partialUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-611328eb-9370-4263-9b80-1d27682ff4ed") as Node<WeaponData>
        let fullyUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-0e4060c7-7928-4324-8833-4ac00d1936c5") as Node<WeaponData>

        // Unequip current tree and equip a new one
        WeaponManager.unEquipWeaponUpgrade(playerState)
        WeaponManager.equipWeaponUpgrade(playerState, partialUpgradedTestWeapon)
        expect(playerState.weaponUpgradeTree.root).toBe(partialUpgradedTestWeapon)
        EffectManager.updateEffectsOn(playerState, 1)

        /** Compute Expected Stat after swap */
        let expectedStatAfterUnequip = Stat.sub(playerState.stat, playerState.weaponUpgradeTree.totalStat)
        let expectedStatAfterSwap = Stat.add(expectedStatAfterUnequip, TreeUtil.computeTotalStat(fullyUpgradedTestWeapon))
        
        /** Swap to the tree to test */
        WeaponManager.swapWeaponUpgrade(playerState, fullyUpgradedTestWeapon)
        EffectManager.updateEffectsOn(playerState, 1)
        expect(playerState.weaponUpgradeTree.root).toBe(fullyUpgradedTestWeapon) // Check that root changed to new tree
        expect(playerState.weaponUpgradeTree.weaponId).toBe("weapon-4933503f-cd70-4076-8a99-8d90de74ab73")

        /** Check that stats are correct */
        expect(expectedStatAfterSwap).toEqual(playerState.stat)

        /** Check that the tree's 2 upgrade effects are on the player */
        expect(playerState.effects.length).toBe(3) // 1 stat compound effect + 2 upgrade effects
    })
    test("Selecting WeaponUpgradeTree's upgrade will mark upgrades at the same depth as skipped", ()=>{
        let partialUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-611328eb-9370-4263-9b80-1d27682ff4ed") as Node<WeaponData>

        // Unequip current tree and equip a new one
        WeaponManager.swapWeaponUpgrade(playerState, partialUpgradedTestWeapon)
        expect(playerState.weaponUpgradeTree.root).toBe(partialUpgradedTestWeapon)

        // Select 2nd upgrade
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades, 1)

        // Other upgrades at same depth are skipped
        expect(upgrades[0].data.status).toBe("skipped")
        expect(upgrades[2].data.status).toBe("skipped")

        // Chosen upgrade is selected
        expect(upgrades[1].data.status).toBe("selected")
    })
    test("Selecting a WeaponUpgradeTree's node with a weaponId changes the base weapon/weaponId of the weapon tree", ()=>{
        let unUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-f7beeffa-d852-4581-b323-fb389511dfd2", false) as Node<WeaponData>

        // Unequip current tree and equip a new one
        WeaponManager.swapWeaponUpgrade(playerState, unUpgradedTestWeapon)
        expect(playerState.weaponUpgradeTree.root).toBe(unUpgradedTestWeapon)

        // Select only upgrade
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades, 0)

        // Chosen upgrade is selected and Weapon of tree changes since this node has a weaponId
        expect(upgrades[0].data.status).toBe("selected")
        expect(playerState.weaponUpgradeTree.weaponId).toBe("weapon-e8bd96d2-315e-4aa2-b583-b502c68b100f")

        // Select 2nd upgrade
        upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades, 1)

        // Chosen upgrade is selected and Weapon of tree changes since this node has a weaponId
        expect(upgrades[1].data.status).toBe("selected")
        expect(playerState.weaponUpgradeTree.weaponId).toBe("weapon-4933503f-cd70-4076-8a99-8d90de74ab73")
        
    })
    test("Selecting an upgrade applies the upgrade's stat bonus to the Entity's effects", ()=>{
        let unUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-f7beeffa-d852-4581-b323-fb389511dfd2", false) as Node<WeaponData>

        // Unequip current tree and equip a new one
        WeaponManager.swapWeaponUpgrade(playerState, unUpgradedTestWeapon)
        expect(playerState.weaponUpgradeTree.root).toBe(unUpgradedTestWeapon)

        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        let expectedPlayerStatAfterUpgrade = Stat.add(playerState.stat, upgrades[0].data.stat)

        // Select only upgrade and check player stats are correct
        WeaponManager.selectUpgrade(playerState, upgrades, 0)
        EffectManager.updateEffectsOn(playerState, 1)
        expect(playerState.stat).toEqual(expectedPlayerStatAfterUpgrade)
    })
    test("Selecting an upgrade with an effect applies the effect to the Entity's effects", ()=>{
        let unUpgradedTestWeapon = WeaponUpgradeFactory.createUpgrade("upgrade-f7beeffa-d852-4581-b323-fb389511dfd2", false) as Node<WeaponData>

        // Unequip current tree and equip a new one
        WeaponManager.swapWeaponUpgrade(playerState, unUpgradedTestWeapon)
        expect(playerState.weaponUpgradeTree.root).toBe(unUpgradedTestWeapon)

        let upgrades = WeaponManager.getAvailableUpgrades(playerState)

        // Select only upgrade and check that the effect, test-effect1 is added
        WeaponManager.selectUpgrade(playerState, upgrades, 0)
        expect(playerState.effects.length).toBe(2) // 1 compound stat effect and the effect on the upgrade node
        expect(playerState.effects.find(e=>"effectLogicId" in e && e.effectLogicId === "test-effect1")).toBeTruthy()
    })
    // test("Database upgrades are loaded", ()=>{
        
    // })
})