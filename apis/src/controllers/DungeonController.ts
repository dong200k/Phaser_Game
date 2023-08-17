import { createDungeon, editDungeon, getAllDungeons, getDungeon } from "../crud/DungeonCrud";

/**
 * The dungeon controller contains dungeon data that will be used by the server when loading a dungeon.
 * These infomation can include the dungeon's tiled info, and the dungeon's waves.
 */
export default class DungeonController {
    
    public static getDungeon(req: any, res: any) {
        console.log("Get request: get dungeon");
        let {id} = req.params;
        return getDungeon(id).then((dungeon)=>{
                res.status(200).json({dungeon})
            }).catch((error)=>{
                res.status(403).json({error})
            })
    }

    public static getAllDungeons(req: any, res: any) {
        console.log("Get request. get all dungeons");
        return getAllDungeons().then((dungeons) => {
            res.status(200).json({dungeons});
        }).catch((error)=> {
            res.status(403).send({message: error});
        })
    }

    public static createDungeon(req: any, res: any) {
        console.log("Post request. create dungeon.");
        createDungeon(req.body).then((dungeon) => {
            res.status(200).json({dungeon});
        }).catch((error) => {
            res.status(400).json({message: error.message});
        })
    }

    public static editDungeon(req: any, res: any) {
        console.log("Post request. edit dungeon.");
        let { id } = req.params;
        editDungeon(id, req.body).then((dungeon) => {
            res.status(200).json({dungeon});
        }).catch((error) => {
            res.status(400).json({message: error.message});
        })
    }

}
