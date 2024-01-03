import Matter, { Bodies } from 'matter-js';
import Player, { UpgradeItem } from '../../schemas/gameobjs/Player';
import GameManager from '../GameManager';
import MathUtil from '../../../../util/MathUtil';
import { Categories } from '../Collisions/Category';
import MaskManager from '../Collisions/MaskManager';
import WeaponUpgradeFactory from '../UpgradeTrees/factories/WeaponUpgradeFactory';
import EffectManager from './EffectManager';
import ArtifactFactory from '../UpgradeTrees/factories/ArtifactFactory';
import SkillTreeFactory from '../UpgradeTrees/factories/SkillTreeFactory';
import SkillTreeManager from './SkillTreeManager';
import ReconciliationInfo from '../../schemas/ReconciliationInfo';
import WeaponManager from './WeaponManager';
import PlayerService from '../../../../services/PlayerService';
import { getDamage, getEstimatedDps, getFinalAttackSpeed, getFinalSpeed } from '../Formulas/formulas';
import WeaponUpgradeTree from '../../schemas/Trees/WeaponUpgradeTree';
import DatabaseManager from '../Database/DatabaseManager';
import Node from '../../schemas/Trees/Node/Node';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import { IAbility, IRole } from '../interfaces';
import Stat from '../../schemas/gameobjs/Stat';
import Ability from '../../schemas/gameobjs/Ability';
import TriggerUpgradeEffect from '../../schemas/effects/trigger/TriggerUpgradeEffect';
import ContinuousUpgradeEffect from '../../schemas/effects/continuous/ContinuousUpgradeEffect';
import Artifact from '../../schemas/Trees/Artifact';
import ArtifactManager from './ArtifactManager';
import TreeManager from './TreeManager';
import MerchantManager from './MerchantManager';

interface InputPlayload {
    payload: number[];
    playerId: string;
}

export default class PlayerManager {
    private gameManager: GameManager

