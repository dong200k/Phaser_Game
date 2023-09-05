import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Checks if the request have an authorization header. If the request is from the server, 
 * add myAuth.type = "server" to req. If the request is from an user add myAuth.type = "user" and 
 * myAuth.token = token to req, where token is the user's decoded token.
 */
export const isAuthenticated = (req: any, res: any, next: any) => {
    if(!req.headers.authorization) return res.status(403).send({message: 'No credentials!'});
    if(req.headers.authorization === process.env.API_KEY) {
        req.myAuth = {};
        req.myAuth.type = "server";
        next();
    } else {
        getAuth().verifyIdToken(req.headers.authorization).then((token) => {
            req.myAuth = {};
            req.myAuth.type = "user";
            req.myAuth.token = token;
            next();
        }).catch((error) => {
            return res.status(403).send(error);
        })
    }
}

interface IAuthorizationConfig {
    allowRoles?: Array<'admin' | 'gamemaster'>;
    allowSameUser?: boolean;
    allowGameServer?: boolean;
}

/**
 * Checks if the user is authorized based on the IAuthorizationConfig.
 * @param config Any roles/info included in this config will be authorized.
 */
export const isAuthorized = (config: IAuthorizationConfig) => {
    return (req: any, res: any, next: any) => {
        let { type, token } = req.myAuth;
        let { id } = req.params;

        // Allow server
        if(config.allowGameServer === true && type === "server") return next();

        // Allow users with specific roles.
        if(type === "user" && config.allowRoles?.includes(token.role)) return next();

        // Allow same user to access their own resource.
        if(type === "user" && config.allowSameUser === true && token.uid === id) return next();

        return res.status(403).send({message: "Not Authorized!"});
    }
}
