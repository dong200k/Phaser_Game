import { BASEURL_API_SERVER } from "../constants.js"

const BASEURL = BASEURL_API_SERVER + "/json"

export default class JsonDBService{
    static async moveAssets(user){
        let IdToken = await user.getIdToken();
        try{
            let res = await fetch(BASEURL + "/move-assets", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': IdToken,
                },
            })
            if(res.status !== 200) throw new Error()
            return true
        }catch(e){
            console.log(e.message)
            return null
        }
    }
}