    private inputPayloads: InputPlayload[] = [];
    private disabledPlayers: Set<string> = new Set();


    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    /**
     * Updates this PlayerManager.
     * @param deltaT deltaT seconds.
     */
    update(deltaT: number) {
        let playerCount = 0;
        let allPlayersDead = true;
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Player){
                playerCount++;
                // gameObject.attackCooldown.tick(deltaT)
                if(gameObject.playerController.stateName !== "Dead") {
                    allPlayersDead = false;
                    gameObject.update(deltaT)
                    // console.log(`player position: (${Math.round(gameObject.x)}, ${Math.round(gameObject.y)}) \n`)
                    // if(this.gameManager.state.serverTickCount % 20 === 0)
                    //     console.log("Player Armor: ", gameObject.stat.armor);
                }
            }
        })

        // If player count is more than zero and all players are dead end the game.
        // For player count of zero the game room will close automatically.
        if(playerCount > 0 && allPlayersDead) {
            this.gameManager.endGame();
        }

        this.processMovementInputPayload(deltaT);
    }

    getPlayerStateAndBody(sessionId: string){
        return {playerBody: this.gameManager.matterBodies.get(sessionId) as Matter.Body, playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    }

    processPlayerAttack(playerId: string, data: any){
        // Do nothing if the player is diabled.
        if(this.disabledPlayers.has(playerId)) return;

        let [mouseDown, mouseX, mouseY, mouseClick] = data
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return
        
        // Do nothing if the player is dead.
        if(playerState.playerController.stateName === "Dead") return;

        playerState.playerController.processMouseInput(mouseClick, mouseDown, mouseX, mouseY)
    }

    queuePlayerMovement(playerId: string, data: number[]) {
        let inputPlayload = {
            playerId: playerId,
            payload: data,
        }
        this.inputPayloads.push(inputPlayload);
    }

    /**
     * Process all the movement data that have been queued up.
     * @param deltaT deltaT seconds.
     */
    private processMovementInputPayload(deltaT: number) {
        let loopCount = this.inputPayloads.length;

        if(this.inputPayloads.length > 100) {
            console.warn("Input payloads exceed 100, dropping payloads.");
            while(this.inputPayloads.length > 50) this.inputPayloads.shift();
        }

        while(loopCount > 0) {
            let item = this.inputPayloads.shift();
            if(item && this.gameManager.state.reconciliationInfos.length > 0) {
                let clientTick = item.payload[4];
                let serverTick = this.gameManager.state.serverTickCount;
                let playerId = item.playerId;
                let reconciliationInfo = this.gameManager.state.reconciliationInfos.reduce<ReconciliationInfo>((prev, current, idx, arr) => {
                    if(prev.clientId === playerId) return prev;
                    else return current;
                })
                reconciliationInfo.adjectmentConfirmId = item.payload[5];

                if(clientTick < serverTick) {
                    // Drop package and ask player to catch up.
                    //console.log(`Client ${playerId} is ${serverTick - clientTick} ticks behind. Asking client to speed up.`);
                    if(reconciliationInfo.adjectmentConfirmId === reconciliationInfo.adjustmentId) {
                        reconciliationInfo.adjustmentId++;
                        reconciliationInfo.adjustmentAmount = 2;
                    }
                } else if(clientTick > serverTick + 2) {
                    // Save packet and tell client to slow down.
                    //console.log(`Client ${playerId} is ${clientTick - serverTick} ticks ahead. Asking client to slow down.`);
                    if(reconciliationInfo.adjectmentConfirmId === reconciliationInfo.adjustmentId) {
                        reconciliationInfo.adjustmentId++;
                        reconciliationInfo.adjustmentAmount = -2;
                    }
                    this.inputPayloads.push(item);
                }
                else if(clientTick === serverTick) {
                    // Process client payload.
                    this.processPlayerMovement(playerId, item.payload, deltaT);

                } else {
                    // Save packet for future ticks.
                    this.inputPayloads.push(item);
                }
            }
            loopCount--;
        }
    }

    processPlayerDoubleTap(playerId: string, key: "w"|"a"|"s"|"d"){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist, double tap")

        // If the player is disabled, cant move, or is dead stop the player 
        if(this.disabledPlayers.has(playerId) || playerState.playerController.stateName === "Dead") {
            return; 
        }
        playerState.playerController.startRoll(key)

    }

    processPlayerMovement(playerId: string, data: number[], deltaT: number){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist, movement")

        // If the player is disabled, cant move, or is dead stop the player 
        if(this.disabledPlayers.has(playerId) || 
                !playerState.canMove || 
                playerState.playerController.stateName === "Dead") {
            Matter.Body.setVelocity(playerBody, {x: 0, y: 0});
            return; 
        }

        // if(!playerState.playerController.allowChangeDirection && (playerBody.velocity.x !== 0 && playerBody.velocity.y !== 0)){
        //     return console.log("can't change direction")
        // } 

        //calculate new player velocity
        let speed = getFinalSpeed(playerState.stat) * deltaT;
        let x = 0;
        let y = 0;
        if(data[0]) y -= 1;
        if(data[1]) y += 1;
        if(data[2]) x -= 1;
        if(data[3]) x += 1;
        if(playerState.playerController.stateName !== "Move" && playerState.playerController.stateName !== "Roll") speed/=2
        let velocity = MathUtil.getNormalizedSpeed(x, y, speed);
        // console.log(`speed: ${playerState.stat.speed}`)
        // If the velocity would send the player off bounds, update it so that the player wont go off bounds.
        let bounds = this.getGameManager().getDungeonManager().getDungeon()?.getPlayerBounds();
        if(bounds) {
            let minX = playerBody.bounds.min.x;
            let minY = playerBody.bounds.min.y;
            let maxX = playerBody.bounds.max.x;
            let maxY = playerBody.bounds.max.y;
            if(velocity.x > 0) {
                let distanceToMax = bounds.maxX - maxX;
                velocity.x = Math.min(velocity.x, distanceToMax);
            } else if(velocity.x < 0) {
                let distanceToMin = bounds.minX - minX;
                velocity.x = Math.max(velocity.x, distanceToMin);
            }
            if(velocity.y > 0) {
                let distanceToMax = bounds.maxY - maxY;
                velocity.y = Math.min(velocity.y, distanceToMax * deltaT);
            } else if(velocity.y < 0) {
                let distanceToMin = bounds.minY - minY;
                velocity.y = Math.max(velocity.y, distanceToMin * deltaT);
            }
        }

        Matter.Body.setVelocity(playerBody, velocity);
    }

    processPlayerSpecial(playerId: string, data: any) {
        let {special: useSpecial, mouseData} = data
        let [mouseClick, mouseX, mouseY] = mouseData

        // Do nothing if the player is diabled.
        if(this.disabledPlayers.has(playerId)) return;

        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist, special")
        
        // If the player is dead, do nothing.
        if(playerState.playerController.stateName === "Dead") return;

        if(!useSpecial) return
        let usedAbility = playerState.currentAbility?.useAbility()
        if(usedAbility) playerState.playerController.startSpceial(mouseX, mouseY);
    }

    /**
     * TODO connect to a database with player information
     * Initializes the player data
     * @param playerData player data from firebase
     * @param player playerState to init
     * @param IdToken token to identify player to firebase
     * @param roleId string to determine role
     * @param onlineMode boolean to determine whether to load data from firebase or not. True to load data from firebase. Default is true.
     */
    private async initPlayerData(playerData: any, player: Player, roleId: string = "", onlineMode: boolean=true){
        if(playerData && onlineMode){
            this.initPlayerDataOnline(player, playerData, roleId)
        }else{
            this.initPlayerDataOffline(player, roleId)
        }
    }

    /**
     * Called when playerData from firebase is found.
     * @param player 
     * @param playerData 
     * @param roleId 
     */
    private async initPlayerDataOnline(player: Player, playerData: any, roleId: string){
        // Equip skill tree
        let skillTree = SkillTreeFactory.convertFirebaseSkillTree(playerData.skillTree)
        SkillTreeManager.equipSkillTree(player, skillTree)

        // Grab player's chosen role
        let role = DatabaseManager.getManager().getRole(roleId)
        let roleUnlocked = playerData.unlockedRoles.find((id: string)=>id===roleId)

        // Use default ranger role if role is not unlocked or found
        if(!role || !roleUnlocked) {
            console.log(`Role ${roleId} not found, switching to default role.`)
            role = DatabaseManager.getManager().getRole("role-16bdfc2a-c379-42bb-983a-04592330831c") as IRole
        }
        console.log(`using the role: ${role.name}`)
        player.setRole(role.name)
        this.initRoleData(player, role)
        this.equipStarterArtifacts(player)
    }

    private initPlayerDataOffline(player: Player, roleId: string){
        // Grab player's chosen role
        let role = DatabaseManager.getManager().getRole(roleId)
        // Use default ranger role if role is not found
        if(!role) {
            console.log(`Role ${roleId} not found, switching to default role.`)
            role = DatabaseManager.getManager().getRole("role-16bdfc2a-c379-42bb-983a-04592330831c") as IRole
        }
        console.log(`using the role: ${role.name}`)
        player.setRole(role.name)
        this.initRoleData(player, role)
        this.equipStarterArtifacts(player)
    }

    private equipArtifact(player: Player, artifact: Node<WeaponData> | Artifact){
        this.gameManager.getArtifactManager().equipArtifact(player, artifact)
    }

    /**
     * Takes in a player and initializes/equips starter artifacts for the game
     * @param player 
     */
    private equipStarterArtifacts(player: Player){
        // Equip aritfacts
        // let upgradedHermesBoots = ArtifactFactory.createUpgradedHermesBoot()
        // let upgradedFrostGlaive = ArtifactFactory.createUpgradeFrostGlaive()
        // let upgradedDemoArtifact = ArtifactFactory.createDemo()
        // this.gameManager.getArtifactManager().equipArtifact(player, upgradedHermesBoots)
        // this.gameManager.getArtifactManager().equipArtifact(player, upgradedFrostGlaive)
        // this.gameManager.getArtifactManager().equipArtifact(player, upgradedDemoArtifact)
        // let healthRegenArtifact = ArtifactFactory.createMaxedArtifact("upgrade-9efe1a19-2b8d-4080-8337-e2846192169f")
        // this.gameManager.getArtifactManager().equipArtifact(player, healthRegenArtifact)

        let artifactManager = this.gameManager.getArtifactManager();

        // let shieldArtifact = artifactManager.createArtifact("upgrade-5d3c8fc4-cfbb-4f52-82b0-8e3f2c9bfa81")
        // artifactManager.maxArtifact(shieldArtifact);
        // this.equipArtifact(player, shieldArtifact)

        // let rollArtifact = artifactManager.createArtifact("upgrade-a9b22e84-976f-4031-973e-6e704f6a330d")
        // artifactManager.maxArtifact(rollArtifact);
        // this.equipArtifact(player, rollArtifact)
        
        // let glassCannonArtifact = artifactManager.createArtifact("upgrade-019ad207-0882-4d23-a90b-a6d28705b246")
        // artifactManager.maxArtifact(glassCannonArtifact);
        // this.equipArtifact(player, glassCannonArtifact)

        // let rollChargeArtifact = artifactManager.createArtifact("upgrade-474b1146-1414-4747-a306-b181bff9c3ec")
        // artifactManager.maxArtifact(rollChargeArtifact);
        // this.equipArtifact(player, rollChargeArtifact)

        // let amplifierArtifact = artifactManager.createArtifact("upgrade-072fe1da-fc6f-4aa4-8b8c-72b5da52eb32")
        // artifactManager.maxArtifact(amplifierArtifact);
        // this.equipArtifact(player, amplifierArtifact)

        // let perseveranceArtifact = artifactManager.createArtifact("upgrade-5295e034-c5f6-4a07-a69e-8e36fa5b2d39")
        // artifactManager.maxArtifact(perseveranceArtifact);
        // this.equipArtifact(player, perseveranceArtifact)

        // let friendshipArtifact = artifactManager.createArtifact("upgrade-b49ebec5-d566-4fb8-9170-d6cd9778bb8b")
        // artifactManager.maxArtifact(friendshipArtifact);
        // this.equipArtifact(player, friendshipArtifact)

        // let fireballArtifact = artifactManager.createArtifact("upgrade-53123fa2-93a1-4a31-b021-cc8c9a236919")
        // artifactManager.maxArtifact(fireballArtifact);
        // this.equipArtifact(player, fireballArtifact)

        // let lightningRod = artifactManager.createArtifact("upgrade-92d98c71-c9a2-47e4-8ba1-1f03c578dd50")
        // artifactManager.maxArtifact(lightningRod);
        // this.equipArtifact(player, lightningRod)
        
        // let qiArmor = artifactManager.createArtifact("upgrade-4c5aef1c-ed88-4795-90f6-49f7c1ef2b42")
        // artifactManager.maxArtifact(qiArmor);
        // this.equipArtifact(player, qiArmor)

        // let mushroom = artifactManager.createArtifact("upgrade-f6af6929-e3f6-43d4-b441-8216fda94eac")
        // artifactManager.maxArtifact(mushroom);
        // this.equipArtifact(player, mushroom)

        // let carrot = artifactManager.createArtifact("upgrade-16005a69-9f01-4f5a-b2a5-53029a9e08e3")
        // artifactManager.maxArtifact(carrot);
        // this.equipArtifact(player, carrot)

        // let broccoli = artifactManager.createArtifact("upgrade-1718a411-4b87-4f14-bf7b-20aa5bfbce91")
        // artifactManager.maxArtifact(broccoli);
        // this.equipArtifact(player, broccoli)

        // let snowPeas = artifactManager.createArtifact("upgrade-3575faf7-9b58-42a1-bab2-c5e92b1870e7")
        // artifactManager.maxArtifact(snowPeas);
        // this.equipArtifact(player, snowPeas)

        // let pea = artifactManager.createArtifact("upgrade-6f24598c-785a-4f9c-ad69-dd3fbb852168")
        // artifactManager.maxArtifact(pea);
        // this.equipArtifact(player, pea)

        // let avocado = artifactManager.createArtifact("upgrade-7492fcd1-836f-48a5-94e8-c0d7a1eb514d")
        // artifactManager.maxArtifact(avocado);
        // this.equipArtifact(player, avocado)

        // let beans = artifactManager.createArtifact("upgrade-864ffacb-1a5d-4a33-8d8c-ca3fda4c3aba")
        // artifactManager.maxArtifact(beans);
        // this.equipArtifact(player, beans)

        // let beets = artifactManager.createArtifact("upgrade-d99f9c75-0cfd-46ec-b4ab-13727c5944f4")
        // artifactManager.maxArtifact(beets);
        // this.equipArtifact(player, beets)

        // let tomato = artifactManager.createArtifact("upgrade-e5c6e893-a1fc-4f12-aa39-d43aceb3d1b6")
        // artifactManager.maxArtifact(tomato);
        // this.equipArtifact(player, tomato)

        // let bananas = artifactManager.createArtifact("upgrade-fcaa71cb-8308-411f-adf7-4ea741522a29")
        // artifactManager.maxArtifact(bananas);
        // this.equipArtifact(player, bananas)

        // let frostWalker = artifactManager.createArtifact("upgrade-3cd595a8-f245-44ea-8847-c73bf791b494")
        // this.equipArtifact(player, frostWalker)

        // let runeGuard = artifactManager.createArtifact("upgrade-29a3bf4e-3a16-44a5-b293-0d17acdcb7d4")
        // artifactManager.maxArtifact(runeGuard);
        // this.equipArtifact(player, runeGuard)

        // let lightningDash = artifactManager.createArtifact("upgrade-ee0aff70-b554-463b-b79d-5f009c355035")
        // artifactManager.maxArtifact(lightningDash)
        // this.equipArtifact(player, lightningDash)

        // let flameDash = artifactManager.createArtifact("upgrade-a9fa7722-0cbc-43f4-a12d-cd768d07e07f")
        // artifactManager.maxArtifact(flameDash)
        // this.equipArtifact(player, flameDash)

        // let waveDash = artifactManager.createArtifact("upgrade-cff80f49-e3ed-429c-92ec-ee7fcfde4672")
        // artifactManager.maxArtifact(waveDash)
        // this.equipArtifact(player, waveDash)

        // let somersaultDash = artifactManager.createArtifact("upgrade-2fdc0f5d-7118-4d95-a2cc-f58b76bf4f02")
        // artifactManager.maxArtifact(somersaultDash)
        // this.equipArtifact(player, somersaultDash)

        // let shadowDash = artifactManager.createArtifact("upgrade-d4a4976d-9ea5-4975-b9cd-be4394d6f4a4")
        // artifactManager.maxArtifact(shadowDash)
        // this.equipArtifact(player, shadowDash)

        // let swordDash = artifactManager.createArtifact("upgrade-f59eed00-9740-4090-b661-b343c29cf5c1")
        // artifactManager.maxArtifact(swordDash)
        // this.equipArtifact(player, swordDash)

        // let poisonDash = artifactManager.createArtifact("upgrade-20db0c86-fed6-48c5-9cb8-11de173faa9b")
        // artifactManager.maxArtifact(poisonDash)
        // this.equipArtifact(player, poisonDash)

        // let frostDash = artifactManager.createArtifact("upgrade-db782ede-9826-449c-bc60-2cb22a7b08c4")
        // artifactManager.maxArtifact(frostDash)
        // this.equipArtifact(player, frostDash)

        // let lightningGod = artifactManager.createArtifact("upgrade-283ece36-f104-429b-9e58-ccc89fd407bd")
        // artifactManager.maxArtifact(lightningGod)
        // this.equipArtifact(player, lightningGod)

        // let kamehameha = artifactManager.createArtifact("upgrade-e13cc47b-80ff-4ec9-a013-fc25d882e663")
        // artifactManager.maxArtifact(kamehameha)
        // this.equipArtifact(player, kamehameha)

        // let lightningOrb = artifactManager.createArtifact("upgrade-2b742402-a887-4896-a4d0-df9c6b6b739e")
        // artifactManager.maxArtifact(lightningOrb)
        // this.equipArtifact(player, lightningOrb)

        // let lightningBird = artifactManager.createArtifact("upgrade-f861a679-405d-4001-b8f2-eeb06e594b17")
        // artifactManager.maxArtifact(lightningBird)
        // this.equipArtifact(player, lightningBird)

        // let meteor = artifactManager.createArtifact("upgrade-b5490d77-52d8-45ae-b996-6926a5b1ff00")
        // artifactManager.maxArtifact(meteor)
        // this.equipArtifact(player, meteor)

        // let ultimateFlameThrower = artifactManager.createArtifact("upgrade-fd225150-62c2-4407-a815-08f5eb0fe777")
        // artifactManager.maxArtifact(ultimateFlameThrower)
        // this.equipArtifact(player, ultimateFlameThrower)

        // let bladeTornado = artifactManager.createArtifact("upgrade-243789d2-1987-4129-a65f-fbcffa0c7b69")
        // artifactManager.maxArtifact(bladeTornado)
        // this.equipArtifact(player, bladeTornado)
    }


    /**
     * Prints the dps of the different effects depending on the player's stats. These effects must have the following methods:
     * 
     * ** getMult() returns an attack multiplier
     * ** getAmount(stat) returns the amount of projectiles fired each time.
     * 
     * Note:
     * Currently does not support magic multiplier, which is not being used yet.
     */
    public printDPS(player: Player){
        let playerAttackCooldown = 1/getFinalAttackSpeed(player.stat)
        const printSingleEffectDps = (effectLogicId: string, amount: number, singleShotDPS: number, singleHitDamage: number)=> {
            console.log(`\nEffectLogicId: ${effectLogicId}`)
            console.log(`AVG Single projectile DPS: ${singleShotDPS}`)
            console.log(`AVG Max ${amount} projectile DPS: ${singleShotDPS * amount}`)
            console.log(`AVG 1 Hit Damage: ${singleHitDamage}\n`)
        }

        player.effects.forEach(effect=>{
            if((effect instanceof TriggerUpgradeEffect || effect instanceof ContinuousUpgradeEffect)
            && effect.effectLogic 
            && "getMult" in effect.effectLogic
            && "getAmount" in effect.effectLogic){
                try {
                    let effectLogic = effect.effectLogic as any
                    let mult = effectLogic.getMult()
                    let amount = effectLogic.getAmount(player.stat)
                    let singleHitDamage = getDamage(player.stat, mult)

                    // console.log(`mult: ${mult}, amount: ${amount}, singlehit: ${singleHitDamage}`)

                    // Compute dps
                    let dps = 0
                    if(effect instanceof TriggerUpgradeEffect && effect.type === "player attack"){
                        dps = getEstimatedDps(player.stat, playerAttackCooldown, mult)
                    }else if(effect instanceof ContinuousUpgradeEffect){
                        let seconds = effect.getCooldown(player.stat)
                        console.log(`seconds: ${seconds}`)
                        dps = getEstimatedDps(player.stat, seconds, mult)
                    }

                    printSingleEffectDps(effect.effectLogicId, amount, dps, singleHitDamage)
                } catch (error) {
                    console.log(`Error calculating dps for effectLogic: ${effect.effectLogicId}`)
                    console.log(error)
                }
            }
        })
    }

    /**
     * Equips starter weapon and ability unto the input player based on input role. If weapon/ability are not found then default ones are used.
     * @param player 
     * @param role one of the roles from the database. Invalid role will result in default weapon/ability being used.
     */
    private initRoleData(player: Player, role: IRole){
        // Set controller based on role
        player.setController(role.name)

        // Equip starter weapon based on role
        let weaponUpgradeId = role.weaponUpgradeId
        let weapon = DatabaseManager.getManager().getUpgrade(weaponUpgradeId)
        if(!weaponUpgradeId || !weapon){
            console.log(`Starter weapon for ${role.name} role not found, using default weapon.`)
            weaponUpgradeId = "upgrade-c53e70c0-2a18-41f3-8dec-bd7ca194493d"
        }
        let root = WeaponUpgradeFactory.createUpgrade(weaponUpgradeId)?.root as Node<WeaponData>
        // let root = WeaponUpgradeFactory.createMaxUpgrade(weaponUpgradeId) as Node<WeaponData>
        WeaponManager.equipWeaponUpgrade(player, root);
        console.log(`equiping ${role.name} weapon:`, root.data.name)

        // Initialize Ability based on role
        let ability = DatabaseManager.getManager().getAbility(role?.abilityId)
        if(!ability){
            console.log(`Starter ability for ${role.name} role not found, using default ability.`)
            ability = DatabaseManager.getManager().getAbility("todo-add-default") as IAbility
        }
        let abilitySchema = new Ability(ability, this.gameManager)
        abilitySchema.setOwner(player)
        player.gameManager.getAbilityManager().equipAbility(player, abilitySchema)
        console.log(`equiping ${role.name} ability: ${ability.name}`)

        // Init base stats
        let roleStat = new Stat(role.stat)
        player.stat.add(roleStat)
    }

    public async createPlayer(sessionId: string, isOwner: boolean, playerData: any, gameManager?: GameManager, roleId?: string, onlineMode: boolean = true) {
        if(isOwner) this.gameManager.setOwner(sessionId)

        // let playerData = {username: "No Name"}
        console.log(`game mode online ${onlineMode}`)
        // if(onlineMode) playerData = await PlayerService.getPlayerData(IdToken)
        let newPlayer = new Player(this.gameManager, playerData.username, "Ranger");

        newPlayer.x = Math.random() * 200 + 100;
        newPlayer.y = Math.random() * 200 + 100;

        newPlayer.width = 46; // 49
        newPlayer.height = 42; // 44

        let playerSpawnPoint = this.gameManager.getDungeonManager().getPlayerSpawnPoint();
        if(playerSpawnPoint !== null) {
            newPlayer.x = playerSpawnPoint.x + (Math.random() * 20 - 10);
            newPlayer.y = playerSpawnPoint.y + (Math.random() * 20 - 10);
        } 

        await this.initPlayerData(playerData, newPlayer, roleId, onlineMode);

        let body = Matter.Bodies.rectangle(newPlayer.x, newPlayer.y, newPlayer.width, newPlayer.height, {
            isStatic: false,
            inertia: Infinity,
            inverseInertia: 0,
            restitution: 0,
            friction: 0,
            collisionFilter: {
                category: Categories.PLAYER,
                mask: MaskManager.getManager().getMask("PLAYER")
            }
        })

        // console.log(JSON.stringify(newPlayer.stat));

        newPlayer.setId(sessionId);
        newPlayer.setBody(body)
        this.gameManager.addGameObject(sessionId, newPlayer, body);
    } 

    public removePlayer(sessionId: string) {
        return this.gameManager.removeGameObject(sessionId) as Player | undefined;
    }

    /**
     * Gets the nearest player to the given x and y position.
     * @param x The x value.
     * @param y The y value.
     */
    public getNearestPlayer(x: number, y: number): Player | undefined {
        let players = new Array<Player>;
        this.gameManager.state.gameObjects.forEach((value) => {if(value instanceof Player) players.push(value)});
        if(players.length === 0) return undefined;
        let nearestPlayer = players[0];
        let nearestDistance = MathUtil.distanceSquared(x, y, nearestPlayer.x, nearestPlayer.y);
        for(let i = 1; i < players.length; i++) {
            let player = players[i];
            let distance = MathUtil.distanceSquared(x, y, player.x, player.y);
            if(distance < nearestDistance) {
                nearestDistance = distance;
                nearestPlayer = player;
            }
        }
        return nearestPlayer;
    }

    /**
     * Gets the nearest alive player to the given x and y position. If no such player is found 
     * return undefined.
     * @param x The x value.
     * @param y The y value.
     */
    public getNearestAlivePlayer(x: number, y: number): Player | undefined {
        let players = new Array<Player>;
        this.gameManager.state.gameObjects.forEach((value) => {if(value instanceof Player) players.push(value)});
        if(players.length === 0) return undefined;
        let idx = 0;
        let nearestDistance = Number.MAX_VALUE;
        let nearestPlayer = undefined;
        do {
            let player = players[idx];
            if(!player.isDead()) {
                let distance = MathUtil.distanceSquared(x, y, player.x, player.y);
                if(distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestPlayer = player;
                }
            }
            idx++;
        } while(idx < players.length);
        return nearestPlayer;
    }

    /**
     * Returns a list of all the players within range of an x and y position. If range is undefined then everyone gets the xp.
     * @param x The x position.
     * @param y The y position.
     * @param range The range.
     */
    public getAllPlayersWithinRange(x: number, y: number, range?: number) {
        let playerList: Player[] = new Array();
        this.gameManager.state.gameObjects.forEach((gameObject, key) => {
            if(gameObject instanceof Player) {
                if(range === undefined || MathUtil.distance(gameObject.x, gameObject.y, x, y) <= range) {
                    playerList.push(gameObject);
                }
            }
        })
        return playerList;
    }

    public getGameManager() {
        return this.gameManager;
    }

    /** Disable a player's input from updating the state of the game.
     * @param player The player to disable.
     */
    public disablePlayer(player: Player) {
        this.disabledPlayers.add(player.id);
    }

    /** Enable a player's input from updating the state of the game.
     * @param player The player to enable.
     */
    public enablePlayer(player: Player) {
        this.disabledPlayers.delete(player.id);
    }

    /**
     * Gives a player xp.
     * @param player The player.
     * @param xp The amount of xp to give.
     */
    public addXpToPlayer(xp: number, player: Player) {
        player.xp += xp;
        if(player.xp >= player.maxXp) {
            player.xp -= player.maxXp;
            player.level++;
            player.maxXp = this.getNewMaxXp(player.level)
            // If the player is not currently selecting an upgrade give them one.
            if(!player.upgradeInfo.playerIsSelectingUpgrades){
                this.givePlayerUpgradeSelection(player, this.generateUpgrades(player));
                this.gameManager.pauseGame(player.getId() as string)
            }
        }
    }

    /**
     * Takes in a player and levels them up, sets their xp to 0, however does not give them upgrade selection
     * @param player 
     * @param levels amount of levels to level
     */
    public levelUpWithNoUpgrades(player: Player, levels: number = 1){
        player.level += levels
        player.maxXp = this.getNewMaxXp(player.level)
        player.xp = 0
    }

    /**
     * 
     * @param level 
     * @returns The xp required to level up at the level provided in the argument.
     */
    public getNewMaxXp(level: number){
        return 20 * Math.floor(0.0627 * (level ** 2) + 4.8661 * level + 5.0712)
    }

    public generateUpgrades(player: Player, amountOfUpgrades: number = 3){
        let upgrades: Array<UpgradeItem> = []

        let availableArtifactUpgrades = player.gameManager.getForgeManager().getPossibleArtifactUpgrades(player)
        let availableWeaponUpgrades = player.gameManager.getForgeManager().getPossibleWeaponUpgrades(player)

        // Generate artifacts that the player does not have
        let allArtifacts = DatabaseManager.getManager().getAllDatabaseArtifacts()
        let newArtifactUpgrades: Array<UpgradeItem> = []
        for(let [id, dbArtifact] of allArtifacts){
            if(!ArtifactManager.hasArtifact(player, id)){
                newArtifactUpgrades.push(new UpgradeItem({
                    upgradeNode: undefined,
                    name: dbArtifact.name,
                    description: dbArtifact.description,
                    tree: undefined,
                    imageKey: dbArtifact.imageKey,
                    type: "new artifact",
                    artifactId: id
                }))
            }
        }

        const availableUpgradesGreaterEqualAmountNeeded = () => {
            return (newArtifactUpgrades.length + availableArtifactUpgrades.length + availableWeaponUpgrades.length) > amountOfUpgrades
        }

        if(availableUpgradesGreaterEqualAmountNeeded()){
            let i = 0
            while(i < amountOfUpgrades){
                let randomNumber = Math.random()
                let randomlySelectedUpgrade: UpgradeItem
                if(randomNumber < 0.33){
                    randomlySelectedUpgrade = MerchantManager.chooseRandomFromList(1, availableArtifactUpgrades)[0]
                }else if(randomNumber < 0.66){
                    randomlySelectedUpgrade = MerchantManager.chooseRandomFromList(1, availableWeaponUpgrades)[0]
                }
                else{
                    randomlySelectedUpgrade = MerchantManager.chooseRandomFromList(1, newArtifactUpgrades)[0]
                }
                if(randomlySelectedUpgrade !== undefined && !upgrades.find(upgrade=>upgrade.isEqual(randomlySelectedUpgrade))) {
                    upgrades.push(randomlySelectedUpgrade)
                    i++
                }
            }
        }else {
            upgrades = upgrades.concat(availableArtifactUpgrades, availableWeaponUpgrades, newArtifactUpgrades)
        }

        return upgrades
    }

    /**
     * Splits the xp among the provided players. If no players are provided the xp will 
     * be split among all the players.
     * @param xp The amount of xp to give.
     * @param players The players to give them to.
     */
    public splitXpToPlayers(xp: number, players?: Player[]) {
        // Gets all the players that will receive the xp.
        let playerList: Player[] = [];
        if(players === undefined || players.length === 0) {
            this.gameManager.state.gameObjects.forEach((gameObject, key)=> {
                if(gameObject instanceof Player) playerList.push(gameObject);
            })
        } else {
            players.forEach((player) => playerList.push(player));
        }
        if(playerList.length === 0) return;
        // Split the xp among the players.
        // let splitXp = xp / playerList.length;
        
        let splitXp = xp // everyone gets all the xp no split
        playerList.forEach((player) => this.addXpToPlayer(splitXp, player));
    }

    /**
     * Splits the xp among all the players within range of an x and y position. If range is undefined then everyone gets the xp
     * @param xp The amount of xp.
     * @param x The x position.
     * @param y The y position.
     * @param range The range.
     */
    public splitXpToPlayersWithinRange(xp: number, x: number, y: number, range?: number) {
        this.splitXpToPlayers(xp, this.getAllPlayersWithinRange(x, y, range));
    }

    /**
     * Gives all the alive player's coins.
     * @param coins The amount of coins to give.
     */
    public giveAllPlayersCoin(coins: number) {
        this.gameManager.state.gameObjects.forEach((gameObject, key) => {
            if(gameObject instanceof Player) {
                if(gameObject.playerController.stateName !== "Dead")
                    gameObject.coinsEarned += coins;
            }
        })
    }

    /**
     * Gets the Player with the given id.
     * @param id The id.
     * @returns The Player with the given id or undefined if no such player was found.
     */
    public getPlayerWithId(id: string): Player | undefined {
        let player: Player | undefined;
        this.gameManager.state.gameObjects.forEach((gameObject, key)=> {
            if(gameObject instanceof Player && gameObject.getId() === id) player = gameObject;
        })
        return player;
    }

    /**
     * Called when the player have selected an upgrade.
     * @param playerId The player's id.
     * @param choice The idx of the upgrade.
     */
    public processPlayerSelectUpgrade(playerId: string, choice: number) {
        let player = this.getPlayerWithId(playerId);

        if(player){
            let upgrades = player.upgradeInfo.currentUpgrades
            let selectedUpgrade = upgrades[choice]

            if(selectedUpgrade.type === "weapon"){
                TreeManager.selectGivenUpgrade(player, selectedUpgrade.getTree() as WeaponUpgradeTree, selectedUpgrade.getUpgradeNode() as Node<WeaponData>)
            }else if(selectedUpgrade.type === "artifact"){
                let artifact = selectedUpgrade.getTree() as Artifact
                ArtifactManager.upgradeArtifact(artifact)
            } else if(selectedUpgrade.type === "new artifact"){
                let artifactId = selectedUpgrade.getArtifactId() as string
                let artifactManager = this.gameManager.getArtifactManager()
                let artifact = artifactManager.createArtifact(artifactId)
                artifactManager.equipArtifact(player, artifact)
            }
            player.upgradeInfo.playerSelectedUpgrade()
            this.gameManager.unPauseGame(playerId)
            return true
        }
        this.gameManager.unPauseGame(playerId)

    }

    /** 
     * Gives the next upgrades options to a player.
     * @param player The player.
     * @param upgrades List of UpgradeItems
     */
    public givePlayerUpgradeSelection(player: Player, upgrades: UpgradeItem[]) {
        player.upgradeInfo.giveNextUpgrade(this.copyUpgrades(upgrades));
    }

    public copyUpgrades(upgrades: UpgradeItem[]){
        let newUpgrades: UpgradeItem[] = []

        upgrades.forEach(upgrade=>newUpgrades.push(new UpgradeItem({
            upgradeNode: upgrade.getUpgradeNode() ,
            name: upgrade.name,
            description: upgrade.description,
            tree: upgrade.getTree(),
            imageKey: upgrade.imageKey,
            type: upgrade.type,
            artifactId: upgrade.getArtifactId()
        })))

        return newUpgrades
    }
}