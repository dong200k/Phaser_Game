import { getAllDungeons, getDungeon } from "../crud/DungeonCrud";

export default class DungeonController {
    
    public static getDungeon(req: any, res: any) {
        console.log("Get request: get dungeon");
        let {id} = req.params;
    
        return getDungeon(id)
            .then((dungeon)=>{
                res.status(200).json({dungeon})
            })
            .catch((error)=>{
                res.status(403).json({error})
            })
    }

    public static getAllDungeons(req: any, res: any) {
        console.log("Get request. get all dungeons");
        return getAllDungeons().then((dungeons) => {
            res.status(200).json({dungeons});
        }).catch((error)=> {
            res.status(403).json({error});
        })
    }

}
