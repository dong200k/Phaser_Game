import TreeUtil from "../../../../../util/TreeUtil"
import State from "../../../schemas/State"
import WeaponData from "../../../schemas/Trees/Node/Data/WeaponData"
import Node from "../../../schemas/Trees/Node/Node"
import Player from "../../../schemas/gameobjs/Player"
import Stat from "../../../schemas/gameobjs/Stat"
import GameManager from "../../GameManager"
import ArtifactManager from "../../StateManagers/ArtifactManager"

describe("Artifact Tests", ()=>{
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

    test("Equiping a artifact grants the player its stats and effects", ()=>{
    })
    test("Unequipping a artifact removes from the player its stats and effects", ()=>{
    })
    test(`Player can equip upto ${ArtifactManager.MAX_ARTIFACT_COUNT} artifacts`, ()=>{
    })
})