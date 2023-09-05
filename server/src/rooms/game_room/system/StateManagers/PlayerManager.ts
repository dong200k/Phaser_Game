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
    update(deltaT: number){
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Player){
                // gameObject.attackCooldown.tick(deltaT)
                gameObject.specialCooldown.tick(deltaT * 1000);
                gameObject.playerController.update(deltaT);
            }
        })

        this.processMovementInputPayload(deltaT);
    }

    getPlayerStateAndBody(sessionId: string){
        return {playerBody: this.gameManager.matterBodies.get(sessionId) as Matter.Body, playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    }

    processPlayerAttack(playerId: string, data: any){
        // Do nothing if the player is diabled.
        if(this.disabledPlayers.has(playerId)) return;

        let [mouseClick, mouseX, mouseY] = data
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")
        
        // trigger all player attack effect logics if there is a mouseclick
        if(mouseClick){
            EffectManager.useTriggerEffectsOn(playerState, "player attack", playerBody, {mouseX, mouseY})
        }
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

    processPlayerMovement(playerId: string, data: number[], deltaT: number){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")

        // If the player is disabled stop the player
        if(this.disabledPlayers.has(playerId)) {
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

    processPlayerSpecial(playerId: string, useSpecial: boolean) {
        // Do nothing if the player is diabled.
        if(this.disabledPlayers.has(playerId)) return;

        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")
        
        if(!useSpecial || !playerState.specialCooldown.isFinished) return
        playerState.specialCooldown.reset()

        EffectManager.useTriggerEffectsOn(playerState, "player skill")
    }

    /**
     * TODO connect to a database with player information
     * Initializes the player data
     * @param playerId identifier for the player
     * @param player playerState to init
     */
    private async initPlayerData(playerId: string, player: Player, IdToken: string){
        //*** TODO *** initialize weapon upgrade tree based on role
        //Set weaponupgrade tree for player with a test weapon
        let root = WeaponUpgradeFactory.createTribowUpgrade()
        
        WeaponManager.equipWeaponUpgrade(player, root);

        // Equip aritfacts
        let upgradedHermesBoots = ArtifactFactory.createUpgradedHermesBoot()
        let upgradedFrostGlaive = ArtifactFactory.createUpgradeFrostGlaive()
        let upgradedDemoArtifact = ArtifactFactory.createDemo()
        this.gameManager.getArtifactManager().equipArtifact(player, upgradedHermesBoots)
        // ArtifactManager.equipArtifact(player, upgradedFrostGlaive)
        this.gameManager.getArtifactManager().equipArtifact(player, upgradedDemoArtifact)

        // Equip skill tree
        let playerData = await PlayerService.getPlayerData(IdToken)
        let skillTree = SkillTreeFactory.convertFirebaseSkillTree(playerData.skillTree)
        SkillTreeManager.equipSkillTree(player, skillTree)
    }

    public async createPlayer(sessionId: string, isOwner: boolean, IdToken: string, gameManager?: GameManager) {
        if(isOwner) this.gameManager.setOwner(sessionId)


        //TODO: get player data from the database
        let newPlayer = new Player(this.gameManager, "No Name", undefined);

        newPlayer.x = Math.random() * 200 + 100;
        newPlayer.y = Math.random() * 200 + 100;
        newPlayer.width = 46; // 49
        newPlayer.height = 42; // 44

        let playerSpawnPoint = this.gameManager.getDungeonManager().getPlayerSpawnPoint();
        if(playerSpawnPoint !== null) {
            newPlayer.x = playerSpawnPoint.x + (Math.random() * 20 - 10);
            newPlayer.y = playerSpawnPoint.y + (Math.random() * 20 - 10);
        } 

        await this.initPlayerData("", newPlayer, IdToken)

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

        newPlayer.setId(sessionId);
        newPlayer.setBody(body)
        this.gameManager.addGameObject(sessionId, newPlayer, body);
    } 

    public removePlayer(sessionId: string) {
        this.gameManager.removeGameObject(sessionId);
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