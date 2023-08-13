
const BASEURL = "http://localhost:3002";

export function createMonster(IdToken, asepriteKey, name, AIKey, stats) {
    let monsterData = {
        IdToken, asepriteKey, name, AIKey, stats
    };
    console.log(monsterData);
    fetch(BASEURL + `/monsters/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': IdToken,
        },
        body: JSON.stringify(monsterData)
    }).then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
    }).catch((err) => {
        console.log(err);
    })
}
