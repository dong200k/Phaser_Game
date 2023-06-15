import TreeUtil from "../../../../../util/TreeUtil"
import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
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

    test("Player has bow upgrade tree by default", ()=>{
        let upgradeTree = playerState.weaponUpgradeTree

        // Check that player's upgradeTree's root has same structure as bow upgrade
        expect(upgradeTree.root).toEqual(WeaponUpgradeFactory.createBowUpgrade())
        
        // Check that player's upgradeTree has a weaponId of the first weapon in the bow upgrade, "bow-id"
        expect(upgradeTree.weaponId).toBe("bow-id")
    })
    test("Player can switch a weapon upgrade tree", ()=>{
        let upgradeTree = playerState.weaponUpgradeTree

        let swordUpgrade = WeaponUpgradeFactory.createSwordUpgrade()
        expect(swordUpgrade).toBeTruthy()

        WeaponManager.equipWeaponUpgrade(playerState, swordUpgrade as Node<WeaponData>)
        
        // Check that player's upgradeTree's root has same structure as sword upgrade
        expect(upgradeTree.root).toEqual(WeaponUpgradeFactory.createSwordUpgrade())

        // Check that player's upgradeTree has a weaponId of the first weapon in the sword upgrade, "sword-id"
        expect(upgradeTree.weaponId).toBe("sword-id")
    })
    test("Player can receive next available upgrades in the tree", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades?.length).toBe(3)
    })
    test("Player can select a weapon upgrade, which skips upgrades on same level", ()=>{
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
    test("Selecting weapon upgrades will invalidate/skip upgrades at the same depth when upgrades are choosen again", ()=>{
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
    test("Selecting a weapon upgrade with a weaponId changes the base weapon/weaponId of the weapon tree", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        expect(playerState.weaponUpgradeTree.weaponId).toBe('bow-id')

        // Select 1st upgrade which has a sword-id
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades as any, 1)

        //Check that the weapon changes
        expect(playerState.weaponUpgradeTree.weaponId).toBe('sword-id')
    })
    test("Selecting multiple upgrades correctly change total stat and player weapon", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        expect(playerState.weaponUpgradeTree.weaponId).toBe('bow-id')

        // Select 1st upgrade which has a sword-id
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades, 1)

         // Get new upgrades at next depth and select 1st upgrade
        upgrades = WeaponManager.getAvailableUpgrades(playerState)
        WeaponManager.selectUpgrade(playerState, upgrades, 0)

        // compute total stat manually 
        let statObject = {
            ...Stat.getZeroStatObject(), 
            attack: 20,
            critRate: 0.11,
            critDamage: 0.1
        }
        let stat = new Stat(statObject)
        let actualStat = WeaponManager.getTotalStat(playerState)
        
        // check manual and actual are the same
        expect(stat).toEqual(actualStat)

    })
    // test("Database upgrades are loaded", ()=>{
        
    // })
})