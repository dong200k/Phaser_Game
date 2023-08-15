import { CreateMonster, DeleteMonster, GetAllMonsters, GetMonster, UpdateMonster } from "../crud/MonsterCrud";
import { isGameMaster, isGameMasterOrGameServer, isGameServer } from "../middleware";


const express = require('express');
const MonsterRouter = express.Router();

MonsterRouter.post('/monsters/create', isGameMaster, async (req: any, res: any) => {
    console.log("Post request: Create monster");
    try {
        let {IdToken, asepriteKey, name, AIKey, stats} = req.body;
        // convert string stats into number stats.
        Object.keys(stats).forEach((key) => {
            stats[key] = parseFloat(stats[key]);
        })
        let monster = await CreateMonster(asepriteKey, name, AIKey, stats);
        res.status(200).json({monster});
    } catch(e: any) {
        res.status(403).json({
            error: e.message
        })
    }
})

MonsterRouter.post('/monsters/edit/:id', isGameMaster, async (req:any, res: any) => {
    console.log("Post request: Edit monster");
    try {
        let {id, asepriteKey, name, AIKey, stats} = req.body;
        // convert string stats into number stats.
        Object.keys(stats).forEach((key) => {
            stats[key] = parseFloat(stats[key]);
        })
        await UpdateMonster(id, asepriteKey, name, AIKey, stats);
        res.status(200).json({message: "Success!"});
    } catch(e: any) {
        res.status(403).json({
            error: e.message
        })
    }
})

MonsterRouter.post('/monsters/delete/:id', isGameMaster, async (req:any, res: any) => {
    console.log("Post request: Delete monster");
    let {id} = req.params;
    DeleteMonster(id).then(() => {
        res.status(200).json({message: `Monster ${id} was deleted!`});
    })
    .catch((error) => {
        res.status(403).json({error});
    });
})

MonsterRouter.get('/monsters/:id', isGameServer, (req: any, res: any) => {
    console.log("Get request: get monster");
    let {id} = req.params;

    return GetMonster(id)
        .then((monster)=>{
            res.status(200).json({monster})
        })
        .catch((error)=>{
            res.status(403).json({error})
        })
    
})

MonsterRouter.get('/monsters', isGameMasterOrGameServer, (req: any, res:any) => {
    console.log("Get request. Get all monsters");
    return GetAllMonsters().then((monsters) => {
        res.status(200).json({monsters});
    }).catch((error)=> {
        res.status(403).json({error});
    })
})


export default MonsterRouter;
