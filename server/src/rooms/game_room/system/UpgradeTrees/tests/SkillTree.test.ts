import State from "../../../schemas/State"
import SkillData from "../../../schemas/Trees/Node/Data/SkillData"
import Node from "../../../schemas/Trees/Node/Node"
import Player from "../../../schemas/gameobjs/Player"
import Stat from "../../../schemas/gameobjs/Stat"
import GameManager from "../../GameManager"
import SkillTreeFactory from "../factories/SkillTreeFactory"
import SkillTreeManager from "../../StateManagers/SkillTreeManager"
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
        let skillTree = SkillTreeFactory.createAdventurerSkill()
        SkillTreeManager.setSkillTree(playerState, skillTree as Node<SkillData>)
        
        // Check that player's skillTree's root has same structure as bow upgrade
        expect(playerState.skillTree.root).toBeDefined()
    })
    test("Unequipping a Skill tree removes from the player its stats and effects", ()=>{
    })
    test("Switching SkillTree/unequipping a new tree while the player has a tree works properly", ()=>{
        let skillTree = SkillTreeFactory.createAdventurerSkill()
        SkillTreeManager.setSkillTree(playerState, skillTree as Node<SkillData>)
        
        // Check that player's skillTree's root has same structure as bow upgrade
        expect(playerState.skillTree.root).toEqual(SkillTreeFactory.createAdventurerSkill())

        // Equip new skill tree
        skillTree = SkillTreeFactory.createTestSkill()
        SkillTreeManager.setSkillTree(playerState, skillTree as Node<SkillData>)
        
        // Check that player's skillTree's root has same structure as bow upgrade
        expect(playerState.skillTree.root).toEqual(SkillTreeFactory.createTestSkill())
    })
    test("Player can receive next available upgrades in the tree", ()=>{
        let skillTree = SkillTreeFactory.createAdventurerSkill()
        SkillTreeManager.setSkillTree(playerState, skillTree as Node<SkillData>)
        
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.skillTree)
        expect(upgrades?.length).toBe(9)
    })
    test("Player can select a skill upgrade", ()=>{
        let skillTree = SkillTreeFactory.createAdventurerSkill()
        SkillTreeManager.setSkillTree(playerState, skillTree as Node<SkillData>)
        
        //get upgrade and select 2nd upgrade
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.skillTree)
        TreeUtil.selectUpgrade(playerState, playerState.skillTree, upgrades, 1)

        expect(skillTree?.children[1].data.status).toBe("selected")
    })
    test("Selecting multiple upgrades correctly change total stat of the tree", ()=>{
        let skillTree = SkillTreeFactory.createAdventurerSkill()
        SkillTreeManager.setSkillTree(playerState, skillTree as Node<SkillData>)
        
         // check stats are correct at the start
         let statObject = {
            ...Stat.getZeroStatObject(), 
            maxMana: 100,
            maxHp: 100,
            attack: 10,
            attackSpeed: 1,
            speed: 1,
            level: 1,
        }
        let stat = new Stat(statObject)
        let actualStat = TreeUtil.getTotalStat(playerState.skillTree)
        expect(stat).toEqual(actualStat)

        //get upgrade and select 1st upgrade (+ 1 attack)
        let upgrades = TreeUtil.getAvailableUpgrades(playerState.skillTree)
        TreeUtil.selectUpgrade(playerState, playerState.skillTree, upgrades, 0)
        Object.entries(upgrades[0].data.stat).forEach(([key,val])=>{
            if(val>0)console.log(key, val)
        })

        //Check stats are correct after upgrade
        stat.attack += 1
        actualStat = TreeUtil.getTotalStat(playerState.skillTree)
        expect(stat).toEqual(actualStat)

        // Get next upgrade (+ 2 attack)
        upgrades = TreeUtil.getAvailableUpgrades(playerState.skillTree)
        TreeUtil.selectUpgrade(playerState, playerState.skillTree, upgrades, 0)

        stat.attack += 2
        actualStat = TreeUtil.getTotalStat(playerState.skillTree)
        expect(stat).toEqual(actualStat)
    })
    test("Skill tree is properly initialized with its stat effects applied to the player when the game starts", ()=>{
    })
})