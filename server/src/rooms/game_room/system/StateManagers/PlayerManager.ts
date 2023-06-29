import Matter, { Bodies } from 'matter-js';
import Player from '../../schemas/gameobjs/Player';
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

interface InputPlayload {
    payload: number[];
    playerId: string;
}

export default class PlayerManager{
    private gameManager: GameManager

    private inputPayloads: InputPlayload[] = [];


    constructor(gameManager: GameManager) {
        this.gameManager = gameManager
    }   

    update(deltaT: number){
        // update special and attack cooldowns for each player
        this.gameManager.state.gameObjects.forEach((gameObject, key)=>{
            if(gameObject instanceof Player){
                // gameObject.attackCooldown.tick(deltaT)
                gameObject.specialCooldown.tick(deltaT)
            }
        })

        this.processMovementInputPayload();
    }

    getPlayerStateAndBody(sessionId: string){
        return {playerBody: this.gameManager.matterBodies.get(sessionId) as Matter.Body, playerState: this.gameManager.state.gameObjects.get(sessionId) as Player}
    }

    processPlayerAttack(playerId: string, data: any){
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

    private processMovementInputPayload() {
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
                    this.processPlayerMovement(playerId, item.payload);

                } else {
                    // Save packet for future ticks.
                    this.inputPayloads.push(item);
                }
            }
            loopCount--;
        }
    }

    processPlayerMovement(playerId: string, data: number[]){
        let {playerBody, playerState} = this.getPlayerStateAndBody(playerId)
        if(!playerBody || !playerState) return console.log("player does not exist")

        //calculate new player velocity
        let speed = playerState.stat.speed;
        let x = 0;
        let y = 0;
        if(data[0]) y -= 1;
        if(data[1]) y += 1;
        if(data[2]) x -= 1;
        if(data[3]) x += 1;
        let velocity = MathUtil.getNormalizedSpeed(x, y, speed)
        Matter.Body.setVelocity(playerBody, velocity);
    }

    processPlayerSpecial(playerId: string, useSpecial: boolean){
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
    private initPlayerData(playerId: string, player: Player){
        //*** TODO *** initialize weapon upgrade tree based on role
        //Set weaponupgrade tree for player with a test weapon
        let root = WeaponUpgradeFactory.createTribowUpgrade()
        WeaponManager.equipWeaponUpgrade(player, root)

        // Equip aritfacts
        let upgradedHermesBoots = ArtifactFactory.createUpgradedHermesBoot()
        let upgradedFrostGlaive = ArtifactFactory.createUpgradeFrostGlaive()
        let upgradedDemoArtifact = ArtifactFactory.createDemo()
        this.gameManager.getArtifactManager().equipArtifact(player, upgradedHermesBoots)
        // ArtifactManager.equipArtifact(player, upgradedFrostGlaive)
        this.gameManager.getArtifactManager().equipArtifact(player, upgradedDemoArtifact)

        // Equip skill tree
        let maxedSkillTree = SkillTreeFactory.createUpgradedAdventurerSkill()
        SkillTreeManager.equipSkillTree(player, maxedSkillTree)
    }

    public async createPlayer(sessionId: string, isOwner: boolean, gameManager?: GameManager) {
        if(isOwner) this.gameManager.setOwner(sessionId)

        //TODO: get player data from the database
        let newPlayer = new Player("No Name", undefined, gameManager);
        newPlayer.x = Math.random() * 200 + 100;
        newPlayer.y = Math.random() * 200 + 100;
        let playerSpawnPoint = this.gameManager.getDungeonManager().getPlayerSpawnPoint();
        if(playerSpawnPoint !== null) {
            newPlayer.x = playerSpawnPoint.x + (Math.random() * 20 - 10);
            newPlayer.y = playerSpawnPoint.y + (Math.random() * 20 - 10);
        } 

        this.initPlayerData("", newPlayer)

        let body = Matter.Bodies.rectangle(newPlayer.x, newPlayer.y, 49, 44, {
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
}