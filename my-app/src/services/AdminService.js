const BASEURL = "http://localhost:3002";


export async function adminAssignRole(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Giving user a role...");
    return fetch(BASEURL + `/admin/assignrole`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}

export async function adminRemoveRole(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Removing role from user...");
    return fetch(BASEURL + `/admin/removerole`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(data)
    });
}

export async function adminGetRole(user, data) {
    let IdToken = await user.getIdToken();
    console.log("Checking user role...");
    return fetch(BASEURL + `/admin/getrole/${data.uid}`, {
        method: "GET",
        headers: {
            'Authorization': IdToken,
        },
    });
}
