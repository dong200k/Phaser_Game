import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import Player from "../../../schemas/gameobjs/Player"
import GameManager from "../../GameManager"
import WeaponManager from "../../StateManagers/WeaponManager"
import WeaponLogicManager from "../WeaponLogic/WeaponLogicManager"
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

    test("Player equips bow upgrade tree by default", async ()=>{
        let upgradeTree = playerState.weaponUpgradeTree

        // Check that player's upgradeTree's root has same structure as bow upgrade
        expect(upgradeTree.root).toEqual(WeaponUpgradeFactory.createBowUpgrade())

        // Check that player's upgradeTree has a weaponId of the first weapon in the bow upgrade, "bow-id"
        expect(upgradeTree.weaponId).toBe("bow-id")
    })
    test("Player can switch a weapon upgrade tree", ()=>{
        let swordUpgrade = WeaponUpgradeFactory.createSwordUpgrade()
        expect(swordUpgrade).toBeTruthy()

        WeaponManager.setWeaponUpgradeTree(playerState, swordUpgrade as Node<WeaponData>)
        
        let upgradeTree = playerState.weaponUpgradeTree
        
        // Check that player's upgradeTree's root has same structure as bow upgrade
        expect(upgradeTree.root).toEqual(WeaponUpgradeFactory.createSwordUpgrade())

        // Check that player's upgradeTree has a weaponId of the first weapon in the bow upgrade, "bow-id"
        expect(upgradeTree.weaponId).toBe("sword-id")
    })
    test("Player can receive next available upgrades in the tree", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.setWeaponUpgradeTree(playerState, bowUpgrade as Node<WeaponData>)
        
        let upgrades = WeaponManager.getAvailableUpgrades(playerState)

        expect(upgrades?.length).toBe(3)
    })
    test("Player can select a weapon upgrade", ()=>{
        
    })
    test("Selecting weapon upgrades will invalidate/skip upgrades at the same depth when upgrades are choosen again", ()=>{
        
    })
    test("Selecting a weapon upgrade with a weaponId changes the base weapon of the player and the weapon tree", ()=>{
        
    })
    test("Selecting multiple upgrades correctly change total stat and player weapon", ()=>{
        
    })
    test("Database upgrades are loaded", ()=>{
        
    })
    test("Create bow tree works", ()=>{
        
    })
})