import { getAllDungeons, getDungeon } from "../crud/DungeonCrud";
import { isGameServer } from "../middleware";


const express = require('express');
const DungeonRouter = express.Router();


DungeonRouter.get('/dungeons/:id', isGameServer, (req: any, res: any) => {
    console.log("Get request: get dungeon");
    let {id} = req.params;

    return getDungeon(id)
        .then((dungeon)=>{
            res.status(200).json({dungeon})
        })
        .catch((error)=>{
            res.status(403).json({error})
        })
})

DungeonRouter.get('/dungeons', isGameServer, (req: any, res:any) => {
    console.log("Get request. get all dungeons");
    return getAllDungeons().then((dungeons) => {
        res.status(200).json({dungeons});
    }).catch((error)=> {
        res.status(403).json({error});
    })
})

export default DungeonRouter;