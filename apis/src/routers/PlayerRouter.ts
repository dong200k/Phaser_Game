import { CreatePlayer, getPlayerData, updatePlayerSkillTree } from "../crud/PlayerCrud"

const express = require('express')
const PlayerRouter = express.Router()

/**
 * Creates a player if it does not exist and the IdToken from firebase auth is valid.
 * 
 * Note: Intended to be called when a user signsup or when they login without a player document created yet.
 */
PlayerRouter.post('/players', async (req: any, res: any)=>{
    console.log("post player")
    try {
        let {IdToken, username} = req.body

        let player = await CreatePlayer(IdToken, username)
        res.status(200).json({player})

    } catch (error: any) {
        console.log(error)
        res.status(403).json({
            error: error.message
        })
    }
    
})

/**
 * Updates a players skill tree and coins/gems based on upgrade selection if the upgrades are valid and currencies are enough and
 * player IdToken is valid.
 */
PlayerRouter.post('/players/skillTree', (req: any, res: any)=>{
    let {IdToken, upgrades} = req.body

    return updatePlayerSkillTree(IdToken, upgrades)
        .then((skillTree)=>{
            res.status(200).json({skillTree})
        })
        .catch((error)=>{
            res.status(403).json({error})
        })
})

/**
 * Gets a players data if
 * player IdToken is valid.
 */
PlayerRouter.get('/players/:id', (req: any, res: any)=>{
    let {id: IdToken} = req.params

    return getPlayerData(IdToken)
        .then((player)=>{
            res.status(200).json({player})
        })
        .catch((error)=>{
            res.status(403).json({error})
        })
})

export default PlayerRouter