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

describe("Tree Upgrade Tests", ()=>{
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

    test("Can get a Tree's available upgrades", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        // Check that there are 3 upgrades
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades?.length).toBe(3)
    })
    test("Can get a Tree's available upgrades even after selecting an upgrade", ()=>{
    })
    test("Selecting a upgrade changes upgrade node's status to selected", ()=>{
        // Equip bow upgrade tree
        let bowUpgrade = WeaponUpgradeFactory.createBowUpgrade()
        WeaponManager.equipWeaponUpgrade(playerState, bowUpgrade as Node<WeaponData>)
        
        // Select 1st upgrade
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        
        WeaponManager.selectUpgrade(playerState, upgrades, 1)
        
        // Check that the upgrade is selected 
        let children = playerState.weaponUpgradeTree.root!.children
        
        expect(children[1].data.status).toBe("selected")
        expect(children[0].data.status).toBe("skipped")
        expect(children[2].data.status).toBe("skipped")
    })
    // test("Database upgrades are loaded", ()=>{
        
    // })
})