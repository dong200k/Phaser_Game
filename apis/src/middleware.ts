import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * A middleware to check if a user is logged in. This middleware 
 * can be used by routes that needs to check if the user is logged in or not.
 */
export const isLoggedIn = (req: any, res: any, next: any) => {
    if(!req.headers.authorization) {
        return res.status(403).json({error: 'No credentials sent!'});
    }
    getAuth().verifyIdToken(req.header.authorization)
    .then((decodedToken) => {
        next();
    })
    .catch((err) => {
        return res.status(403).json({error: err.message});
    });
}

/**
 * A middleware that checks if the user is logged in. Then it checks if the user is a 
 * game master.
 */
export const isGameMaster = (req: any, res: any, next: any) => {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(403).json({error: "No credentials sent!"});
    }
    getAuth().verifyIdToken(token)
    .then((decodedToken) => {
        // Check if player is an admin.
        const db = getFirestore();
        let playerRef = db.collection("players").doc(decodedToken.uid);
        return playerRef.get();
    })
    .then((playerSnap) => {
        if(!playerSnap.exists) return res.status(403).json({error: "User does not exist."});

        let playerData = playerSnap.data();
        if(playerData?.gameMaster !== true) return res.status(403).json({error: "User is not a game master."});

        next();
    })
    .catch((err) => {
        return res.status(403).send(err.message);
    })
}

/**
 * A middleware that checks if the request is from a game server. 
 * Game server are trusted and should be the one sending player changes and 
 * requesting assets(monster/player/dungeon data).
 */
export const isGameServer = (req: any, res: any, next: any) => {
    if(!req.headers.authorization) {
        return res.status(403).json({error: 'No credentials sent!'});
    }
    if(req.headers.authorization !== process.env.API_KEY) {
        return res.status(403).json({error: 'Invalid credentials!'});
    }
    next();
}