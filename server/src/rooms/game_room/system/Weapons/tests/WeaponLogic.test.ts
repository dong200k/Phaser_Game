import { before } from "node:test"
import State from "../../../schemas/State"
import GameManager from "../../GameManager"
import WeaponLogicManager from "../WeaponLogic/WeaponLogicManager"
import bow from "../WeaponLogic/bow"

describe("Weapon Logic Tests", ()=>{
    let gameManager: GameManager

    beforeEach(async ()=>{
        gameManager = new GameManager(new State())
        await gameManager.preload()
    })
    test("Player can use weapon's attack", ()=>{
        let sessionId = "fake-id"

        //create player
        gameManager.playerManager.createPlayer(sessionId, false)
        let playerState = gameManager.playerManager.getPlayerStateAndBody(sessionId).playerState
        
        // data[0] = 1 to simulate mouse click
        let data = [1, 0, 0]

        // Attack
        gameManager.playerManager.processPlayerAttack(sessionId, data)

        // Attack should be on cool down
        expect(playerState.attackCooldown.isFinished).toBe(false)
    })
    test("Weapon Logics are loaded", ()=>{
       let bowLogic = WeaponLogicManager.getManager().getWeaponLogic('bow-id')
       expect(bowLogic).toBe(bow)
    })
    
})