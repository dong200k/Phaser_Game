import Aura from "../../../schemas/gameobjs/aura/Aura";
import AuraFactory from "../../../schemas/gameobjs/aura/AuraFactory";
import GameManager from "../../GameManager";
import Attack from "../PlayerControllers/CommonStates/Attack";
import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";
import DemoState from "./states/DemoState";
import Special from "./states/Special";

export default class WarriorController extends PlayerController {

    private gameManager!: GameManager
    private warriorAura?: Aura;

    // Aura upgrades.
    private auraUpgrades = [10, 20, 30];
    private auraLevel = -1;

    // Knockback upgrades.
    private knockbackLevel = -1;
    private knockbackAttack = [10, 20, 20];
    private knockbackAbility = [0, 20, 60];

    // Slow upgrades.
    private speedFactor = 0.3; // The monster's speed will be multiplied by this number. E.g. 0.3 means the monster will be at 30% speed.
    private slowTimes = [3, 6, 9]; // An array of the slow times that can be upgraded. Starts at index 0.
    private slowTimeLevel = 0; // The slowTime index. Starting from 0.

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager;

        this.attackState.setConfig({
            canMove: false,
            triggerPercent: 0.3,
            attackDuration: 1
        })

        this.specialState = new Special("Special", this);
        this.removeState("Special");
        this.addState(this.specialState);

        this.specialState.setConfig({
            attackDuration: 1,
            triggerPercent: 0.5,
        })

        this.changeState("Idle");
    }

    /** Upgrade the warrior's aura based on a predefined auraUpgrades array. */
    public upgradeWarriorAura() {
        // Remove previous aura.
        if(this.warriorAura) {
            this.warriorAura.setActive(false);
            this.warriorAura.auraController.setFollowTarget(undefined);
        }

        // Set Aura level.
        this.auraLevel++;
        if(this.auraLevel >= this.auraUpgrades.length) 
            this.auraLevel = this.auraUpgrades.length - 1;

        // Add new aura.
        this.warriorAura = this.gameManager.getAuraManager().spawnAura({
            name: "ArmorAura",
        }, (gameManager: GameManager) => {
            let newAura = AuraFactory.createArmorAura(gameManager, this.auraUpgrades[this.auraLevel], ["PLAYER"]);
            newAura.x = this.player.x;
            newAura.y = this.player.y;
            return newAura;
        }).aura;
        this.warriorAura.auraController.setFollowTarget(this.player);
    }

    /** Increase the knockback level. This will update the value that is returned from 
     * getKnockbackAttack() and getKnockbackAbility().
     */
    public upgradeWarriorKnockback() {
        // Set knockback level.
        this.knockbackLevel++;
        let maxKnockbackLevel = Math.min(this.knockbackAbility.length - 1, this.knockbackAttack.length - 1);
        if(this.knockbackLevel > maxKnockbackLevel) {
            this.knockbackLevel = maxKnockbackLevel;
        }
    }

    public getGameManager() {
        return this.gameManager;
    }

    update(deltaT: number){
        super.update(deltaT);
    }

    /** Returns the distance attacks should knockback enemies. */
    public getKnockbackAttack() {
        if(this.knockbackLevel === -1) return 0;
        return this.knockbackAttack[this.knockbackLevel];
    }

    /** Returns the distance ability should knockback enemies. */
    public getKnockbackAbility() {
        if(this.knockbackLevel === -1) return 0;
        return this.knockbackAbility[this.knockbackLevel];
    }

    /** Upgrades the slow time of the warrior ability. This method wont do anything when the level is 
     * maxxed out.
     * @returns True if the upgrade was successful. False otherwise.
     */
    public upgradeSlowTime() {
        this.slowTimeLevel++;
        if(this.slowTimeLevel >= this.slowTimes.length) {
            this.slowTimeLevel = this.slowTimes.length - 1;
            return false;
        } 
        return true;
    }

    public getSlowTime() {
        return this.slowTimes[this.slowTimeLevel];
    }

    /**
     * The monster's speed will be multiplied by this number. E.g. 0.6 means the monster will be at 60% speed.
     */
    public getSpeedFactor() {
        return this.speedFactor;
    }
}