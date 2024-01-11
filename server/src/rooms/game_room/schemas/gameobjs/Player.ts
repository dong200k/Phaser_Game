import { ArraySchema, type, Schema, filter } from '@colyseus/schema';
import Entity from './Entity';
import StatTree from '../Trees/StatTree';
import SkillData from '../Trees/Node/Data/SkillData';
import WeaponUpgradeTree from '../Trees/WeaponUpgradeTree';
import Cooldown from './Cooldown';
import GameManager from '../../system/GameManager';
import PlayerController from '../../system/StateControllers/PlayerControllers/PlayerController';
import Ability from './Ability';
import ctors, { IRoleControllerClasses } from '../../system/StateControllers/RoleControllerClasses';
import Artifact from '../Trees/Artifact';
import WeaponData from '../Trees/Node/Data/WeaponData';
import Node from '../Trees/Node/Node';

interface IUpgradeItemConfig {
    name: string;
    type: "weapon" | "artifact";
    description: string;
    imageKey: string;
    tree: WeaponUpgradeTree;
    upgradeNode: Node<WeaponData>
}

export class UpgradeItem extends Schema {
    @type('string') name: string = "";
    @type('string') type: "weapon" | "artifact";
    @type('string') description: string;
    @type('string') imageKey: string;
    private tree: WeaponUpgradeTree
    private upgradeNode: Node<WeaponData>

    constructor(config: IUpgradeItemConfig) {
        super();
        this.name = config.name;
        this.type = config.type;
        this.description = config.description;
        this.imageKey = config.imageKey;
        this.tree = config.tree
        this.upgradeNode = config.upgradeNode
    }

    isEqual(upgradeItem: UpgradeItem){
        return upgradeItem.name === this.name 
            && upgradeItem.description === this.description 
            && upgradeItem.type === this.type
            && upgradeItem.imageKey === this.imageKey
            && upgradeItem.tree === this.tree
            && upgradeItem.upgradeNode === this.upgradeNode
    }

    getTree(){
        return this.tree
    }

    getUpgradeNode(){
        return this.upgradeNode
    }
}

class UpgradeInfo extends Schema {
    /** Flag to check if the player is currently selecting an upgrade. */
    @type('boolean') playerIsSelectingUpgrades: boolean = false;
    /** Used to notify the player of an upgrade. */
    @type('number') upgradePing: number = 0;
    /** Number of times the player has selected an upgrade. */
    @type('number') upgradeCount: number = 0;
    /** A list of the current upgrades the player is choosing from. */
    @type([UpgradeItem]) currentUpgrades: UpgradeItem[] = [];
    /** Upgrade chances left in forge */
    @type('number') forgeUpgradeChances = 0

    /** Used to filter the upgrade info to the correct player. */
    playerId: string;

    constructor(playerId: string) {
        super();
        this.playerId = playerId;
    }

    /** Gives the player the next upgrade that is avaliable in the queue.
     * @param nextUpgrade The list of UpgradeItems that the player will choose from.
     */
    public giveNextUpgrade(nextUpgrade: UpgradeItem[]) {
        if(nextUpgrade.length === 0) console.log("Warn: No player upgrades were given");
        else {
            this.currentUpgrades = nextUpgrade;
            this.playerIsSelectingUpgrades = true;
            this.upgradePing++;
        }
    }

    /** Called when the player has selected an upgrade. */
    public playerSelectedUpgrade() {
        this.currentUpgrades = []
        this.playerIsSelectingUpgrades = false;
        this.upgradeCount++;
    }

    /** Removes an upgrade from the UpgradeItem list.
     * 
     * Called after an upgrade is selected.
     */
    public removeUpgrade(item: UpgradeItem) {
        this.currentUpgrades = this.currentUpgrades.filter(upgrade=>item !== upgrade)
    }

    public incrementUpgradeCount(){
        this.upgradeCount++
    }

    public setForgeUpgradeChances(chances: number){
        this.forgeUpgradeChances = chances
    }
}

export default class Player extends Entity {
    @type('string') role!: string;
    // @type(Cooldown) attackCooldown;
    @type(Cooldown) specialCooldown;
    @type(WeaponUpgradeTree) weaponUpgradeTree;
    @type(StatTree) skillTree;
    @type([Artifact]) artifacts = new ArraySchema<Artifact>();
    @type([Ability]) abilities = new ArraySchema<Ability>()
    @type(Ability) currentAbility?: Ability

    // Levels
    @type('number') level: number;
    @type('number') xp: number;
    @type('number') maxXp: number;

    // Coins
    @type('number') coinsEarned: number = 0;
    @type('number') monstersKilled: number = 0;

    /** The time this player was created. */
    @type("number") joinTime = new Date().getTime();

    /** Upgrade information. Used for the player to select level up upgrades. */
    // @filter((client, value: UpgradeInfo, root) => client.sessionId === value.playerId)
    @type(UpgradeInfo) upgradeInfo: UpgradeInfo;

    // The PlayerController manages the player's dead/alive state.
    @type(PlayerController) playerController!: PlayerController;

    @type("boolean") overwriteClientMoveFlip: boolean = false;

    private dialogSeen: Set<string>;

    private unlockedRoles: string[];

    constructor(gameManager: GameManager, name: string, role?: string) {
        super(gameManager);
        this.name = name;
        this.level = 1;
        this.upgradeInfo = new UpgradeInfo(this.getId());
        this.xp = 0;
        this.maxXp = 100;
        // this.attackCooldown = new Cooldown(1000)
        this.specialCooldown = new Cooldown(5000)
        this.type = "Player";
        this.weaponUpgradeTree = new WeaponUpgradeTree(gameManager, this)
        this.skillTree = new StatTree<SkillData>(gameManager)
        // this.playerController = new PlayerController({player: this});
        this.setRole(role)
        this.dialogSeen = new Set();
        this.unlockedRoles = [];
    }

    update(deltaT: number){
        this.currentAbility?.update(deltaT * 1000);
        this.playerController.update(deltaT);
    }

    setRole(role?: string){
        this.role = role? role: "Ranger";
        if(this.role === "Ranger") {
            this.projectileSpawnOffsetX = 0;
            this.projectileSpawnOffsetY = -12;
        }
    }

    /**
     * If there is a controller tied to the role then the player's controller will be set to that. Else it will be set to the default PlayerController.
     * @param role 
     */
    setController(role: string){
        if(ctors.hasOwnProperty(role)){
            this.playerController = new ctors[role as IRoleControllerClasses]({
                player: this,
            })
        }else{
            this.playerController = new PlayerController({player: this});
        }
    }

    /**
     * Call this method with value = true to overwrite client side prediction flipping based on arrow key presses.
     * Call this method with value = false to allow client side prediction flipping based on arrow key presses.
     * 
     * Note: Usually used so that the flip is kept and not overwritten when server wants player to attack and face a certain way
     * @param value 
     */
    setOverwriteClientMoveFlip(value: boolean){
        this.overwriteClientMoveFlip = value
    }

    /**
     * A set used to store all the dialogs that the player has seen. This
     * is used to store tutorial text dialogs that the player has 
     * already read.
     * @returns A set.
     */
    public getDialogSeen() {
        return this.dialogSeen;
    }

    /**
     * Unlocked roles will contain a list of roles that the player unlocked.
     * This will be populated when the player is created.
     * @returns A list of unlocked roles.
     */
    public getUnlockedRoles() {
        return this.unlockedRoles;
    }
}