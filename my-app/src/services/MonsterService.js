
const BASEURL = "http://localhost:3002";

export async function createMonster(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Creating monster", data);
    return fetch(BASEURL + `/monsters/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}

export async function editMonster(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Editing monster", data);
    return fetch(BASEURL + `/monsters/edit/${data.id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    })
}

export async function deleteMonster(user, id) {
    let IdToken = await user.getIdToken();
    return fetch(BASEURL + `/monsters/delete/${id}`, {
        method: "POST",
        headers: {
            'Authorization': IdToken,
        }
    });
}

export async function getAllMonsters(user) {
    let IdToken = await user.getIdToken();
    try {
        let res = await fetch(BASEURL + `/monsters`, {
            method: "GET",
            headers: {
                'Authorization': IdToken,
            }
        });
        if(res.status === 200) {
            let data = await res.json();
            return data.monsters;
        } else return [];
    } catch(e) {
        console.log(e);
        return [];
    }
}