import TreeUtil from "../../../../../util/TreeUtil"
import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import Player from "../../../schemas/gameobjs/Player"
import GameManager from "../../GameManager"
import ArtifactManager from "../../StateManagers/ArtifactManager"
import EffectManager from "../../StateManagers/EffectManager"
import SkillTreeManager from "../../StateManagers/SkillTreeManager"
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
        gameManager.getPlayerManager().createPlayer(sessionId, false)
        playerState = gameManager.getPlayerManager().getPlayerStateAndBody(sessionId).playerState

        // Unequip all artifacts, skilltrees, and weapons
        playerState.artifacts.forEach(artifact=>ArtifactManager.unEquipArtifact(playerState, artifact))
        SkillTreeManager.unEquipSkillTree(playerState)
        WeaponManager.unEquipWeaponUpgrade(playerState)

        // Update any effects from equiping initial weapon, artifacts, and skilltrees
        EffectManager.updateEffectsOn(playerState, 1)
    })

    test("Can get a Tree's available upgrades", ()=>{
        // Equip test upgrade tree
        let partially_upgraded_test_weapon = WeaponUpgradeFactory.createUpgrade("upgrade-611328eb-9370-4263-9b80-1d27682ff4ed")
        WeaponManager.equipWeaponUpgrade(playerState, partially_upgraded_test_weapon as Node<WeaponData>)
        
        // Check that there are 3 upgrades
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades.length).toBe(3)
        
        // Check upgrades are correct
        let sort = (a: string, b: string)=> a===b? 0: a<b? -1 : 1
        let expectedUpgradeNames = ["available-upgrade-1", "available-upgrade-2", "available-upgrade-3"].sort(sort)
        let upgradeNames = upgrades.map(u=> u.data.name).sort(sort)
        expect(upgradeNames).toEqual(expectedUpgradeNames)
    })
    test("Can get a Tree's available upgrades even after selecting an upgrade", ()=>{
        // Equip test upgrade tree
        let un_upgraded_test_weapon = WeaponUpgradeFactory.createUpgrade("upgrade-f7beeffa-d852-4581-b323-fb389511dfd2", false)
        WeaponManager.equipWeaponUpgrade(playerState, un_upgraded_test_weapon as Node<WeaponData>)
        
        // Get Upgrades
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades.length).toBe(1) // Check that there are 1 upgrades
        expect(upgrades[0].data.name).toBe("test") // Check upgrade is correct

        // Select 1st upgrade
        TreeUtil.selectUpgrade(playerState, playerState.weaponUpgradeTree, upgrades, 0)
        expect(upgrades[0].data.status).toBe("selected")
        
        // Try to get next set of upgrades which should be 3
        upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades.length).toBe(3) // Check that there are 3 upgrades
        
        // Check upgrades are correct
        let sort = (a: string, b: string)=> a===b? 0: a<b? -1 : 1
        let expectedUpgradeNames = ["auto-generated", "auto-generated", "auto-generated"]
        let upgradeNames = upgrades.map(u=> u.data.name)
        expect(upgradeNames).toEqual(expectedUpgradeNames)

        // Select 1st upgrade
        TreeUtil.selectUpgrade(playerState, playerState.weaponUpgradeTree, upgrades, 0)
        expect(upgrades[0].data.status).toBe("selected")

        // Try again Check that there are 3 upgrades
        upgrades = TreeUtil.getAvailableUpgrades(playerState.weaponUpgradeTree)
        expect(upgrades.length).toBe(3)
        
        // Check upgrades are correct
        expectedUpgradeNames = ["available-upgrade-1", "available-upgrade-2", "available-upgrade-3"].sort(sort)
        upgradeNames = upgrades.map(u=> u.data.name).sort(sort)
        expect(upgradeNames).toEqual(expectedUpgradeNames)
    })
    test("Selecting a upgrade changes upgrade node's status to selected", ()=>{
        // Equip test upgrade tree
        let partially_upgraded_test_weapon = WeaponUpgradeFactory.createUpgrade("upgrade-611328eb-9370-4263-9b80-1d27682ff4ed")
        WeaponManager.equipWeaponUpgrade(playerState, partially_upgraded_test_weapon as Node<WeaponData>)
        
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