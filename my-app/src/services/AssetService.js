import { BASEURL_API_SERVER } from "../constants";

const BASEURL = BASEURL_API_SERVER;

export async function getAllAssets(user) {
    let IdToken = await user.getIdToken();
    try {
        let res = await fetch(BASEURL + `/assets`, {
            method: "GET",
            headers: {
                'Authorization': IdToken,
            }
        });
        if(res.status === 200) {
            let data = await res.json();
            return data.assets;
        } else return [];
    } catch(e) {
        console.log(e);
        return [];
    }
}

export async function uploadAsset(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Uploading Asset", data);
    return fetch(BASEURL + `/assets/upload`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}

export async function editAsset(user, data, id) {
    let IdToken = await user.getIdToken();
    console.log("Editing Asset", data);
    return fetch(BASEURL + `/assets/edit/${id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}

export async function restoreAsset(user, loc, data, mime) {
    let IdToken = await user.getIdToken();
    console.log("Restoring asset to: ", loc);
    return fetch(BASEURL + `/assets/restore`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify({loc, data, mime})
    });
}
