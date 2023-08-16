import { CreateMonster, DeleteMonster, GetAllMonsters, GetMonster, UpdateMonster } from "../crud/MonsterCrud";


export default class MonsterController {

    public static getAllMonsters(req: any, res: any) {
        console.log("Get request. Get all monsters");
        return GetAllMonsters().then((monsters) => {
            res.status(200).json({monsters});
        }).catch((error)=> {
            res.status(403).send({message: error});
        })
    }

    public static getMonster(req: any, res: any) {
        console.log("Get request: get monster");
        let {id} = req.params;

        return GetMonster(id)
            .then((monster)=>{
                res.status(200).json({monster})
            })
            .catch((error)=>{
                res.status(403).send({message: error})
            })
    }

    public static deleteMonster(req: any, res: any) {
        console.log("Post request: Delete monster");
        let {id} = req.params;
        DeleteMonster(id).then(() => {
            res.status(200).send({message: `Monster ${id} was deleted!`});
        })
        .catch((error) => {
            res.status(403).send({message: error});
        });
    }

    public static createMonster(req: any, res: any) {
        console.log("Post request: Create monster");
        try {
            let {asepriteKey, name, AIKey, stats} = req.body;
            // convert string stats into number stats.
            Object.keys(stats).forEach((key) => {
                stats[key] = parseFloat(stats[key]);
            })
            CreateMonster(asepriteKey, name, AIKey, stats).then((monster) => {
                res.status(200).send({message: "Monster Created!"});
            }).catch((err) => {
                res.status(403).send({message: err.message});
            });
        } catch(e: any) {
            res.status(403).send({
                message: e.message
            })
        }
    }

    public static editMonster(req: any, res: any) {
        console.log("Post request: Edit monster");
        try {
            let {id, asepriteKey, name, AIKey, stats} = req.body;
            // convert string stats into number stats.
            Object.keys(stats).forEach((key) => {
                stats[key] = parseFloat(stats[key]);
            })
            UpdateMonster(id, asepriteKey, name, AIKey, stats).then(() => {
                res.status(200).send({message: "Success!"});
            }).catch((err) => {
                res.status(403).send({message: err.message});
            });
        } catch(e: any) {
            res.status(403).json({
                error: e.message
            })
        }
    }
}

