
const BASEURL = "http://localhost:3002";

export async function getAllDungeons(user) {
    let IdToken = await user.getIdToken();
    try {
        let res = await fetch(BASEURL + `/dungeons`, {
            method: "GET",
            headers: {
                'Authorization': IdToken,
            }
        });
        if(res.status === 200) {
            let data = await res.json();
            return data.dungeons;
        } else return [];
    } catch(e) {
        console.log(e);
        return [];
    }
}

export async function createDungeon(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Creating dungeon");
    return fetch(BASEURL + `/dungeons/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}

export async function editDungeon(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Updating dungeon...");
    return fetch(BASEURL + `/dungeons/edit/${data.name}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}