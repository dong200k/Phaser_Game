import { getAuth } from "firebase-admin/auth";

/**
 * The admin controller have functions specific to the admin, like assigning roles.
 */
export default class AdminController {

    public static assignRole(req: any, res: any) {
        let { uid, role } = req.body;
        // List of possible roles that can be assigned to users. Each user can only have one role at a time.
        const possibleRoles = [/*'admin', */'gamemaster', 'noob'];
        
        if(!possibleRoles.includes(role)) {
            res.status(400).send({message: `${role} is not a vaild role.`});
        } else {
            getAuth().getUser(uid).then((userData) => {
                let prevRole = userData.customClaims?.role;
                if(prevRole === "admin") throw new Error("Unable to change the role of an admin. Please try something else.");
                console.log(`Assigning role ${role} to ${uid}`);
                return getAuth().setCustomUserClaims(uid, {role: role});
            }).then(() => {
                res.status(200).send({message: `Successfully assigned role ${role} to user ${uid}`});
            }).catch((error) => {
                res.status(400).send({message: error.message});
            })
        }
    }

    public static removeRole(req: any, res: any) {
        let { uid } = req.body;
        getAuth().getUser(uid).then((userData) => {
            // Do not remove role from an admin.
            let role = userData.customClaims?.role;
            if(role === "admin") throw new Error("Unable to remove role from an admin. Please try something else.");
            console.log(`Removing role from ${uid}`);
            return getAuth().setCustomUserClaims(uid, null);
        }).then(() => {
            res.status(200).send({message: `Removed role from ${uid}`});
        }).catch((error) => {
            res.status(400).send({message: error.message});
        })
    }

    public static getRole(req: any, res: any) {
        let { id } = req.params;
        getAuth().getUser(id).then((userData) => {
            let role = userData.customClaims?.role;
            res.status(200).send({message: `User ${id} has role ${role}`});
        }).catch((error) => {
            res.status(400).send({message: error.message});
        })
    }
}
