import { useContext, useEffect, useState } from "react";
import { createMonster, editMonster } from "../../services/MonsterService";
import { UserContext } from "../../contexts/UserContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../contexts/DataContextProvider";
import { NotificationContext } from "../../contexts/NotificationContextProvider";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import SubmitButton from "../forms/SubmitButton";
import NumberField from "../forms/NumberField";
import TextField from "../forms/TextField";

export default function CreateOrEditMonster(props) {

    const { isEdit } = props;
    const id = useParams().id;

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { monsters, refetchAllMonsters } = useContext(DataContext);
    const { notifyResponse } = useContext(NotificationContext);

    // Form States
    const [ name, setName ] = useState("");
    const [ asepriteKey, setAsepriteKey ] = useState("");
    const [ aiKey, setAiKey ] = useState("Default");
    const [ boundsType, setBoundsType ] = useState("rect");
    const [ boundsWidth, setBoundsWidth ] = useState(12);
    const [ boundsHeight, setBoundsHeight ] = useState(18);
    const [ statsHp, setStatsHp ] = useState(100);
    const [ statsAttack, setStatsAttack ] = useState(10);
    const [ statsAttackRange, setStatsAttackRange ] = useState(30);
    const [ statsAttackSpeed, setStatsAttackSpeed ] = useState(0.7);
    const [ statsSpeed, setStatsSpeed ] = useState(30);
    const [ statsArmor, setStatsArmor ] = useState(0);
    const [ statsMagicResist, setStatsMagicResist ] = useState(0);
    const [ statsArmorPen, setStatsArmorPen ] = useState(0);
    const [ statsMagicAttack, setStatsMagicAttack ] = useState(0);
    const [ statsMagicPen, setStatsMagicPen ] = useState(0);
    const [ statsCritRate, setStatsCritRate ] = useState(0);
    const [ statsCritDamage, setStatsCritDamage ] = useState(0);
    const [ statsLifeSteal, setStatsLifeSteal ] = useState(0);

    const [ sendingRequest, setSendingRequest ] = useState(false);


    useEffect(() => {
        if(monsters && isEdit) {
            let monster = monsters.filter((m) => m.name === id)[0];
            if(monster) {
                setName(monster.name);
                setAsepriteKey(monster.asepriteKey ?? "");
                setAiKey(monster.AIKey ?? "Default");
                setBoundsType(monster.bounds?.type ?? "rect");
                setBoundsWidth(monster.bounds?.width ?? 12);
                setBoundsHeight(monster.bounds?.height ?? 18);
                setStatsHp(monster.stats?.hp ?? 100);
                setStatsAttack(monster.stats?.attack ?? 10);
                setStatsAttackRange(monster.stats?.attackRange ?? 30);
                setStatsAttackSpeed(monster.stats?.attackSpeed ?? 0.7);
                setStatsSpeed(monster.stats?.speed ?? 30);
                setStatsArmor(monster.stats?.armor ?? 0);
                setStatsMagicResist(monster.stats?.magicResist ?? 0);
                setStatsArmorPen(monster.stats?.armorPen ?? 0);
                setStatsMagicAttack(monster.stats?.magicAttack ?? 0);
                setStatsMagicPen(monster.stats?.magicPen ?? 0);
                setStatsCritRate(monster.stats?.critRate ?? 0);
                setStatsCritDamage(monster.stats?.critDamage ?? 0);
                setStatsLifeSteal(monster.stats?.lifeSteal ?? 0);
            }
        }
    }, [monsters])

    const onChangeName = (e) => {setName(e.target.value)}
    const onChangeAsepriteKey = (e) => {setAsepriteKey(e.target.value)}
    const onChangeAIKey = (e) => {setAiKey(e.target.value)}
    const onChangeBoundsType = (e) => {setBoundsType(e.target.value)}
    const onChangeBoundsWidth = (e) => {setBoundsWidth(parseInt(e.target.value))}
    const onChangeBoundsHeight = (e) => {setBoundsHeight(parseInt(e.target.value))}
    const onChangeStatsHp = (e) => {setStatsHp(parseInt(e.target.value))}
    const onChangeStatsAttack = (e) => {setStatsAttack(parseInt(e.target.value))}
    const onChangeStatsAttackRange = (e) => {setStatsAttackRange(parseInt(e.target.value))}
    const onChangeStatsAttackSpeed = (e) => {setStatsAttackSpeed(parseFloat(e.target.value))}
    const onChangeStatsSpeed = (e) => {setStatsSpeed(parseInt(e.target.value))}
    const onChangeStatsArmor = (e) => {setStatsArmor(parseInt(e.target.value))}
    const onChangeStatsMagicResist = (e) => {setStatsMagicResist(parseInt(e.target.value))}
    const onChangeStatsArmorPen = (e) => {setStatsArmorPen(parseInt(e.target.value))}
    const onChangeStatsMagicAttack = (e) => {setStatsMagicAttack(parseInt(e.target.value))}
    const onChangeStatsMagicPen = (e) => {setStatsMagicPen(parseInt(e.target.value))}
    const onChangeStatsCritRate = (e) => {setStatsCritRate(parseFloat(e.target.value))}
    const onChangeStatsCritDamage = (e) => {setStatsCritDamage(parseInt(e.target.value))}
    const onChangeStatsLifeSteal = (e) => {setStatsLifeSteal(parseFloat(e.target.value))}

    const onSubmit = (e) => {
        e.preventDefault();
        setSendingRequest(true);
        let stats = {
            hp: statsHp, armor: statsArmor, magicResist: statsMagicResist, attack: statsAttack,
            armorPen: statsArmorPen, magicAttack: statsMagicAttack, magicPen: statsMagicPen,
            critRate: statsCritRate, critDamage: statsCritDamage, attackRange: statsAttackRange,
            attackSpeed: statsAttackSpeed, speed: statsSpeed, lifeSteal: statsLifeSteal
        }
        let bounds = {
            type: boundsType,
            width: boundsWidth,
            height: boundsHeight,
        }
        let monsterData = {
            asepriteKey: asepriteKey,
            name:name,
            AIKey:aiKey,
            stats:stats,
            bounds: bounds
        }
        if(isEdit) {
            monsterData.id = monsterData.name;
            editMonster(user, monsterData).then((res) => {
                if(res.status === 200) {
                    refetchAllMonsters();
                    navigate("/monster");
                }
                setSendingRequest(false);
                notifyResponse(res); 
            })
        } else {
            createMonster(user, monsterData).then((res) => {
                if(res.status === 200) {
                    refetchAllMonsters();
                    navigate("/monster");
                }
                notifyResponse(res);
                setSendingRequest(false);
            });
        }
    }

    return(
        <Container>
            <h2> {isEdit ? "Edit Monster" : "Create Monster"}</h2>
            <Form onSubmit={onSubmit} id="createMonsterForm" className="mb-5">
                <SubmitButton disabled={sendingRequest} variant="primary">
                    {isEdit ? "Edit Monster And Save To Database" : "Save New Monster To Database"}
                </SubmitButton>
                
                <h4>General</h4>
                <TextField 
                    controlId="monsterName"
                    label="Monster Name:"
                    text="Enter the monster's name.
                    The name should be unique because it will be used as the monster's ID.
                    The ID will be the name with all spaces removed. E.g. Tiny Zombie => TinyZombie"
                    value={name}
                    onChange={onChangeName}
                    placeholder="Enter monster name..."
                />
                <TextField 
                    controlId="asepriteKey"
                    label="Aseprite Key:"
                    text="The aseprite asset key for this monster. This key can be found in the Asset page."
                    value={asepriteKey}
                    onChange={onChangeAsepriteKey}
                    placeholder="Enter Aseprite key..."
                />
                <TextField 
                    controlId="aikey"
                    label="AI Key:"
                    text="The key of the AI controller."
                    value={aiKey}
                    onChange={onChangeAIKey}
                    placeholder="Enter AI Key..."
                />

                <br></br>
                <h4>Bounds</h4>
                <TextField 
                    controlId="boundsType"
                    label="Bounds Type:"
                    text="The type of collision to use. rect or circle(not supported)"
                    value={boundsType}
                    onChange={onChangeBoundsType}
                />
                <NumberField controlId="boundsWidth" label="Bounds Width:" value={boundsWidth} onChange={onChangeBoundsWidth} />
                <NumberField controlId="boundsHeight" label="Bounds Height:" value={boundsHeight} onChange={onChangeBoundsHeight} />

                <br></br>
                <h4>Main Stats</h4>

                <NumberField controlId="statsHp" label="HP:" value={statsHp} onChange={onChangeStatsHp} />
                <NumberField controlId="statsAttack" label="Attack:" value={statsAttack} onChange={onChangeStatsAttack} />
                <NumberField controlId="statsAttackRange" label="AttackRange:" value={statsAttackRange} onChange={onChangeStatsAttackRange} />
                <NumberField controlId="statsAttackSpeed" label="AttackSpeed:" value={statsAttackSpeed} onChange={onChangeStatsAttackSpeed} />
                <NumberField controlId="statsSpeed" label="Speed:" value={statsSpeed} onChange={onChangeStatsSpeed} />

                <br></br>
                <h4>Optional Stats</h4>
                <NumberField controlId="statsArmor" label="Armor:" value={statsArmor} onChange={onChangeStatsArmor} />
                <NumberField controlId="statsMagicResist" label="MagicResist:" value={statsMagicResist} onChange={onChangeStatsMagicResist} />
                <NumberField controlId="statsArmorPen" label="ArmorPen:" value={statsArmorPen} onChange={onChangeStatsArmorPen} />
                <NumberField controlId="statsMagicAttack" label="MagicAttack:" value={statsMagicAttack} onChange={onChangeStatsMagicAttack} />
                <NumberField controlId="statsMagicPen" label="MagicPen:" value={statsMagicPen} onChange={onChangeStatsMagicPen} />
                <NumberField controlId="statsCritRate" label="CritRate:" value={statsCritRate} step={0.01} onChange={onChangeStatsCritRate} />
                <NumberField controlId="statsCritDamage" label="CritDamage:" value={statsCritDamage} onChange={onChangeStatsCritDamage} />
                <NumberField controlId="statsLifeSteal" label="LifeSteal:" value={statsLifeSteal} step={0.001} onChange={onChangeStatsLifeSteal} />
            </Form>
        </Container>
    )
}