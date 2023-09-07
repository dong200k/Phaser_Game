import { ArraySchema, type, Schema, filter } from '@colyseus/schema';
import Entity from './Entity';
import StatTree from '../Trees/StatTree';
import SkillData from '../Trees/Node/Data/SkillData';
import WeaponUpgradeTree from '../Trees/WeaponUpgradeTree';
import Cooldown from './Cooldown';
import GameManager from '../../system/GameManager';
import PlayerController from '../../system/StateControllers/PlayerControllers/PlayerController';
import Ability from './Ability';

interface IUpgradeItemConfig {
    name: string;
    type: "weapon" | "artifact";
    description: string;
    imageKey: string;
}

export class UpgradeItem extends Schema {
    @type('string') name: string = "";
    @type('string') type: "weapon" | "artifact";
    @type('string') description: string;
    @type('string') imageKey: string;

    constructor(config: IUpgradeItemConfig) {
        super();
        this.name = config.name;
        this.type = config.type;
        this.description = config.description;
        this.imageKey = config.imageKey;
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
        this.currentUpgrades = [];
        this.playerIsSelectingUpgrades = false;
        this.upgradeCount++;
    }
}

export default class Player extends Entity {
    @type('string') name;
    @type('string') role;
    // @type(Cooldown) attackCooldown;
    @type(Cooldown) specialCooldown;
    @type(WeaponUpgradeTree) weaponUpgradeTree;
    @type(StatTree) skillTree;
    @type([WeaponUpgradeTree]) artifacts = new ArraySchema<WeaponUpgradeTree>();
    @type([Ability]) abilities = new ArraySchema<Ability>()
    @type(Ability) currentAbility?: Ability

    // Levels
    @type('number') level: number;
    @type('number') xp: number;
    @type('number') maxXp: number;

    /** Upgrade information. Used for the player to select level up upgrades. */
    // @filter((client, value: UpgradeInfo, root) => client.sessionId === value.playerId)
    @type(UpgradeInfo) upgradeInfo: UpgradeInfo;

    // The PlayerController manages the player's dead/alive state.
    @type(PlayerController) playerController: PlayerController;

    constructor(gameManager: GameManager, name: string, role?: string) {
        super(gameManager);
        this.name = name;
        this.level = 1;
        this.upgradeInfo = new UpgradeInfo(this.getId());
        this.xp = 0;
        this.maxXp = 100;
        this.role = role? role: "Ranger";
        // this.attackCooldown = new Cooldown(1000)
        this.specialCooldown = new Cooldown(5000)
        this.type = "Player";
        this.weaponUpgradeTree = new WeaponUpgradeTree(gameManager, this)
        this.skillTree = new StatTree<SkillData>(gameManager)
        this.stat.speed = 35;
        // this.stat.attackSpeed = 10;
        this.playerController = new PlayerController({player: this});

        if(this.role === "Ranger") {
            this.projectileSpawnOffsetX = 0;
            this.projectileSpawnOffsetY = -12;
        }


    }
}