import { getFirestore } from "firebase-admin/firestore";

/** CRUD on the player. */
export default class PlayerController {

    public static addCoins(req: any, res: any) {
        let playerId = req.body.uid;
        let coins = req.body.coins;
        const db = getFirestore();
        let docRef = db.collection("players").doc(playerId);
        docRef.get().then(userDoc => {
            let data = userDoc.data();
            if(data) {
                let newCoinCount = data.coins + coins;
                console.log(`Giving player ${playerId} ${coins} coins. Total: ${newCoinCount} coins.`);
                return docRef.update({
                    coins: newCoinCount,
                })
            }
        }).then(() => {
            res.status(200).send({message: `Coins Added: ${coins}`});
        }).catch(e => {
            res.status(400).send({message: e.message});
        })
    }

}

