import { useContext } from "react";
import { createMonster } from "../../services/MonsterService";
import { UserContext } from "../../contexts/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../contexts/DataContextProvider";
import { NotificationContext } from "../../contexts/NotificationContextProvider";

export default function CreateMonster() {

    let { user } = useContext(UserContext);
    let navigate = useNavigate();
    let { refetchAllMonsters } = useContext(DataContext);
    let { notifyResponse } = useContext(NotificationContext);

    const onSubmit = (e) => {
        e.preventDefault();
        let formDOM = document.getElementById("createMonsterForm");
        let asepriteKey = formDOM.querySelector(".asepriteKey").value;
        let monsterName = formDOM.querySelector(".monsterName").value;
        let AiKey = formDOM.querySelector(".AiKey").value;
        let statsHp = formDOM.querySelector(".statsHp").value;
        let statsAttack = formDOM.querySelector(".statsAttack").value;
        let statsAttackRange = formDOM.querySelector(".statsAttackRange").value;
        let statsAttackSpeed = formDOM.querySelector(".statsAttackSpeed").value;
        let statsSpeed = formDOM.querySelector(".statsSpeed").value;
        let statsArmor = formDOM.querySelector(".statsArmor").value;
        let statsMagicResist = formDOM.querySelector(".statsMagicResist").value;
        let statsArmorPen = formDOM.querySelector(".statsArmorPen").value;
        let statsMagicAttack = formDOM.querySelector(".statsMagicAttack").value;
        let statsMagicPen = formDOM.querySelector(".statsMagicPen").value;
        let statsCritRate = formDOM.querySelector(".statsCritRate").value;
        let statsCritDamage = formDOM.querySelector(".statsCritDamage").value;
        let statsLifeSteal = formDOM.querySelector(".statsLifeSteal").value;
        let stats = {
            hp: statsHp, armor: statsArmor, magicResist: statsMagicResist, attack: statsAttack,
            armorPen: statsArmorPen, magicAttack: statsMagicAttack, magicPen: statsMagicPen,
            critRate: statsCritRate, critDamage: statsCritDamage, attackRange: statsAttackRange,
            attackSpeed: statsAttackSpeed, speed: statsSpeed, lifeSteal: statsLifeSteal
        }
        // convert all stats to numbers.
        Object.keys(stats).forEach((key) => {
            stats[key] = parseFloat(stats[key]);
        })
        let boundsType = formDOM.querySelector(".boundsType").value;
        let boundsWidth = parseInt(formDOM.querySelector(".boundsWidth").value);
        let boundsHeight = parseInt(formDOM.querySelector(".boundsHeight").value);
        let bounds = {
            type: boundsType,
            width: boundsWidth,
            height: boundsHeight,
        }
        let monsterData = {
            asepriteKey: asepriteKey,
            name:monsterName,
            AIKey:AiKey,
            stats:stats,
            bounds: bounds
        }
        createMonster(user, monsterData).then((res) => {
            if(res.status === 200) {
                refetchAllMonsters();
                navigate("/monster");
                formDOM.reset();
            }
            notifyResponse(res);
        });
    }

    return(
        <div>
            <h2> Create Monster :OOO </h2>
            <form onSubmit={onSubmit} id="createMonsterForm">

                <button type="submit" className="btn btn-primary">Save New Monster To Database</button>

                <h4>General</h4>
                <label htmlFor="monsterName">Name: </label>
                <input type="text" name="monsterName" className="monsterName"></input>
                The name of the monster. This is used as the document id and cannot be changed.<br/>
                <label htmlFor="asepriteKey">Aseprite Key: </label>
                <input type="text" name="asepriteKey" className="asepriteKey"></input>
                The key of the aseprite image that will be used by this monster.<br/>
                <label htmlFor="AiKey">AI Key: </label>
                <input type="text" name="AiKey" className="AiKey"></input>
                The key of the AI controller.<br/>

                <br></br>
                <h4>Bounds</h4>
                <label htmlFor="boundsType">Type: </label>
                <input type="string" name="boundsType" className="boundsType" defaultValue={"rect"} /><br/>
                <label htmlFor="boundsWidth">Width: </label>
                <input type="number" name="boundsWidth" className="boundsWidth" defaultValue={12} /><br/>
                <label htmlFor="boundsHeight">Height: </label>
                <input type="number" name="boundsHeight" className="boundsHeight" defaultValue={18} /><br/>
                

                <br></br>
                <h4>Main Stats</h4>

                <label htmlFor="statsHp">HP: </label>
                <input type="number" name="statsHp" className="statsHp" defaultValue={100} /><br/>
                <label htmlFor="statsAttack">Attack: </label>
                <input type="number" name="statsAttack" className="statsAttack" defaultValue={10} /><br/>
                <label htmlFor="statsAttackRange">AttackRange: </label>
                <input type="number" name="statsAttackRange" className="statsAttackRange" defaultValue={30} /><br/>
                <label htmlFor="statsAttackSpeed">AttackSpeed: </label>
                <input type="number" name="statsAttackSpeed" className="statsAttackSpeed" defaultValue={0.7} step={0.1}/><br/>
                <label htmlFor="statsSpeed">Speed: </label>
                <input type="number" name="statsSpeed" className="statsSpeed" defaultValue={30} /><br/>
                

                <br></br>
                <h4>Optional Stats</h4>
                <label htmlFor="statsArmor">Armor: </label>
                <input type="number" name="statsArmor" className="statsArmor" defaultValue={0} /><br/>
                <label htmlFor="statsMagicResist">MagicResist: </label>
                <input type="number" name="statsMagicResist" className="statsMagicResist" defaultValue={0} /><br/>
                <label htmlFor="statsArmorPen">ArmorPen: </label>
                <input type="number" name="statsArmorPen" className="statsArmorPen" defaultValue={0} /><br/>
                <label htmlFor="statsMagicAttack">MagicAttack: </label>
                <input type="number" name="statsMagicAttack" className="statsMagicAttack" defaultValue={0} /><br/>
                <label htmlFor="statsMagicPen">MagicPen: </label>
                <input type="number" name="statsMagicPen" className="statsMagicPen" defaultValue={0} /><br/>
                <label htmlFor="statsCritRate">CritRate: </label>
                <input type="number" name="statsCritRate" className="statsCritRate" step={0.01} defaultValue={0} /><br/>
                <label htmlFor="statsCritDamage">CritDamage: </label>
                <input type="number" name="statsCritDamage" className="statsCritDamage" defaultValue={0} /><br/>
                <label htmlFor="statsLifeSteal">LifeSteal: </label>
                <input type="number" name="statsLifeSteal" className="statsLifeSteal" step={0.001} defaultValue={0} /><br/>

            </form>
        </div>
    )
}