import Matter from "matter-js";
import MonsterController from "../../../system/AI/MonsterAI/simplemonster/MonsterController";
import StateMachine from "../../../system/StateMachine/StateMachine";
import { IMonsterConfig } from "../../../system/interfaces";
import Entity from "../Entity";
import { type } from "@colyseus/schema";
import { Categories } from "../../../system/Collisions/Category";
import MaskManager from "../../../system/Collisions/MaskManager";
import Stat from "../Stat";
import GameManager from "../../../system/GameManager";


export default class Monster extends Entity {

    @type("string") private monsterName: string;
    @type(MonsterController) controller: MonsterController;
    private aggroTarget: Entity | null = null;
    private prevHp: number;
    private config: IMonsterConfig;

    constructor(gameManager: GameManager, config: IMonsterConfig) {
        super(gameManager);
        this.config = config;
        this.monsterName = config.name;
        this.setConfig(this.config);
        this.prevHp = this.stat.hp;
        this.type = "Monster";

        // Create Matter Body
        let body = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height, {
            isStatic: false,
        });
        body.collisionFilter = {
            group: 0,
            category: Categories.MONSTER,
            mask: MaskManager.getManager().getMask('MONSTER'),
        }
        this.body = body;
        this.controller = new MonsterController({monster: this, playerManager: gameManager.getPlayerManager()});
    }

    public setController(contorller: MonsterController) {
        this.controller = contorller;
    }

    public getMonsterName() {
        return this.monsterName;
    }

    /**
     * Sets a new aggroTarget for this monster.
     * @param aggroTarget The aggroTarget.
     */
    public setAggroTarget(aggroTarget: Entity | null) {
        this.aggroTarget = aggroTarget;
    }

    public getAggroTarget() {
        return this.aggroTarget;
    }

    /**
     * Updates this monster by updating its ai controller.
     * @param deltaT time passed in seconds.
     */
    public update(deltaT: number) {
        this.controller?.update(deltaT);

        // if(this.stat.hp != this.prevHp){
        //     //console.log(`Monster took ${this.stat.hp - this.prevHp} damage`)
        //     this.prevHp = this.stat.hp;
        // }

        // if(this.stat.hp <= 0){
        //     //console.log("Monster Down");
        //     this.setActive(false);
        // }
    }

    /** Sets this monster's fields based on the given config object. */
    public setConfig(config: IMonsterConfig) {
        this.monsterName = config.name;
        this.width = config.width;
        this.height = config.height;
        this.poolType = config.poolType ?? config.name;
        this.stat.setStats(config.stat);
    }

    /**
     * Reset this monster to its original state. This will reset the stats, enable collisions and sets active and visible field to true.
     */
    public reset() {
        this.enableCollisions();
        this.setConfig(this.config);
        this.active = true;
        this.visible = true;
    }

    /** Disable collision on the Matter body associated with this object. 
     * Used when this Monster is returned to the MonsterPool.
    */
    public disableCollisions() {
        this.body.collisionFilter = {
            ...this.body.collisionFilter,
            group: -1,
            mask: 0,
        }
    }

    /** Enable collision on the Matter body associated with this object. */
    public enableCollisions() {
        this.body.collisionFilter = {
            group: 0,
            category: Categories.MONSTER,
            mask: MaskManager.getManager().getMask('MONSTER'),
        }
    }
}