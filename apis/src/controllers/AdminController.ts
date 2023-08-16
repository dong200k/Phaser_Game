import { getAuth } from "firebase-admin/auth";

export default class AdminController {
    
    public static assignRole(req: any, res: any) {
        let { uid, role } = req.body;
        console.log(role);
        if(role !== "admin" && role !== "gamemaster") {
            res.status(400).send({message: "Incorrect role."});
        } else {
            getAuth().setCustomUserClaims(uid, {role: role}).then(() => {
                res.status(200).send({message: `Successfully assigned role ${role} to user ${uid}`});
            }).catch((error) => {
                res.status(400).send({message: error.message});
            })
        }
    }

}
