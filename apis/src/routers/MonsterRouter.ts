import { CreateMonster, GetMonster } from "../crud/MonsterCrud";
import { isGameMaster } from "../middleware";


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

MonsterRouter.get('/monsters/:id', (req: any, res: any) => {
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


export default MonsterRouter;
