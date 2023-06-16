import TreeUtil from "../../../../../util/TreeUtil"
import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import StatEffect from "../../../schemas/effects/temp/StatEffect"
import Player from "../../../schemas/gameobjs/Player"
import Stat from "../../../schemas/gameobjs/Stat"
import GameManager from "../../GameManager"
import WeaponManager from "../../StateManagers/WeaponManager"
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
        let upgradeTree = playerState.weaponUpgradeTree

        // Check that player's upgradeTree's root has same structure as bow upgrade
        expect(upgradeTree.root).toEqual(WeaponUpgradeFactory.createBowUpgrade())
        
        // Check that player's upgradeTree has a weaponId of the first weapon in the bow upgrade, "bow-id"
        expect(upgradeTree.weaponId).toBe("bow-id")
    })
    test("Equiping a WeaponUpgradeTree grants the player its stats and effects", ()=>{
        let upgradeTree = playerState.weaponUpgradeTree

        let swordUpgrade = WeaponUpgradeFactory.createSwordUpgrade()
        expect(swordUpgrade).toBeTruthy()

        WeaponManager.equipWeaponUpgrade(playerState, swordUpgrade as Node<WeaponData>)
        
        // Check that player's upgradeTree's root has same structure as sword upgrade
        expect(upgradeTree.root).toEqual(WeaponUpgradeFactory.createSwordUpgrade())

        // Check that player's upgradeTree has a weaponId of the first weapon in the sword upgrade, "sword-id"
        expect(upgradeTree.weaponId).toBe("sword-id")
    })
    test("Unequipping a WeaponUpgradeTree removes from the player its stats and effects", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades?.length).toBe(3)
    })
    test("Switching WeaponUpgradeTree/Equiping a new tree while the player has a tree updates properly", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        // Select 1st upgrade
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        
        WeaponManager.selectUpgrade(playerState, upgrades as any, 1)
        
        // Check that the upgrade is selected 
        let children = playerState.weaponUpgradeTree.root!.children
        
        expect(children[1].data.status).toBe("selected")
        expect(children[0].data.status).toBe("skipped")
        expect(children[2].data.status).toBe("skipped")
    })
    test("Selecting WeaponUpgradeTree's upgrade will mark upgrades at the same depth as skipped", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        // Select 1st upgrade
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades as any, 1)

        // Get new list of upgrades which should be from depth 2, which has 2 upgrades there
        upgrades = WeaponManager.getAvailableUpgrades(playerState)

        expect(upgrades.length).toBe(2)
    })
    test("Selecting a WeaponUpgradeTree's node with a weaponId changes the base weapon/weaponId of the weapon tree", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        expect(playerState.weaponUpgradeTree.weaponId).toBe('bow-id')

        // Select 1st upgrade which has a sword-id
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades, 1)

        //Check that the weapon changes
        expect(playerState.weaponUpgradeTree.weaponId).toBe('sword-id')
    })
    test("Selecting an upgrade applies the upgrade's stat bonus to the Entity's effects", ()=>{
    })
    test("Selecting an upgrade with an effect applies the effect to the Entity's effects", ()=>{
    })
    test("Selecting multiple WeaponUpgrade Tree's upgrades correctly modifies player stats and tree's weapon", ()=>{
        /** Checks that after selecting upgrade, player and player's weaponUpgradeTree's stats properly changes */
        function helper(upgradeNodeStat: Stat, selectUpgrade: any){
            let originalPlayerStat = Stat.add(Stat.getZeroStat(), playerState.stat)
            let expectedPlayerStatAfterUpgrade = Stat.add(originalPlayerStat, upgradeNodeStat)

            let originalTreeStat = Stat.add(Stat.getZeroStat(), playerState.weaponUpgradeTree.totalStat)
            let expectedTreeStatAfterUpgrade = Stat.add(originalTreeStat, upgradeNodeStat)

            // Player stat/effects properly changes after selecting upgrade
            selectUpgrade()
            expect(playerState.stat).toEqual(expectedPlayerStatAfterUpgrade)
            expect(playerState.effects.length).toBe(1)
            expect(playerState.effects[0] instanceof StatEffect).toBeTruthy()

            // Expect tree stat to change properly
            let computedTreeStat = TreeUtil.computeTotalStat(playerState.weaponUpgradeTree)
            let actualTreeStat = playerState.weaponUpgradeTree.totalStat
            expect(actualTreeStat).toEqual(expectedTreeStatAfterUpgrade) // actual tree stat should be original stat + upgrade stat
            expect(actualTreeStat).toEqual(computedTreeStat) // Actual stat on tree should be same as one computed with DFS
        }

        // Equip bow upgrade tree, check weapon is bow
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade!)
        expect(playerState.weaponUpgradeTree.weaponId).toBe('weapon-6eddff90-5083-401a-99f9-869e1f058d72')

        // Select 2nd upgrade which has a sword-id, check weapon is now sword
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        let choice = 1
        let upgrade1 = upgrades[choice]
        let selectUpgrade = () => WeaponManager.selectUpgrade(playerState, upgrades, choice)
        helper(upgrade1.data.stat, selectUpgrade) // Check player and weapon tree changed properly

        // Check player effects properly changed
        expect(playerState.effects.length).toBe(1)
        expect(playerState.effects[0] instanceof StatEffect).toBeTruthy()

        // Get new upgrades at next depth and select 1st upgrade
        upgrades = WeaponManager.getAvailableUpgrades(playerState)
        choice = 0
        let upgrade2 = upgrades[choice]
        selectUpgrade = () => WeaponManager.selectUpgrade(playerState, upgrades, choice)
        helper(upgrade2.data.stat, selectUpgrade) // Check player and weapon tree changed properly
        
        // Check player's effects has 2 stat effects from the 2 upgrades
        expect(playerState.effects.length).toBe(2)
        expect(playerState.effects[0] instanceof StatEffect).toBeTruthy()
        expect(playerState.effects[1] instanceof StatEffect).toBeTruthy()
    })
    // test("Database upgrades are loaded", ()=>{
        
    // })
})