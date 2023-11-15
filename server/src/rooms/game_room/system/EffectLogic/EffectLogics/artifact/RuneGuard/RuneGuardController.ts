import Projectile from "../../../../../schemas/projectiles/Projectile";
import GameManager from "../../../../GameManager";
import StateMachine from "../../../../StateMachine/StateMachine";
import { RuneGuard } from "./RuneGuard";
import Attack from "./states/Attack";

export interface RuneGuardControllerData {
    projectile: Projectile;
    runeGuardEffectLogic: RuneGuard;
    gameManager: GameManager;
}

export default class RuneGuardController extends StateMachine<RuneGuardControllerData> {

    private projectile!: Projectile;
    public runeGuardEffectLogic!: RuneGuard
    private gameManager!: GameManager

    protected create(data: RuneGuardControllerData): void {
        this.projectile = data.projectile;
        this.runeGuardEffectLogic = data.runeGuardEffectLogic
        this.gameManager = data.gameManager

        let attack = new Attack("Attack", this);
        this.addState(attack);

        this.changeState("Attack");
    }

    public postUpdate(deltaT: number): void {
        
    }

    public getProjectile() {
        return this.projectile;
    }

    public getGameManager() {
        return this.gameManager
    }
}