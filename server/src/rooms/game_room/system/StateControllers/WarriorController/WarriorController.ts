import Aura from "../../../schemas/gameobjs/aura/Aura";
import AuraFactory from "../../../schemas/gameobjs/aura/AuraFactory";
import GameManager from "../../GameManager";
import Attack from "../PlayerControllers/CommonStates/Attack";
import PlayerController, { PlayerControllerData } from "../PlayerControllers/PlayerController";
import DemoState from "./states/DemoState";

export default class WarriorController extends PlayerController {

    private gameManager!: GameManager
    private warriorAura?: Aura;
    private auraUpgrades = [10, 20, 30];
    private auraLevel = -1;

    protected create(data: PlayerControllerData): void {
        super.create(data)
        this.callStartAttackAnyways = true
        this.gameManager = this.getPlayer().gameManager;

        this.attackState.setConfig({
            canMove: false,
            triggerPercent: 0.3,
            attackDuration: 1
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

    public getGameManager() {
        return this.gameManager;
    }

    update(deltaT: number){
        super.update(deltaT);
    }
}