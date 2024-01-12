import { IRole } from "../../../server/src/rooms/game_room/system/interfaces"
import CollectionCrud from "../crud/CollectionCrud"
import { CreatePlayer, getPlayerData, unUpgradePlayerSkillTree, updatePlayerSkillTree } from "../crud/PlayerCrud"
import { UnlockRole } from "../crud/RoleCrud"
import JsonDatabaseManager from "../skilltree/JsonDatabaseManager"

const express = require('express')
const RoleRouter = express.Router()

/**
 * Unlocks a role for a player
 */
RoleRouter.post('/roles', (req: any, res: any)=>{
    let {IdToken, role} = req.body
    
    return UnlockRole(IdToken, role)
        .then(()=>{
            res.status(200).json({message: "role unlocked"})
        })
        .catch((error)=>{
            console.log(error.message)
            res.status(403).json({error})
        })
})

/**
 * Returns a list of all roles
 */
RoleRouter.get('/roles', async (req: any, res: any)=>{
    let roles: IRole[] = []
    let roleMap = await CollectionCrud.getAllDocuments("roles")
    
    roleMap.forEach((role: IRole, id)=>{
        roles.push(role)
    })
    res.status(200).json({roles})
})

export default RoleRouter