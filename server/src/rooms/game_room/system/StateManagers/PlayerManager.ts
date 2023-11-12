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
import { getFinalSpeed } from '../Formulas/formulas';
import WeaponUpgradeTree from '../../schemas/Trees/WeaponUpgradeTree';
import DatabaseManager from '../Database/DatabaseManager';
import Node from '../../schemas/Trees/Node/Node';
import WeaponData from '../../schemas/Trees/Node/Data/WeaponData';
import { IAbility, IRole } from '../interfaces';
import Stat from '../../schemas/gameobjs/Stat';
import Ability from '../../schemas/gameobjs/Ability';
import TriggerUpgradeEffect from '../../schemas/effects/trigger/TriggerUpgradeEffect';

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
        if(!playerBody || !playerState) return console.log("player does not exist, Attack")
        
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

        //calculate new player velocity
        let speed = getFinalSpeed(playerState.stat) * deltaT;
        let x = 0;
        let y = 0;
        if(data[0]) y -= 1;
        if(data[1]) y += 1;
        if(data[2]) x -= 1;
        if(data[3]) x += 1;
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

    private equipArtifact(player: Player, artifact: Node<WeaponData>){
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

        let shieldArtifact = ArtifactFactory.createMaxedArtifact("upgrade-5d3c8fc4-cfbb-4f52-82b0-8e3f2c9bfa81")
        this.gameManager.getArtifactManager().equipArtifact(player, shieldArtifact)

        let rollArtifact = ArtifactFactory.createMaxedArtifact("upgrade-a9b22e84-976f-4031-973e-6e704f6a330d")
        this.gameManager.getArtifactManager().equipArtifact(player, rollArtifact)
        
        // let glassCannonArtifact = ArtifactFactory.createMaxedArtifact("upgrade-019ad207-0882-4d23-a90b-a6d28705b246")
        // this.gameManager.getArtifactManager().equipArtifact(player, glassCannonArtifact)

        // let rollChargeArtifact = ArtifactFactory.createMaxedArtifact("upgrade-474b1146-1414-4747-a306-b181bff9c3ec")
        // this.gameManager.getArtifactManager().equipArtifact(player, rollChargeArtifact)

        let amplifierArtifact = ArtifactFactory.createMaxedArtifact("upgrade-072fe1da-fc6f-4aa4-8b8c-72b5da52eb32")
        this.gameManager.getArtifactManager().equipArtifact(player, amplifierArtifact)

        let perseveranceArtifact = ArtifactFactory.createMaxedArtifact("upgrade-5295e034-c5f6-4a07-a69e-8e36fa5b2d39")
        this.gameManager.getArtifactManager().equipArtifact(player, perseveranceArtifact)

        let friendshipArtifact = ArtifactFactory.createMaxedArtifact("upgrade-b49ebec5-d566-4fb8-9170-d6cd9778bb8b")
        this.gameManager.getArtifactManager().equipArtifact(player, friendshipArtifact)

        let fireballArtifact = ArtifactFactory.createMaxedArtifact("upgrade-53123fa2-93a1-4a31-b021-cc8c9a236919")
        this.gameManager.getArtifactManager().equipArtifact(player, fireballArtifact)

        // let lightningRod = ArtifactFactory.createMaxedArtifact("upgrade-92d98c71-c9a2-47e4-8ba1-1f03c578dd50")
        // this.equipArtifact(player, lightningRod)
        
        // let qiArmor = ArtifactFactory.createMaxedArtifact("upgrade-4c5aef1c-ed88-4795-90f6-49f7c1ef2b42")
        // this.equipArtifact(player, qiArmor)

        let mushroom = ArtifactFactory.createMaxedArtifact("upgrade-f6af6929-e3f6-43d4-b441-8216fda94eac")
        this.equipArtifact(player, mushroom)

        let carrot = ArtifactFactory.createMaxedArtifact("upgrade-16005a69-9f01-4f5a-b2a5-53029a9e08e3")
        this.equipArtifact(player, carrot)

        let broccoli = ArtifactFactory.createMaxedArtifact("upgrade-1718a411-4b87-4f14-bf7b-20aa5bfbce91")
        this.equipArtifact(player, broccoli)

        let snowPeas = ArtifactFactory.createMaxedArtifact("upgrade-3575faf7-9b58-42a1-bab2-c5e92b1870e7")
        this.equipArtifact(player, snowPeas)

        let pea = ArtifactFactory.createMaxedArtifact("upgrade-6f24598c-785a-4f9c-ad69-dd3fbb852168")
        this.equipArtifact(player, pea)

        let avocado = ArtifactFactory.createMaxedArtifact("upgrade-7492fcd1-836f-48a5-94e8-c0d7a1eb514d")
        this.equipArtifact(player, avocado)

        let beans = ArtifactFactory.createMaxedArtifact("upgrade-864ffacb-1a5d-4a33-8d8c-ca3fda4c3aba")
        this.equipArtifact(player, beans)

        let beets = ArtifactFactory.createMaxedArtifact("upgrade-d99f9c75-0cfd-46ec-b4ab-13727c5944f4")
        this.equipArtifact(player, beets)

        let tomato = ArtifactFactory.createMaxedArtifact("upgrade-e5c6e893-a1fc-4f12-aa39-d43aceb3d1b6")
        this.equipArtifact(player, tomato)

        let bananas = ArtifactFactory.createMaxedArtifact("upgrade-fcaa71cb-8308-411f-adf7-4ea741522a29")
        this.equipArtifact(player, bananas)

        let frostWalker = ArtifactFactory.createMaxedArtifact("upgrade-3cd595a8-f245-44ea-8847-c73bf791b494")
        this.equipArtifact(player, frostWalker)
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
        let root = WeaponUpgradeFactory.createUpgrade(weaponUpgradeId) as Node<WeaponData>
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
     * Returns a list of all the players within range of an x and y position.
     * @param x The x position.
     * @param y The y position.
     * @param range The range.
     */
    public getAllPlayersWithinRange(x: number, y: number, range: number) {
        let playerList: Player[] = new Array();
        this.gameManager.state.gameObjects.forEach((gameObject, key) => {
            if(gameObject instanceof Player) {
                if(MathUtil.distance(gameObject.x, gameObject.y, x, y) <= range) {
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
            // If the player is not currently selecting an upgrade give them one.
            if(!player.upgradeInfo.playerIsSelectingUpgrades)
                this.givePlayerUpgradeSelection(player);
        }
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
        let splitXp = xp / playerList.length;
        playerList.forEach((player) => this.addXpToPlayer(splitXp, player));
    }

    /**
     * Splits the xp among all the players within range of an x and y position.
     * @param xp The amount of xp.
     * @param x The x position.
     * @param y The y position.
     * @param range The range.
     */
    public splitXpToPlayersWithinRange(xp: number, x: number, y: number, range: number) {
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
        if(player) {
            let upgrades = WeaponManager.getAvailableUpgrades(player);
            if(upgrades.length > choice) {
                WeaponManager.selectUpgrade(player, upgrades, choice);
                console.log('selected upgrade: ', upgrades[choice].data.name)

                // Update the fields in upgradeInfo.
                player.upgradeInfo.playerSelectedUpgrade();
                // Give the player another upgrade if their level - 1 is greater than the number of times they upgraded.
                if(player.level - 1 > player.upgradeInfo.upgradeCount) {
                    this.givePlayerUpgradeSelection(player);
                }
            }
        }
    }

    /** 
     * Chooses the next upgrades for a player.
     * @param player The player.
     */
    public givePlayerUpgradeSelection(player: Player) {
        let upgradesForLevel = player.upgradeInfo.upgradeCount + 2;

        let weaponUpgrades = WeaponManager.getAvailableUpgrades(player);

        let upgradeItems: UpgradeItem[] = [];
        weaponUpgrades.forEach((weaponUpgrade) => {
            upgradeItems.push(new UpgradeItem({
                
                name: weaponUpgrade.data.name,
                type: "weapon",
                description: weaponUpgrade.data.description,
                imageKey: weaponUpgrade.data.name.toLocaleLowerCase() + "_icon",
            }));
        })

        player.upgradeInfo.giveNextUpgrade(upgradeItems);
    }
}